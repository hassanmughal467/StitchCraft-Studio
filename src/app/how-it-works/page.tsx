import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";
import { processSteps } from "@/lib/services";

export const metadata = pageMetadata({
  title: "How Ordering Works",
  description: "Send requirements, receive an itemized quote, approve the proof, then receive files or finished products. Payment terms by service explained.",
  path: "/how-it-works",
});

const detail: Record<string, string[]> = {
  "01": ["Use the quote form; it asks only for what your service needs.", "Attach artwork if you have it. If not, describe it and we will advise.", "Give the date you need files or delivery."],
  "02": ["Digital work: price per file or per design, with formats listed.", "Products: unit price, decoration, and shipping to your postal code shown separately.", "Payment terms and quote validity are written on the quote."],
  "03": ["Stitch preview or placement proof sent for your approval.", "Changes at this stage are part of the job.", "Approval locks the exact version for production."],
  "04": ["Files: download link sent on payment.", "Products: production after approval and payment, then dispatch with tracking.", "Reorders reuse the approved specification under your reference."],
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="How it works" title="From your artwork to files or finished products in four steps" lede="Nothing is produced until you approve a proof. Every quote states what is included, the price, the timing and how to pay." dark={false} />
      <section className="border-b border-line bg-card py-14 sm:py-16">
        <Container>
          <ol className="grid gap-5 md:grid-cols-2">
            {processSteps.map((step) => (
              <li key={step.n} className="rounded-sm border border-line bg-warm p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-copper-dark text-sm font-bold text-card">{step.n}</span>
                  <h2 className="text-xl font-semibold">{step.title}</h2>
                </div>
                <p className="mt-4 leading-7 text-ink-soft">{step.body}</p>
                <ul className="mt-4 space-y-1.5 text-sm leading-6 text-ink-soft">
                  {detail[step.n].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="border-b border-line py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Digital or physical" title="Two kinds of delivery" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            <div className="rounded-sm border border-line bg-card p-6">
              <h3 className="text-lg font-semibold">Files (digitizing, vector, logo)</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                You receive files by download link after payment. Production correction is included if an embroidery file needs adjusting on your machine. Nothing is shipped.
              </p>
            </div>
            <div className="rounded-sm border border-line bg-card p-6">
              <h3 className="text-lg font-semibold">Products (patches, apparel, print, caps)</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Production starts after proof approval and payment as stated on the quote. Orders ship with tracking to the address you give. Import duties in your country, if
                any, are the recipient&apos;s responsibility unless the quote says otherwise.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
