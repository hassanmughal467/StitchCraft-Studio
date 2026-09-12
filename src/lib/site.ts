/**
 * Configurable studio identity.
 * Pending owner values are marked PENDING — do not invent production data.
 */
export const site = {
  name: "Stitchcraft Studio",
  shortName: "Stitchcraft",
  copyrightYear: 2026,
  legalName: "Legal business name pending", // PENDING
  tagline: "Artwork prepared. Products made. Orders delivered with care.",
  description:
    "Embroidery digitizing, vector artwork, custom patches, branded apparel and caps for print shops, brands, teams and individual buyers.",
  base: "Pakistan-based studio serving international customers",
  priorityMarkets: ["United States", "United Kingdom", "Australia"],
  laterMarkets: ["Canada", "New Zealand"],
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.stitchcraftstudio.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "quotes@example.com",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE ?? "+1 555 014 8820",
  phoneHref: (process.env.NEXT_PUBLIC_PHONE ?? "+15550148820").replace(/\s+/g, ""),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "15550148820",
  address: {
    line1: "Studio address to be confirmed", // PENDING
    locality: "Pakistan",
    country: "Serves customers internationally — no overseas offices claimed",
  },
  hours: "Support hours by country pending — weekday coverage listed as GMT until confirmed",
  hoursByCountry: {
    US: "Pending",
    UK: "Pending",
    AU: "Pending",
  },
  social: {
    instagram: "https://instagram.com/", // PENDING
    linkedin: "https://www.linkedin.com/", // PENDING
    facebook: "https://www.facebook.com/", // PENDING
  },
} as const;

export const fileUpload = {
  maxSizeMb: 15,
  accept: [
    ".ai",
    ".eps",
    ".pdf",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".dst",
    ".emb",
    ".pes",
    ".exp",
    ".jef",
    ".ofm",
    ".pxf",
  ],
  acceptLabel: "AI, EPS, PDF, SVG, PNG, JPG, DST, EMB, PES, EXP, JEF (max 15 MB)",
} as const;

export function whatsappHref(message?: string) {
  const text = encodeURIComponent(
    message ?? "Hello Stitchcraft Studio — I would like a quote.",
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function mailtoHref() {
  return `mailto:${site.email}`;
}

export function telHref() {
  return `tel:${site.phoneHref}`;
}
