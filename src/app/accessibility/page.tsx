import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Accessibility",
  description: "Accessibility statement for Stitchcraft Studio.",
  path: "/accessibility",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Legal" title="Accessibility" lede="The public interface aims for WCAG 2.2 AA: keyboard access, visible focus, labeled forms and readable contrast." />
      <section className="py-12">
        <Container className="max-w-2xl text-ink-soft">
          <p>If a page blocks you, email the studio with the URL and what you were trying to do. Reduced-motion preferences are respected in CSS.</p>
        </Container>
      </section>
    </>
  );
}
