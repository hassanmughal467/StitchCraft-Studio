import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Custom Products",
  description: "Custom patches, embroidered apparel, screen printing and hats.",
  path: "/custom-products",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Route 2"
        title="Custom Products"
        lede="Patches, embroidered apparel, screen printing and custom headwear. Production and shipping are quoted separately when that is how the job will run."
      >
        <div className="mt-8">
          <ButtonLink href="/quote?service=custom-patches">Request a Quote</ButtonLink>
        </div>
      </PageHero>
      <section className="py-16">
        <Container className="grid gap-4 md:grid-cols-2">
          {services
            .filter((item) => item.route === "products")
            .map((item) => (
              <article key={item.id} className="border border-line bg-card p-6">
                <h2 className="text-2xl font-semibold">
                  <Link href={item.href}>{item.title}</Link>
                </h2>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{item.outcome}</p>
              </article>
            ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
