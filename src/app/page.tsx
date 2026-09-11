import { HomeHero } from "@/components/home/HomeHero";
import { IndustryPreview } from "@/components/home/IndustryPreview";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { ProcessStrip } from "@/components/home/ProcessStrip";
import { QualityCompare } from "@/components/home/QualityCompare";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { TrustHighlights } from "@/components/home/TrustHighlights";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Artwork Into Production-Ready Embroidery",
  description:
    "Professional embroidery digitizing and custom patches for clothing brands, teams, uniforms, and merchandise businesses.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustHighlights />
      <QualityCompare />
      <ServiceGrid limit={8} />
      <PortfolioPreview />
      <ProcessStrip />
      <IndustryPreview />
      <CtaBand />
    </>
  );
}
