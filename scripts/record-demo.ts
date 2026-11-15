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
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

type Pt = { x: number; y: number };

class Director {
  private cur: Pt = { x: VIEW.width / 2, y: VIEW.height / 2 };
  constructor(readonly page: Page) {}

  pause = (ms: number) => sleep(ms);

  async caption(text: string | null) {
    await this.page.evaluate((t) => {
      const el = document.getElementById("demo-caption")!;
      if (t === null) return el.classList.remove("on");
      el.textContent = t;
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

  async scrollTo(top: number, ms = 1400) {
    await this.page.evaluate(
      ([to, dur]) =>
        new Promise<void>((done) => {
          const from = scrollY;
          const max = document.documentElement.scrollHeight - innerHeight;
          const target = Math.max(0, Math.min(to, max));
          const t0 = performance.now();
          const e = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
          const step = (now: number) => {
            const t = Math.min(1, (now - t0) / dur);
            scrollTo({ top: from + (target - from) * e(t), behavior: "instant" });
            if (t < 1) requestAnimationFrame(step);
            else done();
          };
          requestAnimationFrame(step);
        }),
      [top, ms] as const,
    );
  }

  /** Scroll down a screenful at a time, pausing so each part can be read. */
  async tour({ stops = 6, pauseMs = 1500, fraction = 0.72 } = {}) {
    for (let i = 0; i < stops; i++) {
      const { y, max } = await this.page.evaluate(() => ({
        y: scrollY,
        max: document.documentElement.scrollHeight - innerHeight,
      }));
      if (y >= max - 2) break;
      await this.scrollTo(y + VIEW.height * fraction);
      await sleep(pauseMs);
    }
  }

  /** Bring an element comfortably into view (centre-ish), if it is not already. */
  async reveal(target: Locator) {
    const box = await target.boundingBox();
    if (!box) throw new Error("element not visible");
    if (box.y > 160 && box.y + box.height < VIEW.height - 160) return;
    const y = await this.page.evaluate(() => scrollY);
    await this.scrollTo(y + box.y - VIEW.height * 0.3, 1100);
    await sleep(250);
  }

  async glide(to: Pt, ms = 750) {
    const from = { ...this.cur };
    const steps = Math.max(14, Math.round(ms / 16));
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const bow = Math.hypot(dx, dy) * 0.07; // slight arc so it reads as a human hand
    for (let i = 1; i <= steps; i++) {
      const t = ease(i / steps);
      const arc = Math.sin(Math.PI * t) * bow;
      await this.page.mouse.move(from.x + dx * t - (dy / (Math.hypot(dx, dy) || 1)) * arc, from.y + dy * t + (dx / (Math.hypot(dx, dy) || 1)) * arc);
      await sleep(ms / steps);
    }
    this.cur = to;
  }

  async moveTo(target: Locator, at: "centre" | "left" = "centre") {
    await this.reveal(target);
    const b = (await target.boundingBox())!;
    await this.glide({ x: at === "left" ? b.x + 48 : b.x + b.width / 2, y: b.y + b.height / 2 });
  }

  async click(target: Locator, at: "centre" | "left" = "centre") {
    await this.moveTo(target, at);
    await sleep(180);
    await this.page.mouse.down();
    await sleep(90);
    await this.page.mouse.up();
    await sleep(250);
  }

  async type(target: Locator, text: string) {
    await this.click(target, "left");
    await this.page.keyboard.type(text, { delay: 65 });
    await sleep(350);
  }

  /** Click a link and wait for the client-side route change to land. */
  async go(target: Locator, path: string) {
    await this.click(target);
    await this.page.waitForURL((u) => u.pathname === path || (u.pathname + u.hash).startsWith(path));
    await this.page.evaluate(() => document.fonts.ready);
    await sleep(900); // let the page's entrance animation finish
  }
}

// ---------------------------------------------------------------- flows
// Each flow = one caption + the actions that happen under it. Reorder or delete freely.

type Flow = { caption: string; run: (d: Director) => Promise<void> };

const nav = (d: Director, href: string) => d.page.locator(`nav[aria-label="Main"] a[href="${href}"]`);

const FLOWS: Flow[] = [
  {
    caption: "Meet the HRI Lab",
    async run(d) {
      await d.pause(2200); // hero animates in
      await d.glide({ x: 1180, y: 380 }, 900); // hover the speech-bubble artwork
      await d.pause(1800);
      await d.page.getByRole("heading", { name: /A sound can mean/ }).waitFor();
      await d.scrollTo(560, 1500);
      await d.pause(2200);
    },
  },
  {
    caption: "Helping carers understand people who can’t speak",
    async run(d) {
      await d.go(d.page.getByRole("link", { name: "Read the idea" }), "/research");
      await d.pause(800);
      await d.tour({ stops: 7, pauseMs: 1500 });
    },
  },
  {
    caption: "Sensors that read gaze, brain and body signals",
    async run(d) {
      await d.go(d.page.getByRole("link", { name: "How the sensors work" }).first(), "/equipment");
      await d.pause(800);
      await d.tour({ stops: 7, pauseMs: 1400 });
    },
  },
  {
    caption: "How the lab works with industry",
    async run(d) {
      await d.go(nav(d, "/lab"), "/lab");
      await d.pause(900);
      await d.tour({ stops: 5, pauseMs: 1400 });
    },
  },
  {
    caption: "Anyone can get involved — consent first",
    async run(d) {
      await d.go(d.page.getByRole("link", { name: "Get in touch" }).first(), "/contact");
      await d.pause(900);

      const form = d.page.locator("form");
      await d.scrollTo(380, 1200);
      await d.pause(500);

      await d.type(form.locator("#name"), "Maria Tamm");
      await d.type(form.locator("#email"), "maria.tamm@example.com");
      await d.click(form.getByText("Carer or therapist", { exact: true }));
      await d.type(form.locator("#org"), "Kohtla-Järve Care Home");
      await d.click(form.getByText("Taking part in a pilot", { exact: true }));
      await d.click(form.getByText("TalTech", { exact: true }));
      await d.type(
        form.locator("#feedback"),
        "Makes sense. I would want families to stay in control throughout.",
      );
      await d.click(form.locator('input[name="consent"]'));
      await d.pause(500);
      await d.click(form.getByRole("button", { name: "Send" }));

      await d.page.getByRole("heading", { name: /Thank you/ }).waitFor();
      await d.pause(3200);
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
      await sleep(1100); // long enough to see the "Sending…" state
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });

    const page = await context.newPage();
    const d = new Director(page);

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await d.card("Human–Robot Interaction Lab", "TalTech Virumaa College · concept site by team AMP Dave", true);
    await page.waitForTimeout(100);
    const trimStart = (Date.now() - t0) / 1000 - 0.15; // everything before the title card is page loading
    await d.pause(2600);
    await d.card(null);
    await d.pause(900);

    for (const flow of FLOWS) {
      await d.caption(flow.caption);
      await d.pause(500);
      await flow.run(d);
      await d.caption(null);
      await d.pause(600);
    }

    await d.card("HRI Lab", "Team AMP Dave · TalTech Virumaa College");
    await d.pause(3000);

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
