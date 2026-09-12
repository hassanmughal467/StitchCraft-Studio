import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Preparing artwork for printing",
  description: "File types, color counts and sizes for screen print jobs.",
  path: "/resources/artwork-for-printing",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Guide" title="Preparing artwork for printing" />
      <section className="py-16">
        <Container className="prose-site max-w-2xl text-ink-soft">
          <p>Vector files keep edges honest. Tell us the print size, garment color and number of ink colors. Fine type and light ink on dark garments need a size check before screens are made.</p>
        </Container>
      </section>
    </>
  );
}
