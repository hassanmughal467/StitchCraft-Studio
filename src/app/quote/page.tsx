import Link from "next/link";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { QuoteIntake } from "@/components/quote/QuoteIntake";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { getPortfolioItem } from "@/lib/portfolio";
import { resolveCustomerParam, resolveServiceParam } from "@/lib/quote";
import { getIntakeStatus } from "@/lib/server/intake-config";
import { pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";
import { contactChannels } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Request a quote",
  description: "Request a quote for embroidery digitizing, vector artwork, logo design, custom patches, embroidered apparel, screen printing or caps.",
  path: "/quote",
  // Transactional page: excluded from the sitemap and robots, never indexed.
  noindex: true,
});

export default async function Page({ searchParams }: { searchParams: Promise<{ service?: string; customer?: string; project?: string }> }) {
  const params = await searchParams;
  const initialService = resolveServiceParam(params.service);
  const initialCustomerType = resolveCustomerParam(params.customer);
  const service = initialService ? getService(initialService) : undefined;
  const project = params.project ? getPortfolioItem(params.project) : undefined;
  const status = getIntakeStatus();

  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title={service ? `Quote for ${service.title.toLowerCase()}` : "Tell us about your job"}
        lede={
          !status.online
            ? contactChannels.hasAny
              ? "Online quote requests are paused. Use the contact details on this page to reach us, or check back shortly."
              : "Online quote requests are paused right now. Please check back shortly, or see how ordering works for what we will need."
            : service
              ? `${service.kind === "digital" ? "You receive files by download." : "You receive finished products, shipped with tracking."} Two short steps; attach artwork if you have it.`
              : "Two short steps: who you are and which service, then only the details that service needs. Attach artwork if you have it."
        }
        compact
        dark={false}
      />
      <section className="py-10 sm:py-14">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-sm border border-line">
              <QuoteIntake initialService={initialService} initialCustomerType={initialCustomerType} initialPortfolio={project ? { ref: project.slug, title: project.title } : null} serviceTitle={service?.title} />
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-sm border border-line bg-card p-6 text-sm leading-6 text-ink-soft">
              <h2 className="text-base font-semibold text-charcoal">What happens next</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                {status.online ? <li>You receive a reference number as soon as the request is saved.</li> : <li>We log your request and reply with a reference.</li>}
                <li>We review the details and ask for anything missing.</li>
                <li>You get an itemized quotation with timing and payment terms.</li>
                <li>Work starts after you approve the quotation and the proof.</li>
              </ol>
              {status.responseStatement ? <p className="mt-4">{status.responseStatement}</p> : null}
              {service ? (
                <p className="mt-5">
                  Not sure what to send? See{" "}
                  <Link href={`${service.href}#details`} className="font-semibold text-blue hover:underline">
                    what to send for {service.title.toLowerCase()}
                  </Link>
                  .
                </p>
              ) : (
                <p className="mt-5">
                  Files stay private and are used only to prepare your quote. See the{" "}
                  <Link href="/artwork-guidelines" className="font-semibold text-blue hover:underline">
                    artwork guidelines
                  </Link>
                  .
                </p>
              )}
            </div>
            {contactChannels.hasAny && status.online ? (
              <div className="rounded-sm border border-line bg-card p-6">
                <h2 className="text-base font-semibold text-charcoal">Prefer to talk first?</h2>
                <div className="mt-3">
                  <ContactChannels compact message={`Hello Brandstitch Works, I have a question before requesting a quote${service ? ` for ${service.title.toLowerCase()}` : ""}.`} />
                </div>
              </div>
            ) : null}
          </aside>
        </Container>
      </section>
    </>
  );
}
