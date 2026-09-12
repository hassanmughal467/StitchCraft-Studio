import Link from "next/link";
import { StudioImage } from "@/components/media/StudioImage";
import { Container } from "@/components/ui/Container";
import { portfolioItems } from "@/lib/portfolio";

export function PortfolioPreview() {
  const preview = portfolioItems.slice(0, 5);
  return (
    <section className="border-b border-line bg-card py-16">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper">
              Portfolio
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              Selected work, filtered by service.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-ink-soft">
              Filter the full gallery for digitizing, logos, patches, embroidery, print and caps.
              Photography is labeled as placeholder until studio sew-outs replace it.
            </p>
          </div>
          <Link href="/portfolio" className="text-sm font-semibold text-blue">
            Open the full gallery
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((item) => (
            <li key={item.id}>
              <Link href="/portfolio" className="group block h-full">
                <StudioImage
                  src={item.image.src}
                  alt={item.image.alt}
                  credit={item.image.credit}
                  className="aspect-[4/3]"
                  caption={item.category}
                />
                <p className="mt-4 text-xl font-semibold group-hover:text-blue">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-stone">
                  {item.placement}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
