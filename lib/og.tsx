import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** A boarding-pass style social card: FROM Bengaluru TO the destination. */
export function passOgImage({ to, code, line }: { to: string; code: string; line: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#eef2f6", padding: 48, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flex: 1, background: "#ffffff", borderRadius: 20, overflow: "hidden", border: "2px solid #c9d3de" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: 56 }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#124477" }}>
              Wayfarer<span style={{ color: "#e88029" }}>.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26, letterSpacing: 4, color: "#4e5d70" }}>STUDY IN</div>
              <div style={{ fontSize: 96, fontWeight: 800, color: "#13233a", lineHeight: 1 }}>{to}</div>
              <div style={{ fontSize: 30, color: "#4e5d70", marginTop: 20 }}>{line}</div>
            </div>
            <div style={{ fontSize: 24, color: "#4e5d70" }}>Bengaluru · Chennai · Pune · Kochi · Since 2011</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 340, background: "#124477", padding: 40, borderLeft: "4px dashed #c9d3de" }}>
            <div style={{ fontSize: 22, letterSpacing: 4, color: "#c9d6e6" }}>FROM</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#ffffff" }}>BLR</div>
            <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
              <div style={{ width: 200, borderTop: "4px dashed #c9d6e6" }} />
              <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "28px solid #e88029", marginLeft: 8 }} />
            </div>
            <div style={{ fontSize: 22, letterSpacing: 4, color: "#c9d6e6" }}>TO</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#f6a560" }}>{code}</div>
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
