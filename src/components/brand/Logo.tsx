import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid h-9 w-9 place-items-center rounded-sm text-card",
          invert ? "bg-card text-blue" : "bg-blue",
        )}
      >
        <svg viewBox="0 0 36 36" className="h-6 w-6" fill="none">
          <path d="M8 26c6-1 9-8 10-14 1 6 4 13 10 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M18 7v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="18" cy="6.2" r="1.4" fill="currentColor" />
        </svg>
      </span>
      <span className="sr-only">{site.name}</span>
      <span className="leading-none" aria-hidden>
        <span className={cn("block text-[1.05rem] font-semibold tracking-[-0.02em]", invert ? "text-card" : "text-charcoal")}>
          Brandstitch
        </span>
        <span className={cn("mt-0.5 block text-[0.68rem] font-medium uppercase tracking-[0.16em]", invert ? "text-card/70" : "text-blue")}>
          Works
        </span>
      </span>
    </span>
  );
}
