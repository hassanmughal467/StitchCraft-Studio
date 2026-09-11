import { ImageResponse } from "next/og";

export const alt = "StitchCraft Studio — Threadline Digitizing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#141210",
          color: "#f3eee4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c4622d" }}>
          Threadline Digitizing
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontFamily: "Georgia" }}>StitchCraft Studio</div>
          <div style={{ fontSize: 28, color: "#d6cdbe", maxWidth: 760 }}>
            Artwork into production-ready embroidery and custom patches.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
