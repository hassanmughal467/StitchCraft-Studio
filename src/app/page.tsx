import Link from "next/link";
import { ClientPreview } from "@/components/home/ClientPreview";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { guides, processSteps, routes, services, trustItems } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className="border-b border-charcoal bg-charcoal text-card">
        <Container className="grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper">
              {site.base}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
              Artwork prepared. Products made. Orders delivered with care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-card/72">
              Embroidery digitizing, vector artwork, custom patches, branded apparel and caps for print
              shops, brands, teams and individual buyers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quote" variant="invert">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/portfolio" variant="invertGhost">
                View Our Work
              </ButtonLink>
            </div>
          </div>
          <div className="border border-card/15 bg-card/5 p-6 lg:col-span-5">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper">Two routes</p>
            <p className="mt-3 text-xl font-semibold">Artwork into a file, or artwork onto a product.</p>
            <p className="mt-3 text-sm leading-6 text-card/70">
              First markets: {site.priorityMarkets.join(", ")}. Shipping windows and support hours stay
              configurable by country. We do not claim local offices we do not have.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16">
        <Container className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <Link key={route.id} href={route.href} className="border border-line bg-card p-8 hover:border-blue">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper">Route</p>
              <h2 className="mt-3 text-3xl font-semibold">{route.title}</h2>
              <p className="mt-3 leading-7 text-ink-soft">{route.body}</p>
              <span className="mt-6 inline-block text-sm font-semibold text-blue">Open {route.title}</span>
            </Link>
          ))}
        </Container>
      </section>

      <section className="border-b border-line bg-card py-16">
        <Container>
          <h2 className="text-3xl font-semibold tracking-[-0.03em]">Core services</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.id} className="border border-line p-6">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{service.outcome}</p>
                <ButtonLink href={service.href} variant="ghost" className="mt-4 min-h-10 px-0">
                  View {service.title}
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-line py-16">
        <Container>
          <h2 className="text-3xl font-semibold">How it works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-5">
            {processSteps.map((step) => (
              <li key={step.n} className="border border-line bg-card p-5">
                <p className="text-[0.75rem] font-semibold text-copper">{step.n}</p>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <ClientPreview />
      <PortfolioPreview />

      <section className="border-b border-line bg-charcoal py-16 text-card">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper">For trade</p>
            <h2 className="mt-3 text-3xl font-semibold">Repeat artwork, saved specs, reorders.</h2>
            <p className="mt-4 leading-7 text-card/72">
              Shops and agencies can keep approved files on record, ask for trade pricing after
              qualification, and reorder without rewriting the brief. Pricing rules are pending owner
              approval — we do not publish unverified discounts.
            </p>
            <ButtonLink href="/trade" variant="invert" className="mt-6">
              Open a Trade Account
            </ButtonLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {trustItems.map((item) => (
              <li key={item.title} className="border border-card/15 p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-card/70">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-line py-16">
        <Container>
          <h2 className="text-3xl font-semibold">Guides</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.href} className="border border-line bg-card p-6">
                <h3 className="text-xl font-semibold">
                  <Link href={guide.href} className="hover:text-blue">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{guide.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
