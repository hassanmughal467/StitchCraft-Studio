import Link from "next/link";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import type { ServicePage } from "@/lib/services";

export function ServiceCard({ service, compact }: { service: ServicePage; compact?: boolean }) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-sm border border-line bg-card transition-colors hover:border-blue">
      <Link href={service.href} className="block aspect-[16/9] overflow-hidden border-b border-line bg-warm" aria-hidden tabIndex={-1}>
        <ServiceVisual kind={service.visual} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-copper-dark">{service.kind === "digital" ? "Files delivered" : "Products shipped"}</p>
        <h3 className="mt-2 text-lg font-semibold">
          <Link href={service.href} className="hover:text-blue">
            {service.title}
          </Link>
        </h3>
        {!compact ? <p className="mt-2 text-sm leading-6 text-ink-soft">{service.short}</p> : null}
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-4 text-sm font-semibold">
          <Link href={service.href} className="text-blue hover:underline">
            Details
          </Link>
          <Link href={`/quote?service=${service.id}`} className="text-charcoal hover:text-blue hover:underline">
            Request a quote
          </Link>
        </div>
      </div>
    </li>
  );
}
