import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { faqs } from "@/lib/content";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers about artwork, file formats, turnaround, proofs, patches, revisions, and how to request a quote from StitchCraft Studio.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <PageHero
        eyebrow="FAQ"
        title="Practical answers before you send a file."
        lede="If your question is about price, send the artwork and placement — quotes depend on size, stitch type, and quantity."
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="divide-y divide-line">
            {faqs.map((item) => (
              <details key={item.q} className="group py-6">
                <summary className="cursor-pointer list-none font-display text-2xl tracking-[-0.02em] focus-visible:outline-offset-4">
                  <span className="flex items-start justify-between gap-6">
                    {item.q}
                    <span aria-hidden className="mt-1 font-mono text-sm text-copper group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-base leading-7 text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
