"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { displayName, type PortfolioItem } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

type Filter = { id: string; label: string };

export function PortfolioGallery({ items, filters, serviceTitles }: { items: PortfolioItem[]; filters: Filter[]; serviceTitles: Record<string, string> }) {
  const [active, setActive] = useState<string>("all");
  const visible = useMemo(() => (active === "all" ? items : items.filter((item) => item.service === active)), [active, items]);

  return (
    <div>
      <div role="tablist" aria-label="Filter projects by service" className="flex flex-wrap gap-2">
        {[{ id: "all", label: "All" }, ...filters].map((filter) => (
          <button
            key={filter.id}
            role="tab"
            type="button"
            aria-selected={active === filter.id}
            onClick={() => setActive(filter.id)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-medium transition-colors",
              active === filter.id ? "border-blue bg-blue text-card" : "border-line bg-card text-ink-soft hover:border-charcoal hover:text-charcoal",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visible.map((item) => {
          const result = item.images.find((img) => img.stage === "result")!;
          return (
            <li key={item.slug} className="group overflow-hidden rounded-sm border border-line bg-card">
              <Link href={`/portfolio/${item.slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-warm">
                  <Image src={result.src} alt={result.alt} width={result.width} height={result.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-copper-dark">{displayName(item)}</p>
                  <h3 className="mt-2 font-semibold group-hover:text-blue">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    {serviceTitles[item.service]} · {item.placement}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
