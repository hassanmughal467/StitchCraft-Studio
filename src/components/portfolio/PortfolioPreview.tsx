import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { displayName, featuredPortfolio, publishedPortfolio } from "@/lib/portfolio";
import { getService } from "@/lib/services";

/** Renders nothing unless approved, published work exists. */
export function PortfolioPreview({ serviceId, limit = 6, featured = false }: { serviceId?: string; limit?: number; featured?: boolean }) {
  const items = (featured ? featuredPortfolio(limit) : publishedPortfolio())
    .filter((item) => !serviceId || item.service === serviceId)
    .slice(0, limit);
  if (!items.length) return null;

  return (
    <section className="border-b border-line py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={featured ? "Featured work" : "Selected work"} title={serviceId ? `${getService(serviceId)?.title} projects` : featured ? "Featured projects and studio samples" : "Recent projects and studio samples"} />
          <ButtonLink href="/portfolio" variant="secondary">
            View all work
          </ButtonLink>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const result = item.images.find((img) => img.stage === "result")!;
            return (
              <li key={item.slug} className="group overflow-hidden rounded-sm border border-line bg-card">
                <Link href={`/portfolio/${item.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-warm">
                    <Image src={result.src} alt={result.alt} width={result.width} height={result.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="p-5">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-copper-dark">{displayName(item)}</p>
                    <h3 className="mt-2 font-semibold group-hover:text-blue">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      {getService(item.service)?.title} · {item.placement}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
