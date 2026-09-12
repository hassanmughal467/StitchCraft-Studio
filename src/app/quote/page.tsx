import Link from "next/link";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { quoteServiceIds } from "@/lib/quote";
import { isQuoteIntakeAvailable } from "@/lib/server/quote-intake";
import { pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description: "Request a quote for embroidery digitizing, vector tracing, logo design, custom patches, embroidered apparel, screen printing or caps.",
  path: "/quote",
});

export default async function Page({ searchParams }: { searchParams: Promise<{ service?: string; customer?: string }> }) {
  const params = await searchParams;
  const initialService = quoteServiceIds.includes(params.service ?? "") ? (params.service as string) : "";
  const initialCustomerType = params.customer === "individual" ? "Individual" : "Business";
  const service = initialService ? getService(initialService) : undefined;
  const intake = isQuoteIntakeAvailable();

  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title={service ? `Quote for ${service.title}` : "Tell us about your job"}
        lede={
          service
            ? `${service.kind === "digital" ? "You will receive files by download." : "You will receive finished products, shipped with tracking."} Two short steps; upload artwork if you have it.`
            : "Two short steps: who you are and which service, then only the details that service needs. Upload artwork if you have it."
        }
        compact
        dark={false}
      />
      <section className="py-10 sm:py-14">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-sm border border-line">
              <QuoteForm initialService={initialService} initialCustomerType={initialCustomerType} available={intake.available} />
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-sm border border-line bg-card p-6 text-sm leading-6 text-ink-soft">
              <h2 className="text-base font-semibold text-charcoal">What happens next</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>You receive a reference number immediately.</li>
                <li>We review the details and ask for anything missing.</li>
                <li>You get an itemized quote with timing and payment terms.</li>
                <li>Work starts after you approve the quote and proof.</li>
              </ol>
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
          </aside>
        </Container>
      </section>
    </>
  );
}
