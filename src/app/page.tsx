import Link from "next/link";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ArtworkToStitch, HeroComposition } from "@/components/visuals/HeroComposition";
import { hasPublishedPortfolio } from "@/lib/portfolio";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { buyingAnswers, guides, routes, services, tradeBenefits } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Embroidery Digitizing & Custom Patches | ${site.name}`,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const showWork = hasPublishedPortfolio();

  return (
    <>
      <JsonLd data={faqJsonLd([...buyingAnswers])} />

      {/* 1. Hero */}
      <section className="border-b border-line bg-warm">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="lg:col-span-6">
            <Eyebrow>Embroidery digitizing · Custom patches · Apparel · Caps</Eyebrow>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-[3.25rem]">
              Embroidery Digitizing, Custom Patches &amp; Branded Apparel
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">
              From production-ready artwork to finished caps, patches and apparel. Custom work for print shops, brands, teams and individual orders.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quote">Request a Quote</ButtonLink>
              {showWork ? (
                <ButtonLink href="/portfolio" variant="secondary">
                  Explore Our Work
                </ButtonLink>
              ) : (
                <ButtonLink href="/how-it-works" variant="secondary">
                  How Ordering Works
                </ButtonLink>
              )}
            </div>
            <ul className="mt-8 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
              {[
                ["Artwork reviewed", "We check every file for stitch or print suitability before quoting."],
                ["Proof before production", "You approve a stitch preview or placement proof first."],
                ["Repeat orders on file", "Approved files stay with your reference for reorders."],
              ].map(([title, body]) => (
                <li key={title} className="border-l-2 border-copper pl-3">
                  <span className="block font-semibold text-charcoal">{title}</span>
                  <span className="mt-0.5 block leading-5">{body}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <HeroComposition />
          </div>
        </Container>
      </section>

      {/* 2. Selected work: rendered only when approved projects exist */}
      {showWork ? <PortfolioPreview /> : null}

      {/* 3. Two entry points */}
      <section className="border-b border-line bg-card py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Start here" title="Do you need files, or finished products?" lede="Both routes start with the same quote form. Choosing the right one tells us which details to ask for." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {routes.map((route, index) => (
              <Link
                key={route.id}
                href={route.href}
                className="group relative flex flex-col overflow-hidden rounded-sm border border-line bg-warm p-7 transition-colors hover:border-blue sm:p-8"
              >
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copper-dark">Route {index + 1}</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{route.title}</h3>
                <p className="mt-3 max-w-md leading-7 text-ink-soft">{route.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {route.items.map((item) => (
                    <li key={item} className="rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue">
                  Open {route.title}
                  <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden>
                    <path d="M3 8h9M8 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Seven services */}
      <section className="border-b border-line py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Services" title="Seven services, one quote form" lede="Each service page explains what to send, what you receive, what affects the price and how revisions work." />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ul>
        </Container>
      </section>

      {/* 5. Artwork to finished product */}
      <section className="border-b border-line bg-card py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Artwork to stitches"
              title="What changes between your logo and the sew-out"
              lede="Embroidery is not a print. Thin lines get thickened, tiny text is simplified, gradients become stitch directions, and the border is planned so the patch edge does not fray. The stitch preview shows these decisions before production."
            />
            <ul className="mt-6 space-y-3 text-sm leading-6 text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                <span>
                  <strong className="text-charcoal">Artwork:</strong> your vector or high-resolution logo, with the finished size and fabric.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                <span>
                  <strong className="text-charcoal">Proof:</strong> a stitch preview with color sequence and stitch count for your approval.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                <span>
                  <strong className="text-charcoal">Result:</strong> the file for your machine, or the finished patch, cap or garment.
                </span>
              </li>
            </ul>
            <Link href="/resources/embroidery-proofs" className="mt-6 inline-block text-sm font-semibold text-blue hover:underline">
              Read: understanding embroidery proofs
            </Link>
          </div>
          <div className="overflow-hidden rounded-sm border border-line bg-warm lg:col-span-7">
            <ArtworkToStitch id="home-compare" />
          </div>
        </Container>
      </section>

      {/* 6. Process */}
      <ProcessStrip />

      {/* 7. Trade */}
      <section className="border-b border-charcoal bg-charcoal py-16 text-card sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              invert
              eyebrow="For trade"
              title="Overflow capacity for print shops, decorators and agencies"
              lede="Send digitizing, vector and production jobs under your own reference. Files stay on record so repeat orders start from the approved version."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/trade" variant="invert">
                Trade information
              </ButtonLink>
              <ButtonLink href="/quote?customer=business" variant="invertGhost">
                Send a trade enquiry
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {tradeBenefits.map((item) => (
              <li key={item.title} className="rounded-sm border border-card/15 p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-card/70">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 8. Testimonials: omitted until approved feedback exists */}

      {/* 9. Buying answers */}
      <section className="border-b border-line py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Before you order" title="Price, minimums, timing and revisions" />
            <Link href="/faq" className="mt-5 inline-block text-sm font-semibold text-blue hover:underline">
              All frequently asked questions
            </Link>
          </div>
          <dl className="divide-y divide-line rounded-sm border border-line bg-card lg:col-span-8">
            {buyingAnswers.map((item) => (
              <div key={item.q} className="grid gap-2 p-5 sm:grid-cols-12 sm:gap-6">
                <dt className="font-semibold sm:col-span-4">{item.q}</dt>
                <dd className="text-sm leading-6 text-ink-soft sm:col-span-8">{item.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* 10. Guides + CTA */}
      <section className="border-b border-line bg-card py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Guides" title="Useful reading before you send artwork" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => (
              <li key={guide.href} className="rounded-sm border border-line bg-warm p-5">
                <h3 className="text-base font-semibold">
                  <Link href={guide.href} className="hover:text-blue">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{guide.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
