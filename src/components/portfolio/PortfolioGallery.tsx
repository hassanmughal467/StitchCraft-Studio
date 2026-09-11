"use client";

import { useEffect, useMemo, useState } from "react";
import { StudioImage } from "@/components/media/StudioImage";
import { Button } from "@/components/ui/Button";
import { portfolioCategories, portfolioItems, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function PortfolioGallery() {
  const [filter, setFilter] = useState<PortfolioCategory>("All");
  const [active, setActive] = useState<PortfolioItem | null>(null);

  const items = useMemo(
    () => (filter === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === filter)),
    [filter],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Portfolio categories">
        {portfolioCategories.map((category) => {
          const selected = filter === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(category)}
              className={cn(
                "min-h-10 border px-3 text-[0.72rem] uppercase tracking-[0.12em] transition-colors",
                selected
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-transparent text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="mt-12 border border-line bg-cream px-5 py-10 text-center text-sm text-stone">
          No samples in this category yet. Choose another filter or request a quote for a similar placement.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item)}
                className="group block w-full text-left"
              >
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
              </button>
            </li>
          ))}
        </ul>
      )}

      {active ? <ProjectModal item={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}

function ProjectModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-ivory"
        onClick={(event) => event.stopPropagation()}
      >
        <StudioImage
          src={item.image.src}
          alt={item.image.alt}
          credit={item.image.credit}
          className="aspect-[16/10]"
          sizes="800px"
        />
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-copper">
            {item.category} · {item.placement}
          </p>
          <h2 id="project-title" className="mt-2 font-display text-3xl tracking-[-0.02em]">
            {item.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-soft">{item.notes}</p>
          <p className="mt-4 text-xs text-stone">
            Sample photography is a placeholder until studio sew-outs are added. No client names or results are implied.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={onClose} variant="secondary">
              Close
            </Button>
            <a
              href="/contact"
              className="inline-flex min-h-12 items-center bg-copper px-6 text-[0.8rem] font-medium uppercase tracking-[0.08em] text-cream hover:bg-copper-dark"
            >
              Request a similar file
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
