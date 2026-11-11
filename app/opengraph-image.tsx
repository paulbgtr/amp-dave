import { ImageResponse } from "next/og";

// Share card shown when the site is posted on Facebook, Messenger, Slack, etc.
export const alt =
  "Human–Robot Interaction Lab, TalTech Virumaa College: understanding people who communicate beyond words";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  canvas: "#f2ede4",
  surface: "#faf7f1",
  ink: "#221d18",
  muted: "#625950",
  line: "#dcd3c4",
  signal: "#d9481a",
};

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
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 3, color: C.muted }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: C.signal }} />
          TALTECH VIRUMAA COLLEGE · IDA-VIRUMAA
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3 }}>Human–Robot</div>
            <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3 }}>Interaction Lab</div>
            <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.35, color: C.muted }}>
              Understanding people who communicate beyond words.
            </div>
          </div>

          <svg width="380" height="320" viewBox="40 70 320 270">
            <path
              d="M94 100 H306 A24 24 0 0 1 330 124 V246 A24 24 0 0 1 306 270 H170 L118 318 L128 270 H94 A24 24 0 0 1 70 246 V124 A24 24 0 0 1 94 100 Z"
              fill={C.surface}
              stroke={C.ink}
              strokeWidth="2.25"
              strokeLinejoin="round"
            />
            <path
              d="M106 186 C116 186 120 177 128 177 S140 195 148 195 S160 181 168 181 S180 191 188 191 S204 186 212 186 C224 186 228 146 240 146 S256 204 266 204 S284 186 294 186"
              fill="none"
              stroke={C.ink}
              strokeWidth="2.25"
              strokeLinecap="round"
            />
            <circle cx="240" cy="146" r="16" fill="none" stroke={C.signal} strokeWidth="1.5" opacity="0.5" />
            <circle cx="240" cy="146" r="8" fill={C.signal} />
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
    size,
  );
}
