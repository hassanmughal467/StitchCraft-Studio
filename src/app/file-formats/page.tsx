import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "File Format Guide",
  description: "Accepted artwork and embroidery machine formats.",
  path: "/file-formats",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Help" title="File format guide" />
      <section className="py-12">
        <Container className="max-w-2xl text-ink-soft">
          <p>Artwork in: AI, EPS, PDF, SVG, PNG, JPG. Embroidery out: DST, PES, EXP, JEF, EMB and others named on the quote. Vectors out: AI, EPS, SVG, PDF.</p>
        </Container>
      </section>
    </>
  );
}
