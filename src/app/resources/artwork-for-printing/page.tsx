import { GuideLayout } from "@/components/sections/GuideLayout";
import { PrintLocations } from "@/components/visuals/ServiceVisual";
import { pageMetadata } from "@/lib/seo";

const href = "/resources/artwork-for-printing";
const title = "Preparing artwork for screen printing";
const description = "File types, color counts, sizes and garment considerations that keep a screen print job on schedule and looking right.";

export const metadata = pageMetadata({ title, description, path: href, type: "article" });

export default function Page() {
  return (
    <GuideLayout
      href={href}
      title={title}
      description={description}
      intro="Screen printing pushes ink through one stencil per color. Artwork that respects that process prints cleanly the first time. Here is what to prepare and why."
      visual={<PrintLocations />}
      ctaHref="/quote?service=screen-printing"
      related={[
        { href: "/screen-printing", label: "Screen printing" },
        { href: "/vector-tracing", label: "Vector tracing" },
        { href: "/embroidered-apparel", label: "Embroidered apparel" },
      ]}
      sections={[
        {
          heading: "Send vector artwork where you can",
          body: (
            <>
              <p>
                AI, EPS, PDF or SVG files scale to any print size without losing edge quality and let us separate colors precisely. Convert text to outlines so fonts are not
                substituted.
              </p>
              <p>
                If you only have a JPG or PNG, send the largest version you have. Simple logos can be redrawn as vector before printing; we quote that as a vector tracing job.
              </p>
            </>
          ),
        },
        {
          heading: "Count your colors",
          body: (
            <>
              <p>
                Each solid ink color needs its own screen, so a three-color design costs more to set up than a one-color design. Gradients and photographic images need
                halftones or a different print method; tell us if your artwork includes them.
              </p>
              <p>Printing on dark garments usually needs a white underbase beneath the colors, which counts as an additional screen.</p>
            </>
          ),
        },
        {
          heading: "Mind the detail",
          body: (
            <p>
              Keep lines at or above about 0.5 pt and text at or above about 8 pt. Very small negative space (thin gaps between shapes) can fill in with ink. If your logo has
              fine detail, we will flag anything at risk on the proof.
            </p>
          ),
        },
        {
          heading: "Print size and location",
          body: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Left chest: usually 3–4 in (75–100 mm) wide</li>
              <li>Full front or back: up to around 12 × 16 in (300 × 400 mm) on adult sizes</li>
              <li>Sleeve: narrow designs, typically 3–4 in long</li>
              <li>Youth sizes may need a smaller version of the same design</li>
            </ul>
          ),
        },
        {
          heading: "Color references",
          body: (
            <p>
              Give Pantone (solid coated) references where color accuracy matters. Screen colors on a monitor vary; a Pantone number gives us a target to mix to. The proof shows
              the intended colors on the intended garment color.
            </p>
          ),
        },
        {
          heading: "Before you send",
          body: (
            <ol className="list-decimal space-y-1 pl-5">
              <li>Vector file with text outlined, or the largest raster you have</li>
              <li>Number of colors and any Pantone references</li>
              <li>Garment style, colors and size breakdown</li>
              <li>Print locations and approximate sizes</li>
              <li>Delivery destination and the date you need the order</li>
            </ol>
          ),
        },
      ]}
    />
  );
}
