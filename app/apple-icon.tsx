import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Wayfarer monogram favicon in the brand colours. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#124477", borderRadius: 0, fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>
        <span style={{ color: "#ffffff" }}>W</span>
        <span style={{ color: "#e88029" }}>.</span>
      </div>
    ),
    size,
  );
}
