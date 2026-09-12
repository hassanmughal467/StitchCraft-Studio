/**
 * Portfolio entries use PLACEHOLDER_IMAGE photography.
 * Do not invent client names or results. Replace `image.src` with real sew-outs.
 */

export const portfolioCategories = [
  "All",
  "Clients",
  "Logos",
  "Caps",
  "Jackets",
  "Uniforms",
  "Sports",
  "Workwear",
  "Patches",
  "3D Puff",
  "Appliqué",
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export type PortfolioItem = {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, "All" | "Clients">;
  placement: string;
  notes: string;
  featured?: boolean;
  image: {
    src: string;
    alt: string;
    placeholder: true;
    credit: string;
  };
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "left-chest-mark",
    title: "Left-chest brand mark",
    category: "Logos",
    featured: true,
    placement: "Polo / light twill",
    notes:
      "Small logo work where letter spacing and open counters have to stay readable at typical chest size. Fine serifs are converted to stitches that will hold after wash.",
    image: {
      src: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder close-up of embroidered stitches on dark cloth",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with left-chest logo sew-out",
    },
  },
  {
    id: "structured-cap-front",
    title: "Structured cap front",
    category: "Caps",
    featured: true,
    placement: "Mid-profile snapback",
    notes:
      "Cap files planned for a curved sewing field. Column widths and underlay are set so the design does not sink into the buckram or walk on the seam.",
    image: {
      src: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder structured baseball cap",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with cap front embroidery photo",
    },
  },
  {
    id: "jacket-back-panel",
    title: "Jacket-back panel",
    category: "Jackets",
    placement: "Satin or twill jacket",
    notes:
      "Large designs split and sequenced so the hoop stays stable. Density is reduced on heavy panels to limit puckering and show-through.",
    image: {
      src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder jacket suitable for a back embroidery panel",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with jacket-back embroidery photo",
    },
  },
  {
    id: "hospitality-identity",
    title: "Hospitality identity set",
    category: "Uniforms",
    placement: "Shirt, apron, and cap",
    notes:
      "A shared mark adapted to three placements so staff kits stay consistent without forcing one file onto every garment.",
    image: {
      src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder folded garments for a uniform program",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with uniform embroidery set",
    },
  },
  {
    id: "team-crest",
    title: "Team crest application",
    category: "Sports",
    placement: "Jersey and warm-up",
    notes:
      "Crests with mixed fill and outline. Small text is evaluated for stitch height; if it will not hold, we recommend a simplified version before production.",
    image: {
      src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder sports kit fabric",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with sports crest sew-out",
    },
  },
  {
    id: "industrial-chest",
    title: "Industrial chest mark",
    category: "Workwear",
    placement: "Heavy cotton / ripstop",
    notes:
      "Shorter stitch lengths and stronger underlay for garments that are washed hard. Contrast thread is specified against common navy, black, and hi-vis grounds.",
    image: {
      src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder folded workwear ready for branding",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with workwear embroidery photo",
    },
  },
  {
    id: "merrowed-badge",
    title: "Merrowed badge",
    category: "Patches",
    placement: "Sew-on or iron-on",
    notes:
      "Border width and fill direction set so the merrow sits even. Artwork is inset from the edge to keep detail out of the overlock.",
    image: {
      src: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder textile texture standing in for a finished patch",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with merrow-edge patch photo",
    },
  },
  {
    id: "raised-lettering",
    title: "Raised lettering",
    category: "3D Puff",
    placement: "Cap front / foam",
    notes:
      "Wide satin columns and simple letterforms. Fine counters and script are usually a poor fit for puff; we flag that before foam is cut.",
    image: {
      src: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder sewing machine work standing in for puff embroidery",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with 3D puff sew-out",
    },
  },
  {
    id: "fabric-applique-mark",
    title: "Fabric appliqué mark",
    category: "Appliqué",
    placement: "Fleece or twill",
    notes:
      "Placement stitch, tack-down, and cover satin sequenced for a clean trim. Fabric grain and felt vs twill are confirmed before the file is built.",
    image: {
      src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder thread and notions standing in for appliqué work",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with appliqué sample photo",
    },
  },
  {
    id: "script-wordmark",
    title: "Script wordmark",
    category: "Logos",
    placement: "Chest or sleeve",
    notes:
      "Connecting script needs consistent column width and planned lock stitches at the joins. We thicken hairlines that would disappear at sew size.",
    image: {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder sewing and fabric detail",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with script wordmark sew-out",
    },
  },
  {
    id: "side-cap-mark",
    title: "Side cap mark",
    category: "Caps",
    placement: "Low-crown side panel",
    notes:
      "Smaller field, closer to the seam. Detail is reduced so the design remains a mark, not a smear, once it wraps the panel.",
    image: {
      src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder cap from an alternate angle",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with side-cap embroidery photo",
    },
  },
  {
    id: "die-cut-shape",
    title: "Die-cut shape patch",
    category: "Patches",
    placement: "Hook-and-loop or sew-on",
    notes:
      "Outline follows the artwork rather than a circle or rectangle. Border stitches are planned so the cut edge does not fray after wear.",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      alt: "Placeholder apparel studio table for patch layout",
      placeholder: true,
      credit: "PLACEHOLDER_IMAGE — replace with die-cut patch photo",
    },
  },
];

export function getPortfolioItem(id: string) {
  return portfolioItems.find((item) => item.id === id);
}
