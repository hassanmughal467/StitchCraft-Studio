import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { displayName, getPortfolioItem, publishedPortfolio } from "@/lib/portfolio";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";

export function generateStaticParams() {
  return publishedPortfolio().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  if (!item) return { robots: { index: false } };
  return pageMetadata({ title: item.title, description: item.brief, path: `/portfolio/${item.slug}` });
}

const stageLabel = { artwork: "Original artwork", proof: "Approved proof", result: "Finished result", detail: "Detail" } as const;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  if (!item) notFound();
  const service = getService(item.service);
  const result = item.images.find((img) => img.stage === "result")!;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }, { name: item.title, path: `/portfolio/${item.slug}` }])} />
      <section className="border-b border-line bg-warm py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <nav aria-label="Breadcrumb" className="text-xs text-stone">
              <Link href="/portfolio" className="hover:text-charcoal">
                Portfolio
              </Link>{" "}
              / {item.title}
            </nav>
            <Eyebrow className="mt-4">{displayName(item)}</Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{item.title}</h1>
            <p className="mt-4 leading-7 text-ink-soft">{item.brief}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-stone">Service</dt>
                <dd className="font-medium">{service?.title}</dd>
              </div>
              <div>
                <dt className="text-stone">Placement</dt>
                <dd className="font-medium">{item.placement}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-stone">Material</dt>
                <dd className="font-medium">{item.material}</dd>
              </div>
            </dl>
            <ButtonLink href={`/quote?service=${item.service}`} className="mt-8">
              Quote a similar job
            </ButtonLink>
          </div>
          <div className="overflow-hidden rounded-sm border border-line bg-card lg:col-span-7">
            <Image src={result.src} alt={result.alt} width={result.width} height={result.height} sizes="(min-width: 1024px) 58vw, 100vw" priority className="h-auto w-full" />
          </div>
        </Container>
      </section>
      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-semibold">From artwork to result</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {item.images.map((img) => (
              <li key={img.src} className="overflow-hidden rounded-sm border border-line bg-card">
                <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] h-auto w-full object-cover" />
                <p className="p-4 text-sm font-medium">{stageLabel[img.stage]}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl leading-7 text-ink-soft">{item.outcome}</p>
        </Container>
      </section>
      <CtaBand href={`/quote?service=${item.service}`} />
    </>
  );
}
