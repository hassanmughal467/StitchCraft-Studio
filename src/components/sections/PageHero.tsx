import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  compact,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={cn("border-b border-line bg-cream", compact ? "py-14 sm:py-16" : "py-16 sm:py-24")}>
      <Container>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.08] tracking-[-0.03em] sm:text-6xl">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">{lede}</p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
