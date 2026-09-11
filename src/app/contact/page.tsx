import { QuoteForm } from "@/components/quote/QuoteForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { mailtoHref, site, telHref, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description:
    "Request a quote for embroidery digitizing or custom patches. Upload artwork and tell us the garment, quantity, and deadline.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Request a quote. Include the artwork if you have it."
        lede="Use the form, email, or WhatsApp. The more specific the size, garment, and date, the faster we can reply with a usable quote."
      />
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <h2 className="font-display text-3xl tracking-[-0.02em]">Studio contact</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-ink-soft">
              <li>
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-stone">
                  Email
                </span>
                <a href={mailtoHref()} className="text-ink hover:text-copper">
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-stone">
                  Phone
                </span>
                <a href={telHref()} className="text-ink hover:text-copper">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-stone">
                  WhatsApp
                </span>
                <a href={whatsappHref()} target="_blank" rel="noreferrer" className="text-ink hover:text-copper">
                  Message the studio
                </a>
              </li>
              <li>
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-stone">
                  Hours
                </span>
                {site.hours}
              </li>
            </ul>
            <p className="mt-8 text-xs leading-5 text-stone">
              Phone, email, WhatsApp, and social links are placeholders until launch details are confirmed.
              The form works in mock mode until Formspree or Resend credentials are added.
            </p>
          </aside>
          <div className="border border-line lg:col-span-8">
            <QuoteForm />
          </div>
        </Container>
      </section>
    </>
  );
}
