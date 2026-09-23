import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Artwork Guidelines",
  description: "How to prepare and send artwork for embroidery digitizing, patches, apparel and screen printing.",
  path: "/artwork-guidelines",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Help" title="Artwork guidelines" lede="What to send so we can quote accurately and produce your job without delays." dark={false} />
      <section className="py-12 sm:py-14">
        <Container className="prose-site max-w-2xl leading-7 text-ink-soft">
          <h2 className="text-xl font-semibold text-charcoal">Best file types</h2>
          <p>Vector files (AI, EPS, PDF, SVG) with text converted to outlines. If you only have a raster image, send the largest, sharpest PNG or JPG you have.</p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Tell us the size</h2>
          <p>Give the finished width or height in inches or millimeters for the placement. Left chest, cap front and jacket back are different sizes and different files.</p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Fabric, garment and placement</h2>
          <p>Name the garment or product, its color, and where the design goes. Fabric affects how we digitize; garment color affects thread and ink choices.</p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Colors</h2>
          <p>Send Pantone or thread references if you have them. Otherwise we match to your file and show the intended colors on the proof.</p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Detail limits</h2>
          <p>
            Embroidery: text below about 6 mm and lines thinner than about 1 mm are simplified. Screen printing: keep lines above about 0.5 pt and text above about 8 pt. We flag
            anything at risk on the proof.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Rights</h2>
          <p>Only send artwork you own or have permission to use. Trademarked logos of other organizations need that organization&apos;s authorization.</p>
          <p className="mt-8">
            Related:{" "}
            <Link href="/file-formats" className="font-semibold text-blue hover:underline">
              file format guide
            </Link>
            ,{" "}
            <Link href="/resources/vector-vs-digitizing" className="font-semibold text-blue hover:underline">
              vector vs digitizing
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
