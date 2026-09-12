import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { guides } from "@/lib/services";

export type GuideSection = { heading: string; body: React.ReactNode };

export function GuideLayout({
  href,
  title,
  description,
  intro,
  sections,
  related,
  visual,
  ctaHref,
}: {
  href: string;
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  related: { href: string; label: string }[];
  visual?: React.ReactNode;
  ctaHref?: string;
}) {
  const guide = guides.find((g) => g.href === href);
  const others = guides.filter((g) => g.href !== href);
  return (
    <>
      <JsonLd data={articleJsonLd({ headline: title, description, path: href, datePublished: guide?.datePublished ?? "2026-09-12" })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/resources" }, { name: title, path: href }])} />
      <section className="border-b border-line bg-warm py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-xs text-stone">
              <Link href="/resources" className="hover:text-charcoal">
                Guides
              </Link>{" "}
              / {title}
            </nav>
            <Eyebrow className="mt-4">Guide</Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">{intro}</p>
          </div>
          {visual ? <div className="overflow-hidden rounded-sm border border-line bg-card lg:col-span-5">{visual}</div> : null}
        </Container>
      </section>
      <section className="py-14 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {sections.map((section) => (
              <section key={section.heading} className="border-t border-line py-8 first:border-t-0 first:pt-0">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">{section.heading}</h2>
                <div className="prose-site mt-4 max-w-2xl leading-7 text-ink-soft">{section.body}</div>
              </section>
            ))}
          </article>
          <aside className="lg:col-span-4">
            <div className="rounded-sm border border-line bg-card p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copper-dark">Related services</p>
              <ul className="mt-3 space-y-2 text-sm">
                {related.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="font-medium text-blue hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copper-dark">More guides</p>
              <ul className="mt-3 space-y-2 text-sm">
                {others.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-blue">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
      <CtaBand href={ctaHref} />
    </>
  );
}
