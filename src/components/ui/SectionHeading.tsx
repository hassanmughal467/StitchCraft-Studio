import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper",
        className,
      )}
    >
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
      <h2
        className={cn(
          "mt-3 font-display text-4xl leading-[1.1] tracking-[-0.02em] sm:text-5xl",
          invert ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p className={cn("mt-5 max-w-xl text-base leading-7", invert ? "text-ivory/72" : "text-ink-soft")}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
