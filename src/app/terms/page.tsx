import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms", description: "Website and quote terms.", path: "/terms" });

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Legal" title="Terms" lede="Draft until counsel reviews it. Quotes are estimates. Production starts after proof approval and the required payment state." />
      <section className="py-12">
        <Container className="prose-site max-w-2xl text-ink-soft">
          <p>You confirm you have the right to use uploaded artwork. Files are licensed for the placements on the job. Placeholder photography is not completed client work.</p>
        </Container>
      </section>
    </>
  );
}
