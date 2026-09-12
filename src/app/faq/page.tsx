import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { buyingAnswers, services } from "@/lib/services";

export const metadata = pageMetadata({
  title: "FAQ: Ordering, Artwork, Proofs, Payment & Shipping",
  description: "Answers on pricing, minimums, turnaround, revisions, artwork files, proofs, payment and shipping for digitizing, patches, apparel and caps.",
  path: "/faq",
});

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  { title: "Pricing and ordering", items: [...buyingAnswers] },
  {
    title: "Artwork and files",
    items: [
      { q: "What artwork should I send?", a: "Vector files (AI, EPS, PDF, SVG) are best. A sharp PNG or JPG works for most logos. Tell us the finished size, the garment or product, and where the design goes." },
      { q: "Can you work from a photo or a screenshot?", a: "Often, yes. For simple marks we redraw the artwork; for complex designs we will tell you what can be reproduced before quoting." },
      { q: "Which embroidery formats do you deliver?", a: "DST, PES, EXP, JEF, EMB and other machine formats. Name your machine and we match the format." },
      { q: "Do I own the files?", a: "Files created for your artwork are yours to use once paid. For original logo design, usage rights are written on the quote." },
    ],
  },
  {
    title: "Proofs and production",
    items: [
      { q: "When does production start?", a: "After you approve the proof and, for product orders, after payment as stated on the quote. Digital files are released on payment." },
      { q: "What if the sew-out does not match the preview?", a: "Send a photo and the fabric details. We adjust the file at no charge when the issue is in the digitizing." },
      { q: "Can I change the design after approving?", a: "Yes, but the approved version is what goes to production. A change needs a revised proof and may affect price and date." },
    ],
  },
  {
    title: "Payment, shipping and reorders",
    items: [
      { q: "How do I pay?", a: "Accepted payment methods and terms are stated on your quote. We do not take payment on the website." },
      { q: "Do you ship to the US, UK and Australia?", a: "Yes. Shipping is quoted separately to your postal code, with an estimated transit time, on every product quote." },
      { q: "Can I reorder later?", a: "Yes. Quote your previous reference. We reuse the approved file and specification and reconfirm price and availability before running the job." },
      { q: "Do you handle customs or duties?", a: "Import duties and taxes in your country are the responsibility of the recipient unless the quote states otherwise." },
    ],
  },
];

export default function Page() {
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <JsonLd data={faqJsonLd(all)} />
      <PageHero eyebrow="FAQ" title="Practical answers before you send a file" dark={false} />
      <section className="border-b border-line bg-card py-14 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="FAQ sections" className="lg:col-span-3">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {groups.map((g) => (
                <li key={g.title}>
                  <a href={`#${slug(g.title)}`} className="inline-block rounded-sm px-2 py-1.5 text-sm text-ink-soft hover:text-blue">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-ink-soft">
              Service-specific questions are answered on each service page, for example{" "}
              <Link href={services[0].href} className="font-semibold text-blue hover:underline">
                embroidery digitizing
              </Link>
              .
            </p>
          </nav>
          <div className="lg:col-span-9">
            {groups.map((g) => (
              <section key={g.title} id={slug(g.title)} className="scroll-mt-24 pb-10">
                <h2 className="text-xl font-semibold">{g.title}</h2>
                <div className="mt-2">
                  {g.items.map((item) => (
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
              </section>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
