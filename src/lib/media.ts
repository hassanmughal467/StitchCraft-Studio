/**
 * PLACEHOLDER photography.
 * Each entry is a licensed-style Unsplash stand-in.
 * Replace `src` with studio or production photos before launch.
 * Search the codebase for "PLACEHOLDER_IMAGE" to find every instance.
 */
export type MediaAsset = {
  src: string;
  alt: string;
  placeholder: true;
  credit: string;
};

export const media = {
  heroThread: {
    src: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1600&q=80",
    alt: "Industrial sewing machine stitching fabric on a production table",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with studio sewing / digitizing photo",
  },
  heroPatch: {
    src: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1400&q=80",
    alt: "Close embroidery stitches on dark fabric",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with close-up stitch or finished patch",
  },
  fabricTexture: {
    src: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1600&q=80",
    alt: "Woven textile texture in warm neutral tones",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with fabric / thread texture",
  },
  threadSpools: {
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=80",
    alt: "Arranged sewing thread and notions on a work surface",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with thread cone / production photo",
  },
  workshop: {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
    alt: "Focused production work at a well-lit studio desk",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with digitizing workstation photo",
  },
  jacket: {
    src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1400&q=80",
    alt: "Structured jacket hanging in a clothing studio",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with jacket-back embroidery photo",
  },
  cap: {
    src: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1400&q=80",
    alt: "Structured baseball cap on a clean background",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with cap embroidery sample",
  },
  workwear: {
    src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1400&q=80",
    alt: "Folded workwear garments ready for branding",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with uniform / workwear embroidery",
  },
  sports: {
    src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=80",
    alt: "Sports jersey fabric and athletic kit detail",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with team kit embroidery",
  },
  patchesTable: {
    src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80",
    alt: "Folded garments arranged for production review",
    placeholder: true,
    credit: "PLACEHOLDER_IMAGE — replace with patch layout / merrow-edge samples",
  },
} satisfies Record<string, MediaAsset>;
