import { QuoteForm } from "@/components/quote/QuoteForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { mailtoHref, site, telHref, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Stitchcraft Studio or request a quote.",
  path: "/contact",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Email, WhatsApp, or the quote form."
        lede="Phone, email and hours are placeholders until the owner confirms them. We do not list offices that do not exist."
      />
      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <h2 className="text-2xl font-semibold">Studio</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-ink-soft">
              <li>
                <a href={mailtoHref()} className="text-blue">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={telHref()}>{site.phoneDisplay}</a>
              </li>
              <li>
                <a href={whatsappHref()} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>{site.hours}</li>
              <li>
                {site.address.line1}
                <br />
                {site.address.country}
              </li>
            </ul>
          </aside>
          <div className="border border-line lg:col-span-8">
            <QuoteForm />
          </div>
        </Container>
      </section>
    </>
  );
}
