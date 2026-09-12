import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Understanding embroidery proofs",
  description: "What a stitch preview shows before you approve.",
  path: "/resources/embroidery-proofs",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Guide" title="Understanding embroidery proofs" />
      <section className="py-16">
        <Container className="prose-site max-w-2xl text-ink-soft">
          <p>A stitch preview shows sequence, color breaks and approximate coverage. It cannot show how the fabric will push or how a wash will sit. Approve the exact version we send. If the fabric is unusual, ask for a sew-out before a bulk run.</p>
        </Container>
      </section>
    </>
  );
}
