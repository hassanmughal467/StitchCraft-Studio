import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Accessibility",
  description: "Accessibility statement for the Brandstitch Works website.",
  path: "/accessibility",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Policy" title="Accessibility" lede="We aim to meet WCAG 2.2 level AA across this website." dark={false} />
      <section className="py-12 sm:py-14">
        <Container className="prose-site max-w-2xl leading-7 text-ink-soft">
          <p>
            Pages are built to work with a keyboard alone, show a visible focus indicator, label every form field, describe images, keep text contrast readable and respect
            your reduced-motion setting. Menus and form errors are announced to screen readers.
          </p>
          <p>
            If anything blocks you, tell us the page address and what you were trying to do{site.email ? ` at ${site.email}` : " through the contact page"}, and we will fix it or
            help you complete the task another way.
          </p>
        </Container>
      </section>
    </>
  );
}
