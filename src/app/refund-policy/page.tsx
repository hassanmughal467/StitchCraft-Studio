import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Corrections, Remakes & Refunds",
  description: "How Stitchcraft Studio handles corrections to files, remakes of products and refunds when work does not match the approved proof.",
  path: "/refund-policy",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Policy" title="Corrections, remakes and refunds" lede="Work is produced to the proof you approve. This page explains what happens when the result does not match it." dark={false} />
      <section className="py-12 sm:py-14">
        <Container className="prose-site max-w-2xl leading-7 text-ink-soft">
          <h2 className="text-xl font-semibold text-charcoal">Digital files</h2>
          <p>
            If an embroidery file does not sew as shown on the approved preview, or a vector file has an error against the approved artwork, send the reference number, the
            fabric or use, and a photo or screenshot. We correct the file at no charge.
          </p>
          <p>Changes to the design, size or placement after approval are new work and are quoted before we start.</p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Physical products</h2>
          <p>
            If patches, garments or caps arrive with a production fault or do not match the approved proof, contact us within 14 days of delivery with the reference number and
            photos. We remake the affected items or agree an alternative with you.
          </p>
          <p>
            Differences that fall within the proof are not faults: thread shades against a different garment color, slight variation between a rendering and a sew-out, and
            details that were simplified on the approved proof.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Cancellations</h2>
          <p>
            You can cancel a job before approving the proof; work already carried out on digitizing or artwork may be charged. Product orders cannot be cancelled once
            production has started because they are made to your specification.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Where the terms apply</h2>
          <p>The specific terms for each job, including payment timing and any exceptions, are written on the quote you approve. Where the quote differs from this page, the quote applies.</p>
        </Container>
      </section>
    </>
  );
}
