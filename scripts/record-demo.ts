/**
 * Records a silent, captioned walkthrough of the site as an MP4.
 *
 *   bun run demo                 build, serve, record  ->  demo/hri-lab-demo.mp4
 *   bun run demo -- --skip-build reuse the existing .next build
 *   bun run demo -- --headed     watch the browser while it records
 *
 * Edit the FLOWS list at the bottom to reorder, cut or retime what is shown.
 * The contact form request is intercepted, so nothing reaches the real Formspree inbox.
 */
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Locator, type Page } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const VIEW = { width: 1600, height: 900 }; // recorded size; ffmpeg upscales to 1920x1080
const OUT_DIR = join(HERE, "..", "demo");
const RAW_DIR = join(OUT_DIR, "raw");
const OUT_FILE = join(OUT_DIR, "hri-lab-demo.mp4");

const args = new Set(process.argv.slice(2));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- server

function run(cmd: string, argv: string[]) {
  const r = spawnSync(cmd, argv, { stdio: "inherit", cwd: join(HERE, "..") });
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(" ")} failed`);
}

async function startServer(): Promise<ChildProcess> {
  const server = spawn("bun", ["run", "start", "-p", String(PORT)], {
    cwd: join(HERE, ".."),
    stdio: "ignore",
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return server;
    } catch {}
    await sleep(500);
  }
  server.kill();
  throw new Error(`Server did not come up on ${BASE}`);
}

// ---------------------------------------------------------------- on-page overlay
// Cursor, click ripple, caption pill and title card. Appended to <html>, outside
// <body>, so React never touches them. Re-injected on every full page load.

const OVERLAY_JS = `
(() => {
  const mount = () => {
    if (document.getElementById("demo-ui")) return;
    const root = document.createElement("div");
    root.id = "demo-ui";
    root.innerHTML = \`
      <style>
        #demo-ui { position: fixed; inset: 0; pointer-events: none; z-index: 2147483647; font-family: var(--font-sans-face), system-ui, sans-serif; }
        #demo-cursor { position: absolute; left: 0; top: 0; width: 28px; height: 28px; margin: -3px 0 0 -3px; transition: transform .12s ease; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
        #demo-cursor.down { transform: scale(.86); }
        .demo-ripple { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; border: 3px solid #e4067e; animation: demo-ripple .6s ease-out forwards; }
        @keyframes demo-ripple { to { transform: scale(4.2); opacity: 0; } }
        #demo-caption { position: absolute; left: 50%; bottom: 44px; transform: translate(-50%, 12px); opacity: 0; transition: opacity .45s ease, transform .45s ease;
          background: #342b60; color: #fff; font-size: 30px; font-weight: 500; letter-spacing: -.01em; padding: 14px 30px; border-radius: 999px; white-space: nowrap; box-shadow: 0 10px 30px rgba(52,43,96,.35); }
        #demo-caption.on { opacity: 1; transform: translate(-50%, 0); }
        #demo-card { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; background: #342b60; color: #fff; opacity: 0; transition: opacity .7s ease; }
        #demo-card.on { opacity: 1; }
        #demo-card.instant { transition: none; }
        #demo-card h1 { font-size: 64px; font-weight: 500; letter-spacing: -.035em; margin: 0; color: #fff !important; }
        #demo-card p { font-size: 26px; margin: 0; color: rgba(255,255,255,.78) !important; }
        #demo-card i { width: 14px; height: 14px; border-radius: 50%; background: #e4067e; }
      </style>
      <div id="demo-card"><i></i><h1></h1><p></p></div>
      <div id="demo-caption"></div>
      <svg id="demo-cursor" viewBox="0 0 24 24"><path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="#fff" stroke="#342b60" stroke-width="1.6" stroke-linejoin="round"/></svg>\`;
    document.documentElement.appendChild(root);
    const cur = root.querySelector("#demo-cursor");
    const place = (x, y) => { cur.style.left = x + "px"; cur.style.top = y + "px"; };
    place(-100, -100);
    addEventListener("mousemove", (e) => place(e.clientX, e.clientY), true);
    addEventListener("mousedown", (e) => {
      cur.classList.add("down");
      const r = document.createElement("div");
      r.className = "demo-ripple";
      r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
      root.appendChild(r);
      setTimeout(() => r.remove(), 700);
    }, true);
    addEventListener("mouseup", () => cur.classList.remove("down"), true);
  };
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", mount); else mount();
})();
`;

// ---------------------------------------------------------------- helpers
// Everything here is tuned to look like a quick, slightly imperfect human: variable speed,
// cursor that drifts while the page is being read, small overshoots, uneven typing.
// A seeded random generator keeps every recording the same, so a re-run is a re-run, not a surprise.

let seed = 11;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (a: number, b: number) => a + rnd() * (b - a);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Pt = { x: number; y: number };

class Director {
  private cur: Pt = { x: VIEW.width * 0.62, y: VIEW.height * 0.55 };
  constructor(readonly page: Page) {}

  pause = (ms: number) => sleep(ms);

  async caption(text: string | null) {
    await this.page.evaluate((t) => {
      const el = document.getElementById("demo-caption")!;
      if (t === null) return el.classList.remove("on");
      el.textContent = t; // swapping text while visible reads as a quick cross-cut
      el.classList.add("on");
    }, text);
  }

  async card(title: string | null, sub = "", instant = false) {
    await this.page.evaluate(
      ([t, s, now]) => {
        const el = document.getElementById("demo-card")!;
        el.classList.toggle("instant", now); // no fade-in, so the very first frame is already the card
        if (t === null) return el.classList.remove("on");
        el.querySelector("h1")!.textContent = t;
        el.querySelector("p")!.textContent = s;
        el.classList.add("on");
      },
      [title, sub, instant] as const,
    );
  }

  /** Smooth scroll with a fast start and a soft landing, like a flick of the wheel. */
  async scrollTo(top: number, ms = 700) {
    await this.page.evaluate(
      ([to, dur]) =>
        new Promise<void>((done) => {
          const from = scrollY;
          const max = document.documentElement.scrollHeight - innerHeight;
          const target = Math.max(0, Math.min(to, max));
          const t0 = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - t0) / dur);
            const e = 1 - Math.pow(1 - t, 3);
            scrollTo({ top: from + (target - from) * e, behavior: "instant" });
            if (t < 1) requestAnimationFrame(step);
            else done();
          };
          requestAnimationFrame(step);
        }),
      [top, ms] as const,
    );
  }

  /** Scroll so that the element sits near the top of the screen. */
  async scrollToEl(selector: string, ms = 800) {
    const top = await this.page.evaluate(
      (s) => document.querySelector(s)!.getBoundingClientRect().top + scrollY - 120,
      selector,
    );
    await this.scrollTo(top, ms);
  }

  /** Move the mouse with a human-ish path: quick start, slow arrival, a little arc, a little shake. */
  async glide(to: Pt, ms?: number, overshoot = false) {
    const from = { ...this.cur };
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dur = ms ?? clamp(200 + dist * 0.3, 240, 600);

    if (overshoot && dist > 450) {
      const over = between(8, 18);
      await this.glide({ x: to.x + (dx / dist) * over, y: to.y + (dy / dist) * over }, dur * 0.9);
      await this.glide(to, 110);
      return;
    }

    const steps = Math.max(10, Math.round(dur / 16));
    const bow = dist * between(0.03, 0.07) * (rnd() > 0.5 ? 1 : -1);
    for (let i = 1; i <= steps; i++) {
      const t = 1 - Math.pow(1 - i / steps, 2.6);
      const arc = Math.sin(Math.PI * t) * bow;
      const shake = i < steps ? between(-0.7, 0.7) : 0;
      await this.page.mouse.move(
        from.x + dx * t - (dy / dist) * arc + shake,
        from.y + dy * t + (dx / dist) * arc + shake,
      );
      await sleep(dur / steps);
    }
    this.cur = to;
  }

  /** Spend `ms` looking at the page: the cursor wanders a little instead of freezing. */
  async idle(ms: number) {
    const end = Date.now() + ms;
    while (Date.now() < end - 150) {
      const next = {
        x: clamp(this.cur.x + between(-90, 90), 120, VIEW.width - 120),
        y: clamp(this.cur.y + between(-50, 50), 160, VIEW.height - 160),
      };
      await this.glide(next, between(300, 480));
      await sleep(Math.min(between(60, 200), Math.max(0, end - Date.now())));
    }
  }

  /** Scroll down in uneven flicks while the cursor drifts, pausing briefly to take things in. */
  async tour({ stops = 4, pauseMs = 550 } = {}) {
    for (let i = 0; i < stops; i++) {
      const { y, max } = await this.page.evaluate(() => ({
        y: scrollY,
        max: document.documentElement.scrollHeight - innerHeight,
      }));
      if (y >= max - 2) break;
      const dur = between(520, 800);
      await Promise.all([
        this.scrollTo(y + VIEW.height * between(0.62, 0.95), dur),
        this.glide(
          { x: clamp(this.cur.x + between(-160, 160), 160, VIEW.width - 160), y: between(280, 640) },
          dur,
        ),
      ]);
      await this.idle(pauseMs * between(0.7, 1.3));
    }
  }

  /** Bring an element into view (upper-middle of the screen) if it is not comfortably visible. */
  async reveal(target: Locator) {
    const box = await target.boundingBox();
    if (!box) throw new Error("element not visible");
    if (box.y > 140 && box.y + box.height < VIEW.height - 140) return;
    const y = await this.page.evaluate(() => scrollY);
    await this.scrollTo(y + box.y - VIEW.height * 0.35, 600);
    await sleep(80);
  }

  async moveTo(target: Locator, at: "centre" | "left" = "centre") {
    await this.reveal(target);
    const b = (await target.boundingBox())!;
    await this.glide(
      {
        x: at === "left" ? b.x + between(30, 60) : b.x + b.width * between(0.35, 0.65),
        y: b.y + b.height * between(0.4, 0.6),
      },
      undefined,
      true,
    );
  }

  async click(target: Locator, at: "centre" | "left" = "centre") {
    await this.moveTo(target, at);
    await sleep(between(60, 140));
    await this.page.mouse.down();
    await sleep(between(50, 90));
    await this.page.mouse.up();
    await sleep(between(110, 190));
  }

  /** Click into a field and type with uneven rhythm: fast runs, small hesitations. */
  async type(target: Locator, text: string) {
    await this.click(target, "left");
    for (const ch of text) {
      await this.page.keyboard.type(ch);
      await sleep(between(18, 55) + (" ,.—".includes(ch) && rnd() > 0.6 ? between(60, 130) : 0));
    }
    await sleep(between(120, 220));
  }

  /** Click a link and wait for the client-side route change to land. */
  async go(target: Locator, path: string) {
    await this.click(target);
    await this.page.waitForURL((u) => u.pathname === path || (u.pathname + u.hash).startsWith(path));
    await this.page.evaluate(() => document.fonts.ready);
    await sleep(380); // let the page's entrance animation get going
  }
}

// ---------------------------------------------------------------- flows
// Each flow = one caption + the actions that happen under it. Reorder or delete freely.
// Captions swap directly from one flow to the next, so there is never dead air between them.

type Flow = { caption: string; run: (d: Director) => Promise<void> };

const nav = (d: Director, href: string) => d.page.locator(`nav[aria-label="Main"] a[href="${href}"]`);

const FLOWS: Flow[] = [
  {
    caption: "Meet the HRI Lab",
    async run(d) {
      await d.pause(900); // hero animates in
      await d.glide({ x: 1150, y: 360 }); // sweep over the speech-bubble artwork
      await d.pause(450);
      await Promise.all([d.scrollTo(560, 700), d.glide({ x: 1000, y: 520 }, 700)]);
      await d.idle(500);
    },
  },
  {
    caption: "Helping carers understand people who can’t speak",
    async run(d) {
      await d.go(d.page.getByRole("link", { name: "Read the idea" }), "/research");
      await d.tour({ stops: 4, pauseMs: 500 });
    },
  },
  {
    caption: "Sensors that read gaze, brain and body signals",
    async run(d) {
      await d.go(d.page.getByRole("link", { name: "How the sensors work" }).first(), "/equipment");
      await d.idle(300);
      await d.click(d.page.getByRole("link", { name: "Eye tracker" }).first()); // anchor jump, native smooth scroll
      await d.idle(900);
      await d.scrollToEl("#eeg");
      await d.idle(600);
      await d.scrollToEl("#skin-response");
      await d.idle(600);
      await d.tour({ stops: 2, pauseMs: 450 });
    },
  },
  {
    caption: "How the lab works with industry",
    async run(d) {
      await d.go(nav(d, "/lab"), "/lab");
      await d.tour({ stops: 3, pauseMs: 450 });
    },
  },
  {
    caption: "Anyone can get involved — consent first",
    async run(d) {
      await d.go(d.page.getByRole("link", { name: "Get in touch" }).first(), "/contact");

      const form = d.page.locator("form");
      await d.scrollTo(380, 650);
      await d.pause(150);

      await d.type(form.locator("#name"), "Maria Tamm");
      await d.type(form.locator("#email"), "maria.tamm@example.com");
      await d.click(form.getByText("Carer or therapist", { exact: true }));
      await d.type(form.locator("#org"), "Kohtla-Järve Care Home");
      await d.click(form.getByText("Taking part in a pilot", { exact: true }));
      await d.click(form.getByText("TalTech", { exact: true }));
      await d.type(form.locator("#feedback"), "Makes sense. Families should stay in control.");
      await d.click(form.locator('input[name="consent"]'));
      await d.click(form.getByRole("button", { name: "Send" }));

      await d.page.getByRole("heading", { name: /Thank you/ }).waitFor();
      await d.idle(2000);
    },
  },
];

// ---------------------------------------------------------------- main

async function main() {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(RAW_DIR, { recursive: true });

  if (!args.has("--skip-build")) run("bun", ["run", "build"]);
  const server = await startServer();

  const browser = await chromium.launch({ headless: !args.has("--headed") });
  try {
    const t0 = Date.now();
    const context = await browser.newContext({
      viewport: VIEW,
      recordVideo: { dir: RAW_DIR, size: VIEW },
      reducedMotion: "no-preference",
    });
    await context.addInitScript(OVERLAY_JS);

    // Never hit the real Formspree inbox: pretend it accepted the submission.
    await context.route("https://formspree.io/**", async (route) => {
      await sleep(700); // long enough to see the "Sending…" state
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });

    const page = await context.newPage();
    const d = new Director(page);

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await d.card("Human–Robot Interaction Lab", "TalTech Virumaa College · concept site by team AMP Dave", true);
    await page.waitForTimeout(100);
    const trimStart = (Date.now() - t0) / 1000 - 0.15; // everything before the title card is page loading
    await d.pause(1500);
    await d.card(null);
    await d.pause(300);

    for (const flow of FLOWS) {
      await d.caption(flow.caption); // swaps straight from the previous caption, no gap
      await flow.run(d);
    }
    await d.caption(null);

    await d.card("HRI Lab", "Team AMP Dave · TalTech Virumaa College");
    await d.pause(2200);

    await context.close(); // flushes the video to disk
    const raw = readdirSync(RAW_DIR).find((f) => f.endsWith(".webm"));
    if (!raw) throw new Error("No video was written");

    run("ffmpeg", [
      "-y", "-loglevel", "error",
      "-ss", trimStart.toFixed(2),
      "-i", join(RAW_DIR, raw),
      "-vf", "scale=1920:1080:flags=lanczos,fps=30",
      "-c:v", "libx264", "-preset", "slow", "-crf", "17",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      OUT_FILE,
    ]);
    console.log(`\nDone: ${OUT_FILE}`);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
