import { RouteOverview } from "@/components/services/RouteOverview";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Custom Products: Patches, Apparel, Printing & Caps",
  description: "Custom patches, embroidered apparel, screen-printed shirts and caps made to your artwork, proof approved before production and shipped with tracking.",
  path: "/custom-products",
});

export default function Page() {
  return (
    <RouteOverview
      route="products"
      lede="Choose the product, send the artwork and quantity, and approve a proof. We produce the order and ship it to your address with tracking."
      points={[
        "Itemized quotes: product, decoration and shipping shown separately.",
        "A placement or stitch proof is approved before anything is made.",
        "Shipping quoted to your postal code in the US, UK, Australia and elsewhere.",
      ]}
    />
  );
}
