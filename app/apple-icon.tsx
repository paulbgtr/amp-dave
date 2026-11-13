import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: the speech-bubble mark on the site's light TalTech-gray background.
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
          background: "#f6f6f8",
        }}
      >
        <svg width="128" height="128" viewBox="0 0 24 24">
          <path
            d="M5.5 3.5 H18.5 A3 3 0 0 1 21.5 6.5 V14 A3 3 0 0 1 18.5 17 H11 L6.5 21 L7.5 17 H5.5 A3 3 0 0 1 2.5 14 V6.5 A3 3 0 0 1 5.5 3.5 Z"
            fill="#ffffff"
            stroke="#342b60"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M6 10.5 Q7.5 8 9 10.5 T12 10.5" fill="none" stroke="#342b60" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="16" cy="10.25" r="2.1" fill="#e4067e" />
        </svg>
      </div>
    ),
    size,
  );
}
