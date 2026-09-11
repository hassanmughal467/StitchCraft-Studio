import Image from "next/image";
import { cn } from "@/lib/utils";

type StudioImageProps = {
  src: string;
  alt: string;
  credit: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  caption?: string;
};

/** All photography is tagged PLACEHOLDER_IMAGE until real sew-outs are supplied. */
export function StudioImage({
  src,
  alt,
  credit,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  caption,
}: StudioImageProps) {
  return (
    <figure className={cn("relative overflow-hidden bg-paper", className)} data-placeholder="true" title={credit}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
      {caption ? (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-ink/55 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ivory">
          {caption}
        </figcaption>
      ) : (
        <span className="sr-only">{credit}</span>
      )}
    </figure>
  );
}
