import Link from "next/link";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { publishedPortfolio } from "@/lib/portfolio";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { getService, routes, type ServicePage as Service } from "@/lib/services";

export function ServiceView({ service }: { service: Service }) {
  const related = service.related.map((id) => getService(id)).filter((s): s is Service => Boolean(s));
  const route = routes.find((r) => r.id === service.route)!;
  const quoteHref = `/quote?service=${service.id}`;
  const work = publishedPortfolio().filter((item) => item.service === service.id);

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: service.title, description: service.metaDescription, path: service.href, serviceType: service.title })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: route.title, path: route.href }, { name: service.title, path: service.href }])} />
      <JsonLd data={faqJsonLd(service.faqs)} />

      {/* Hero */}
      <section className="border-b border-line bg-warm">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb" className="text-xs text-stone">
              <ol className="flex flex-wrap gap-1.5">
                <li>
                  <Link href="/" className="hover:text-charcoal">
                    Home
                  </Link>
                  <span aria-hidden> /</span>
                </li>
                <li>
                  <Link href={route.href} className="hover:text-charcoal">
                    {route.title}
                  </Link>
                  <span aria-hidden> /</span>
                </li>
                <li aria-current="page" className="text-charcoal">
                  {service.title}
                </li>
              </ol>
            </nav>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">{service.h1}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">{service.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={quoteHref}>Request a Quote</ButtonLink>
              <ButtonLink href="#details" variant="secondary">
                What to send
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-stone">{service.kind === "digital" ? "You receive files by download." : "You receive finished products, shipped with tracking."}</p>
          </div>
          <div className="overflow-hidden rounded-sm border border-line bg-card shadow-sm lg:col-span-6">
            <ServiceVisual kind={service.visual} />
          </div>
        </Container>
      </section>

      {/* Who + deliverables + inputs */}
      <section id="details" className="scroll-mt-24 border-b border-line bg-card py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-3">
          <div>
            <Eyebrow>Who it&apos;s for</Eyebrow>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
              {service.buyers.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>What you receive</Eyebrow>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>What to send</Eyebrow>
            <ol className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
              {service.inputs.map((item, i) => (
                <li key={item} className="flex gap-3">
                  <span className="w-5 shrink-0 font-semibold text-charcoal">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Spec groups */}
      <section className="border-b border-line py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Options" title={`${service.title}: what we offer`} />
          <div className={`mt-10 grid gap-8 ${service.specs.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
            {service.specs.map((group) => (
              <div key={group.title}>
                <h3 className="text-lg font-semibold">{group.title}</h3>
                <ul className="mt-4 divide-y divide-line rounded-sm border border-line bg-card">
                  {group.items.map((item) => (
                    <li key={item.name} className="grid gap-1 px-4 py-3 sm:grid-cols-5 sm:gap-4">
                      <span className="font-medium text-charcoal sm:col-span-2">{item.name}</span>
                      <span className="text-sm leading-6 text-ink-soft sm:col-span-3">{item.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Work for this service */}
      {work.length ? <PortfolioPreview serviceId={service.id} /> : null}

      {/* Price factors, process, timing, revisions */}
      <section className="border-b border-line bg-card py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Pricing" title="What affects the price" lede="Every quote itemizes these factors so you can see what changes the cost." />
            <ul className="mt-6 space-y-2 text-sm leading-6 text-ink-soft">
              {service.priceFactors.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href={quoteHref} className="mt-8">
              Get a {service.title} quote
            </ButtonLink>
          </div>
          <div className="grid gap-6 lg:col-span-7">
            <div className="rounded-sm border border-line p-6">
              <h3 className="text-lg font-semibold">Process</h3>
              <ol className="mt-4 grid gap-3 sm:grid-cols-5">
                {service.process.map((step, i) => (
                  <li key={step} className="text-sm leading-6 text-ink-soft">
                    <span className="block text-[0.72rem] font-bold text-copper-dark">0{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-sm border border-line p-6">
                <h3 className="text-lg font-semibold">Turnaround</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{service.turnaround}</p>
              </div>
              <div className="rounded-sm border border-line p-6">
                <h3 className="text-lg font-semibold">Revisions</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{service.revisions}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-b border-line py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions" title={`${service.title} FAQs`} />
          </div>
          <div className="lg:col-span-8">
            {service.faqs.map((item) => (
              <details key={item.q} className="group border-b border-line py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">
                  {item.q}
                  <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" aria-hidden>
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Related */}
      <section className="bg-card py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Related" title="Often ordered together" />
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.id} service={item} compact />
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand title={`Ready to quote your ${service.title.toLowerCase()} job?`} href={quoteHref} />
    </>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden>
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
