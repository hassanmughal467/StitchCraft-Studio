import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Portfolio",
  description:
    "Embroidery and patch placements we digitize: logos, caps, jackets, uniforms, sports, workwear, 3D puff, and appliqué. Placeholder photography until studio sew-outs are added.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Placements, stitch types, and the jobs they suit."
        lede="Filter by category and open a sample for notes on fabric and construction. Images are high-quality placeholders, clearly tagged in the code, so they can be swapped for real sew-outs. We do not invent clients or results."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <PortfolioGallery />
        </Container>
      </section>
      <CtaBand title="Have a similar placement? Send the artwork and the sew size." />
    </>
  );
}
