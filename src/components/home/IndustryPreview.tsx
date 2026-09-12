import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { industries } from "@/lib/content";

export function IndustryPreview() {
  return (
    <section className="border-b border-line py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">
              Industries we serve
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.02em] sm:text-5xl">
              The same mark, adapted to how it will be worn.
            </h2>
          </div>
          <Link href="/industries" className="text-sm text-copper hover:text-copper-dark">
            See all industries
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <li key={industry.title} className="border border-line bg-cream/80 p-6 transition-colors hover:border-copper/45">
              <h3 className="font-display text-xl tracking-[-0.02em]">{industry.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{industry.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
