import type { Metadata } from "next";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hasPublishedPortfolio, portfolioFilters, publishedPortfolio } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description: "Embroidery digitizing, patch, apparel and cap projects by Brandstitch Works, shown with customer permission or labeled as studio samples.",
  path: "/portfolio",
  // Not indexable until published work exists.
  noindex: !hasPublishedPortfolio(),
});

export default function Page() {
  const items = publishedPortfolio();
  const serviceTitles = Object.fromEntries(services.map((s) => [s.id, s.title]));

  if (!items.length) {
    return (
      <>
        <PageHero
          eyebrow="Portfolio"
          title="Project examples are shared on request"
          lede="We publish customer work only with written permission, so this page is being prepared. Ask for examples of the product or placement you are planning and we will send relevant samples with your quote."
          dark={false}
        />
        <section className="py-14">
          <Container className="flex flex-wrap gap-3">
            <ButtonLink href="/quote">Request a Quote</ButtonLink>
            <ButtonLink href="/custom-products" variant="secondary">
              Browse products
            </ButtonLink>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Selected projects and studio samples" lede="Client projects are shown with permission. Studio samples are self-initiated pieces made to demonstrate a technique." dark={false} />
      <section className="py-14 sm:py-16">
        <Container>
          <PortfolioGallery items={items} filters={portfolioFilters()} serviceTitles={serviceTitles} />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
