"use client";

import Image from "next/image";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import type { PortfolioImage } from "@/lib/portfolio";

const stageLabel = { artwork: "Original artwork", proof: "Approved proof", result: "Finished result", detail: "Close-up" } as const;

export function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: PortfolioImage[];
  index: number;
  onClose: () => void;
  onChange: (next: number) => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [index]);

  if (!image) return null;

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onChange((index + 1) % images.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onChange((index - 1 + images.length) % images.length);
    }
    if (event.key === "Tab") {
      const root = event.currentTarget;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>("button"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/85 p-4" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-sm bg-card p-4 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-base font-semibold">
            {stageLabel[image.stage]}
          </h2>
          <button ref={closeRef} type="button" onClick={onClose} className="inline-flex h-11 min-w-11 items-center justify-center rounded-sm border border-line px-3 text-sm font-semibold">
            Close
          </button>
        </div>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 56rem, 100vw" className="mt-4 h-auto w-full" />
        {images.length > 1 ? (
          <div className="mt-4 flex flex-wrap justify-between gap-3">
            <button type="button" className="min-h-11 rounded-sm border border-line px-4 text-sm font-semibold" onClick={() => onChange((index - 1 + images.length) % images.length)}>
              Previous image
            </button>
            <p className="self-center text-sm text-ink-soft">
              {index + 1} of {images.length}
            </p>
            <button type="button" className="min-h-11 rounded-sm border border-line px-4 text-sm font-semibold" onClick={() => onChange((index + 1) % images.length)}>
              Next image
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
