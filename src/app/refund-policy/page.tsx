import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Refund, Correction and Remake",
  description: "Draft refund and remake policy pending owner approval.",
  path: "/refund-policy",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Legal" title="Refund, correction and remake" lede="Rules for refunds, corrections and remakes are pending owner approval. Until then they will be written on each quote." />
      <section className="py-12">
        <Container className="max-w-2xl text-ink-soft">
          <p>If a file or product does not match the approved proof, contact the studio with the quote reference before requesting a remake.</p>
        </Container>
      </section>
    </>
  );
}
