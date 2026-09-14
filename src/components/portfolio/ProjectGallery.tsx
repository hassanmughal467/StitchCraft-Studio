"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Lightbox } from "@/components/portfolio/Lightbox";
import type { PortfolioImage } from "@/lib/portfolio";

const stageLabel = { artwork: "Original artwork", proof: "Approved proof", result: "Finished result", detail: "Close-up" } as const;

export function ProjectGallery({ images }: { images: PortfolioImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);

  function close() {
    const index = open;
    setOpen(null);
    if (index !== null) triggers.current[index]?.focus();
  }

  return (
    <>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <li key={img.src} className="overflow-hidden rounded-sm border border-line bg-card">
            <button
              ref={(el) => {
                triggers.current[index] = el;
              }}
              type="button"
              onClick={() => setOpen(index)}
              className="block w-full text-left"
            >
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] h-auto w-full object-cover" />
              <p className="p-4 text-sm font-medium">{stageLabel[img.stage]}</p>
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? <Lightbox images={images} index={open} onClose={close} onChange={setOpen} /> : null}
    </>
  );
}
