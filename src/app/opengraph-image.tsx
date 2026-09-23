import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: Embroidery digitizing, custom patches and branded apparel`;
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
          Brandstitch Works
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 60, lineHeight: 1.05, fontWeight: 600, maxWidth: 1000 }}>
            Embroidery Digitizing, Custom Patches and Branded Apparel
          </div>
          <div style={{ fontSize: 26, color: "#E7E7E2", maxWidth: 820 }}>
            Digitizing, vector artwork, embroidery and screen printing for businesses, apparel decorators and organizations.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
