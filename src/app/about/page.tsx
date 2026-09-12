import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description: "Pakistan-based Stitchcraft Studio serving international B2B and B2C customers.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`${site.name} is a Pakistan-based studio for international orders.`}
        lede="We prepare artwork and produce custom patches, apparel and caps for shops, brands, teams and individual buyers. First markets are the United States, the United Kingdom and Australia. We do not claim local offices we do not have."
      />
      <section className="py-16">
        <Container className="max-w-2xl leading-7 text-ink-soft">
          <h2 className="text-2xl font-semibold text-charcoal">How we work</h2>
          <p className="mt-4">
            Digitizing and artwork jobs end as files. Product jobs end as shipped goods with tracking once
            dispatch details are confirmed. Proofs are approved before production.
          </p>
          <h2 className="mt-10 text-2xl font-semibold text-charcoal">What we will not publish</h2>
          <p className="mt-4">
            No invented reviews, ratings, client logos or delivery guarantees. Photography on this site is
            labeled as placeholder until studio sew-outs and permission records are supplied. Contact
            details stay marked pending until the owner confirms them.
          </p>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
