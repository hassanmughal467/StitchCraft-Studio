import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({ title: "Terms of Service", description: "Terms for quotes, artwork, proofs, payment and delivery at Brandstitch Works.", path: "/terms" });

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Policy" title="Terms of service" lede="These terms cover how quotes, artwork, proofs, payment and delivery work. The quote you approve forms the contract for each job." dark={false} />
      <section className="py-12 sm:py-14">
        <Container className="prose-site max-w-2xl leading-7 text-ink-soft">
          <h2 className="text-xl font-semibold text-charcoal">Quotes</h2>
          <p>
            Quotes are itemized and valid until the date shown on them. A job starts when you accept the quote in writing. If the specification changes after acceptance we issue
            a revised quote before continuing.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Artwork and rights</h2>
          <p>
            You confirm that you own, or have permission to use, any artwork, names and marks you send us. We use your files only to prepare and produce your job and do not
            publish them without your written permission. For original logo design, usage rights are stated on the quote and transfer on final payment.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Proofs</h2>
          <p>
            Nothing is produced until you approve a stitch preview or placement proof. Approval applies to the exact version sent. A change after approval requires a new proof
            and may change the price and date.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Payment</h2>
          <p>
            Payment terms and accepted methods are stated on each quote. Digital files are released on payment. Product orders enter production after proof approval and the
            payment stated on the quote.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Delivery</h2>
          <p>
            Production times and shipping estimates are stated on the quote. Shipping estimates are provided by the carrier and are not guaranteed. Import duties and taxes in the
            destination country are the responsibility of the recipient unless the quote states otherwise. See{" "}
            <Link href="/shipping" className="font-semibold text-blue hover:underline">
              shipping and delivery
            </Link>
            .
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Corrections and remakes</h2>
          <p>
            See{" "}
            <Link href="/refund-policy" className="font-semibold text-blue hover:underline">
              corrections, remakes and refunds
            </Link>
            .
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Business details</h2>
          <p>
            {site.legalName ?? site.name} is based in {site.address.country}. {site.email ? `Questions about these terms: ${site.email}.` : "Use the contact page for questions about these terms."}
          </p>
        </Container>
      </section>
    </>
  );
}
