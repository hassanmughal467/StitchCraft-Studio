import { RouteOverview } from "@/components/services/RouteOverview";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Digitizing & Artwork Services",
  description: "Embroidery digitizing, vector artwork and custom logo design. Production-ready files delivered by download for shops, brands and teams.",
  path: "/digitizing-artwork",
});

export default function Page() {
  return (
    <RouteOverview
      route="digitizing"
      lede="Send us a logo and tell us where it will be used. You receive a file: an embroidery file for your machine, clean vector artwork, or an original logo design."
      points={[
        "No minimum order: one file is a normal job.",
        "Files delivered in the formats you name, with a preview for approval.",
        "Production correction included if a file needs adjusting on your machine.",
      ]}
    />
  );
}
