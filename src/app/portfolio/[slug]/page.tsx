import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/analytics/ViewTracker";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { similarProjectCta } from "@/lib/copy";
import { adjacentProjects, displayName, getPortfolioItem, publishedPortfolio, quoteSimilarHref } from "@/lib/portfolio";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getService } from "@/lib/services";

export function generateStaticParams() {
  return publishedPortfolio().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  if (!item) return { robots: { index: false } };
  return pageMetadata({
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.brief,
    path: `/portfolio/${item.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  if (!item) notFound();
  const service = getService(item.service);
  const result = item.images.find((img) => img.stage === "result")!;
  const { previous, next } = adjacentProjects(item.slug);
  const related = item.service
    ? (service?.related ?? [])
        .map((id) => getService(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s))
        .slice(0, 3)
    : [];
  const quoteHref = quoteSimilarHref(item);

  return (
    <>
      <ViewTracker event={{ name: "portfolio_project_viewed", project: item.slug, service: item.service }} />
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
            <p className="mt-4 leading-7 text-ink-soft">{item.problem || item.brief}</p>
            {item.solution ? <p className="mt-3 leading-7 text-ink-soft">{item.solution}</p> : null}
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-stone">Service</dt>
                <dd className="font-medium">{service?.title}</dd>
              </div>
              {item.placement ? (
                <div>
                  <dt className="text-stone">Placement</dt>
                  <dd className="font-medium">{item.placement}</dd>
                </div>
              ) : null}
              {item.material ? (
                <div>
                  <dt className="text-stone">Material</dt>
                  <dd className="font-medium">{item.material}</dd>
                </div>
              ) : null}
              {item.finishedSize ? (
                <div>
                  <dt className="text-stone">Finished size</dt>
                  <dd className="font-medium">{item.finishedSize}</dd>
                </div>
              ) : null}
              {item.decorationMethod ? (
                <div>
                  <dt className="text-stone">Decoration</dt>
                  <dd className="font-medium">{item.decorationMethod}</dd>
                </div>
              ) : null}
              {item.formatsDelivered.length ? (
                <div>
                  <dt className="text-stone">Formats delivered</dt>
                  <dd className="font-medium">{item.formatsDelivered.join(", ")}</dd>
                </div>
              ) : null}
              {item.quantity ? (
                <div>
                  <dt className="text-stone">Quantity</dt>
                  <dd className="font-medium">{item.quantity}</dd>
                </div>
              ) : null}
            </dl>
            <ButtonLink href={quoteHref} className="mt-8">
              {similarProjectCta(item.service)}
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
          <ProjectGallery images={item.images} />
          {item.outcome ? <p className="mt-8 max-w-2xl leading-7 text-ink-soft">{item.outcome}</p> : null}
          <nav aria-label="Project" className="mt-10 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm font-semibold">
            {previous ? (
              <Link href={`/portfolio/${previous.slug}`} className="text-blue hover:underline">
                Previous: {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/portfolio/${next.slug}`} className="text-blue hover:underline">
                Next: {next.title}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Container>
      </section>
      {related.length ? (
        <section className="border-t border-line bg-card py-14 sm:py-16">
          <Container>
            <SectionHeading eyebrow="Related" title="Services used on similar jobs" />
            <ul className="mt-8 grid gap-5 sm:grid-cols-3">
              {related.map((relatedService) => (
                <ServiceCard key={relatedService.id} service={relatedService} compact />
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
      <CtaBand href={quoteHref} cta={similarProjectCta(item.service)} />
    </>
  );
}
