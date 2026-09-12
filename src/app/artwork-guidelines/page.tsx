import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Artwork Guidelines",
  description: "How to prepare artwork for digitizing, patches and print.",
  path: "/artwork-guidelines",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Help" title="Artwork guidelines" />
      <section className="py-12">
        <Container className="prose-site max-w-2xl text-ink-soft">
          <p>Send vector files when you have them. Name the intended size in inches or millimetres. Include garment color and placement. Confirm you have the right to use the mark. Low-resolution photos of complex crests may need a redraw first.</p>
        </Container>
      </section>
    </>
  );
}
