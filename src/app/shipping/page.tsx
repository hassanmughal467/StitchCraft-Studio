import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping & Delivery",
  description: "Shipping countries and windows are confirmed on each quote.",
  path: "/shipping",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Help" title="Shipping & delivery" lede="Digital files are delivered electronically. Physical orders ship after proof approval and the required payment state. Partners, charges and windows are pending owner confirmation and will be written on the quote — not as a site-wide promise." />
      <section className="py-12">
        <Container className="max-w-2xl text-ink-soft">
          <p>First markets: United States, United Kingdom, Australia. Canada and New Zealand follow once the offer is stable. We do not claim local warehouses we do not operate.</p>
        </Container>
      </section>
    </>
  );
}
