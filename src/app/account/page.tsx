import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Account",
    description: "Customer dashboard for quotes, proofs and orders — coming with the ordering workflow.",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Quotes, proofs and orders will live here."
        lede="The dashboard is not live yet. Until private storage and payments are connected, use the quote form and email. This page is not indexed."
      />
      <section className="py-16">
        <Container className="max-w-xl">
          <ul className="list-disc space-y-2 pl-5 text-ink-soft">
            <li>Quotes with status and expiry</li>
            <li>Proofs awaiting action</li>
            <li>Orders, tracking and file downloads</li>
            <li>Saved specifications and reorder</li>
          </ul>
          <ButtonLink href="/quote" className="mt-8">
            Request a Quote
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
