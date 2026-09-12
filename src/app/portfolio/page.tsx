import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Portfolio",
  description: "Client slots and placement samples for digitizing, patches, embroidery, print and caps.",
  path: "/portfolio",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Proof first. Client names only with permission."
        lede="Empty frames are reserved for approved client sew-outs. Sample tiles below show placements and are marked as placeholders until studio photography replaces them. We do not invent results."
      />
      <section className="py-16">
        <Container>
          <PortfolioGallery />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
