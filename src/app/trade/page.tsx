import Link from "next/link";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { services, tradeBenefits } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Trade & Wholesale: Digitizing and Production for Print Shops",
  description: "Overflow embroidery digitizing, vector artwork and patch, apparel and cap production for print shops, embroiderers, promotional distributors and agencies.",
  path: "/trade",
});

const shops = [
  ["Embroidery shops", "Digitizing for your machines, cap and puff files, production fixes and patch supply."],
  ["Screen printers", "Vector redraws, separations, embroidered add-ons and patch or cap production for customer orders."],
  ["Promotional distributors", "White-label patches, apparel and caps quoted per job with shipping to you or your customer."],
  ["Agencies and brand studios", "Logo design, vector masters and production samples for client presentations."],
];

const jobs = [
  "Left-chest, cap, 3D puff and jacket-back digitizing",
  "Vector redraws and color separations",
  "Embroidered, woven, PVC and chenille patches",
  "Embroidered polos, hoodies, jackets and workwear",
  "Screen-printed shirts and event apparel",
  "Embroidered and patch caps",
];

const faqs = [
  { q: "How do I submit a repeat order?", a: "Quote your previous reference number in the quote form or by email. We confirm the approved file, quantity and any changes before running it." },
  { q: "How are my files handled?", a: "Artwork is used only for your job. We do not publish trade work or contact your customers. Files are kept on record for reorders unless you ask us to delete them." },
  { q: "How is trade pricing agreed?", a: "After your first job we agree written trade terms based on typical volume and job mix. Terms are confirmed on each quote; we do not publish a discount table." },
  { q: "Can you ship directly to my customer?", a: "Yes. Give the delivery address on the quote form. Packaging carries no Brandstitch Works branding unless you ask for it." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "For Trade", path: "/trade" }])} />
      <JsonLd data={faqJsonLd(faqs)} />
      <section className="border-b border-line bg-charcoal text-card">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <Eyebrow className="text-copper-soft">For trade and wholesale</Eyebrow>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">Production partner for print shops, decorators and agencies</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-card/75">
              Send overflow digitizing, vector work and product runs under your own reference. You get consistent proofs, files that run, and a record of every approved job.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quote?customer=business" variant="invert">
                Send a trade enquiry
              </ButtonLink>
              <ButtonLink href="#how" variant="invertGhost">
                How it works
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-3 self-center sm:grid-cols-2 lg:col-span-5">
            {shops.map(([title, body]) => (
              <li key={title} className="rounded-sm border border-card/15 p-4">
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-card/70">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="how" className="scroll-mt-24 border-b border-line bg-card py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="What we take on" title="Jobs we run for trade customers" />
            <ul className="mt-6 space-y-2 text-sm leading-6 text-ink-soft">
              {jobs.map((job) => (
                <li key={job} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                  {job}
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {tradeBenefits.map((item) => (
              <li key={item.title} className="rounded-sm border border-line bg-warm p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-line py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Working together" title="Submitting, reordering and file handling" />
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["Submit a job", "Use the quote form with your shop name and select Business. Attach artwork and your customer's specification. You receive an itemized quote under your reference."],
              ["Approve and produce", "You forward our stitch preview or placement proof to your customer, approve it, and production or digitizing starts. Files are delivered to you, not your customer."],
              ["Reorder", "Quote the previous reference. The approved file and specification are reused, and we reconfirm price, availability and any changes before running the job."],
            ].map(([title, body], i) => (
              <li key={title} className="rounded-sm border border-line bg-card p-6">
                <span className="text-[0.72rem] font-bold text-copper-dark">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-sm leading-6 text-ink-soft">
            Online accounts with saved specifications and self-service reordering are not offered yet. Reorders are handled through the quote form and email using your reference
            number.
          </p>
        </Container>
      </section>

      <PortfolioPreview />

      <section className="border-b border-line bg-card py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Trade questions" title="Common questions" />
            <p className="mt-4 text-sm leading-6 text-ink-soft">
              Service details, formats and price factors are on each{" "}
              <Link href="/digitizing-artwork" className="font-semibold text-blue hover:underline">
                service page
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            {faqs.map((item) => (
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

      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="Services" title="Start with the service you need" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={`/quote?service=${service.id}&customer=business`} className="inline-flex min-h-10 items-center rounded-full border border-line bg-card px-4 text-sm font-medium hover:border-blue hover:text-blue">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand title="Send your first trade job" body="Select Business on the quote form, attach the artwork and your customer's specification. We reply with an itemized quote under your reference." href="/quote?customer=business" />
    </>
  );
}
