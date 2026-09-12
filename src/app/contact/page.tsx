import { QuoteForm } from "@/components/quote/QuoteForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { isQuoteIntakeAvailable } from "@/lib/server/quote-intake";
import { pageMetadata } from "@/lib/seo";
import { contactChannels, mailtoHref, site, telHref, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Stitchcraft Studio about embroidery digitizing, vector artwork, patches, apparel, printing or caps.",
  path: "/contact",
});

export default function Page() {
  const email = mailtoHref();
  const tel = telHref();
  const wa = whatsappHref("Hello Stitchcraft Studio, I have a question.");
  const intake = isQuoteIntakeAvailable();
  const addressParts = [site.address.line1, site.address.city, site.address.country].filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the studio"
        lede={
          contactChannels.hasAny
            ? "For pricing, the quickest route is the quote form: it collects the details we need to reply with a price. For anything else, use the channels listed here."
            : "For pricing, the quickest route is the quote form: it collects the details we need to reply with a price. Add any other questions to the project description and we will answer them in the same reply."
        }
      />
      <section className="py-14 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <h2 className="text-2xl font-semibold">Studio</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{site.location}</p>
            {contactChannels.hasAny ? (
              <ul className="mt-6 space-y-3 text-sm leading-6">
                {email && site.email ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-stone">Email</span>
                    <a href={email} className="font-medium text-blue hover:underline">
                      {site.email}
                    </a>
                  </li>
                ) : null}
                {tel && site.phone ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-stone">Phone</span>
                    <a href={tel} className="font-medium text-blue hover:underline">
                      {site.phone.display}
                    </a>
                  </li>
                ) : null}
                {wa ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-stone">WhatsApp</span>
                    <a href={wa} target="_blank" rel="noreferrer" className="font-medium text-blue hover:underline">
                      Message us on WhatsApp
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
            {site.hours ? <p className="mt-5 text-sm text-ink-soft">{site.hours}</p> : null}
            <p className="mt-5 text-sm text-ink-soft">{addressParts.join(", ")}</p>
          </aside>
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-semibold">Request a quote</h2>
            <div className="mt-4 rounded-sm border border-line">
              <QuoteForm available={intake.available} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
