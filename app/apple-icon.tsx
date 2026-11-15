import { ImageResponse } from "next/og";
import { MARK } from "@/lib/artwork";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: the speech-bubble mark on the site's cream background.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2ede4",
        }}
      >
        <svg width="128" height="128" viewBox={MARK.viewBox}>
          <path d={MARK.bubble} fill="#faf7f1" stroke="#342b60" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={MARK.trace} fill="none" stroke="#342b60" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx={MARK.peak.x} cy={MARK.peak.y} r="2.1" fill="#e4067e" />
        </svg>
      </div>
    ),
    size,
  );
}
