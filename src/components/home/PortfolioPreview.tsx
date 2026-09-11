import Link from "next/link";
import { StudioImage } from "@/components/media/StudioImage";
import { Container } from "@/components/ui/Container";
import { portfolioItems } from "@/lib/portfolio";

export function PortfolioPreview() {
  const preview = portfolioItems.slice(0, 6);
  return (
    <section className="border-b border-line bg-cream py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">
              Selected placements
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.02em] sm:text-5xl">
              Work by garment, not by invented case studies.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ink-soft">
              These tiles show the kinds of placements we digitize. Photography is labeled as placeholder
              until studio sew-outs replace it. We do not invent client names or results.
            </p>
          </div>
          <Link href="/portfolio" className="text-sm text-ink underline-offset-4 hover:underline">
            Open the full gallery
          </Link>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((item) => (
            <li key={item.id}>
              <Link href="/portfolio" className="group block">
                <StudioImage
                  src={item.image.src}
                  alt={item.image.alt}
                  credit={item.image.credit}
                  className="aspect-[4/3]"
                  caption={item.category}
                />
                <p className="mt-4 font-display text-2xl tracking-[-0.02em] group-hover:text-copper">
                  {item.title}
                </p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-stone">
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
