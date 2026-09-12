import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  invert,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <Eyebrow className={invert ? "text-copper" : undefined}>{eyebrow}</Eyebrow> : null}
      <h2 className={cn("mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl", invert ? "text-card" : "text-charcoal")}>
        {title}
      </h2>
      {lede ? (
        <p className={cn("mt-4 text-base leading-7", invert ? "text-card/75" : "text-ink-soft")}>{lede}</p>
      ) : null}
    </div>
  );
}
