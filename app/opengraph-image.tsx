import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { HERO } from "@/lib/artwork";

// Share card shown when the site is posted on Facebook, Messenger, Slack, etc.
export const alt =
  "Human–Robot Interaction Lab, TalTech Virumaa College: understanding people who communicate beyond words";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  canvas: "#f2ede4",
  surface: "#faf7f1",
  panel: "#e8e0d2",
  ink: "#342b60", // TalTech purple
  muted: "#625950",
  line: "#dcd3c4",
  signal: "#e4067e", // TalTech pink
};

// Same fonts as the site. Read at module level so the image is pre-rendered at build time.
const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));
const [sans400, sans500, mono400] = await Promise.all([
  font("dm-sans", "dm-sans-latin-400-normal.woff"),
  font("dm-sans", "dm-sans-latin-500-normal.woff"),
  font("dm-mono", "dm-mono-latin-400-normal.woff"),
]);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: C.canvas,
          color: C.ink,
          fontFamily: "DM Sans",
          padding: "64px 72px",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "DM Mono", fontSize: 22, letterSpacing: 2, color: C.muted }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, background: C.signal }} />
          TALTECH VIRUMAA COLLEGE · IDA-VIRUMAA
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div style={{ fontSize: 88, fontWeight: 500, lineHeight: 1, letterSpacing: -3 }}>Human–Robot</div>
            <div style={{ fontSize: 88, fontWeight: 500, lineHeight: 1, letterSpacing: -3 }}>Interaction Lab</div>
            <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.35, color: C.muted }}>
              Understanding people who communicate beyond words.
            </div>
          </div>

          <svg width="380" height="320" viewBox={HERO.viewBox}>
            <path d={HERO.bubble} fill={C.panel} transform={`translate(${HERO.plateOffset} ${HERO.plateOffset})`} />
            <path d={HERO.bubble} fill={C.surface} stroke={C.ink} strokeWidth="2.25" strokeLinejoin="round" />
            <path d={HERO.ticks} fill="none" stroke={C.ink} strokeWidth="1.25" strokeLinecap="round" opacity="0.35" />
            <path d={HERO.trace} fill="none" stroke={C.ink} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={HERO.peak.x} cy={HERO.peak.y} r="16" fill={C.signal} opacity="0.16" />
            <circle cx={HERO.peak.x} cy={HERO.peak.y} r="8" fill={C.signal} />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${C.line}`,
            paddingTop: 22,
            fontSize: 22,
            color: C.muted,
          }}
        >
          <div style={{ display: "flex" }}>Researchers, carers and families welcome</div>
          <div style={{ display: "flex" }}>A concept by AMP Dave</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DM Sans", data: sans400, weight: 400, style: "normal" },
        { name: "DM Sans", data: sans500, weight: 500, style: "normal" },
        { name: "DM Mono", data: mono400, weight: 400, style: "normal" },
      ],
    },
  );
}
