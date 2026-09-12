import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  compact,
  dark = true,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-b",
        dark ? "border-charcoal bg-charcoal text-card" : "border-line bg-warm text-charcoal",
        compact ? "py-12 sm:py-14" : "py-14 sm:py-20",
      )}
    >
      <Container>
        {eyebrow ? <Eyebrow className={dark ? "text-copper" : undefined}>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{title}</h1>
        {lede ? <p className={cn("mt-5 max-w-2xl text-lg leading-8", dark ? "text-card/72" : "text-ink-soft")}>{lede}</p> : null}
        {children}
      </Container>
    </section>
  );
}
