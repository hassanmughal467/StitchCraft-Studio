import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For Trade / B2B",
  description: "Trade accounts for embroidery shops, print businesses and merchandise agencies.",
  path: "/trade",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="B2B"
        title="Repeat artwork, saved specifications, reliable file delivery."
        lede="For embroidery shops, screen printers, promo agencies, uniform suppliers, brands, schools, clubs and hospitality programs. Trade pricing is offered after qualification — rates are not published until the owner approves them."
      >
        <div className="mt-8">
          <ButtonLink href="/quote">Open a Trade Account</ButtonLink>
        </div>
      </PageHero>
      <section className="py-16">
        <Container className="grid gap-6 md:grid-cols-2">
          {[
            ["Saved job specifications", "Approved files and notes stay on the record so a reorder does not start from a blank brief."],
            ["File delivery", "Shop formats named on the quote. We do not email unprotected customer artwork to third parties."],
            ["Reorders", "Send the previous reference. Changes to size or garment are confirmed before we run them."],
            ["Human support", "Questions go to the studio. Support hours by country are pending owner confirmation."],
          ].map(([title, body]) => (
            <article key={title} className="border border-line bg-card p-6">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{body}</p>
            </article>
          ))}
        </Container>
      </section>
      <CtaBand title="Apply with a quote and your shop details." />
    </>
  );
}
