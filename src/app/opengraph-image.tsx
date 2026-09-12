import { ImageResponse } from "next/og";

export const alt = "Stitchcraft Studio — Artwork prepared. Products made.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#20252B",
          color: "#F7F5EF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C97744" }}>
          Stitchcraft Studio
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 600 }}>Artwork prepared. Products made.</div>
          <div style={{ fontSize: 26, color: "#E7E7E2", maxWidth: 780 }}>
            Digitizing, vectors, patches, apparel and caps for shops, brands, teams and individual buyers.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
