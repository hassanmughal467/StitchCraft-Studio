import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  markClassName?: string;
  stacked?: boolean;
  invert?: boolean;
};

export function Logo({ className, markClassName, stacked = false, invert = false }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        stacked && "flex-col items-start gap-1",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-[3px] border",
          invert ? "border-ivory/30 text-ivory" : "border-ink/80 text-ink",
          markClassName,
        )}
      >
        <svg viewBox="0 0 36 36" className="h-7 w-7" fill="none">
          <path
            d="M8 26c6-1 9-8 10-14 1 6 4 13 10 14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M18 7v5.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="18" cy="6.2" r="1.3" fill="currentColor" />
          <path
            d="M11 28.5h14"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="1.6 2.2"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[1.35rem] tracking-[-0.03em]",
            invert ? "text-ivory" : "text-ink",
          )}
        >
          StitchCraft
        </span>
        <span
          className={cn(
            "mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.22em]",
            invert ? "text-ivory/65" : "text-stone",
          )}
        >
          Studio
        </span>
      </span>
    </span>
  );
}
