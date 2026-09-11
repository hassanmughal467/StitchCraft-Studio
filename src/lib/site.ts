/**
 * Central brand and contact configuration.
 *
 * REPLACE BEFORE LAUNCH:
 * - logo: src/components/brand/Logo.tsx (current mark is a temporary wordmark)
 * - phone, email, WhatsApp, address
 * - NEXT_PUBLIC_SITE_URL / canonical domain
 * - social profile URLs
 * - portfolio photographs in src/lib/portfolio.ts (marked PLACEHOLDER)
 * - hero and section photographs in src/lib/media.ts (marked PLACEHOLDER)
 */
export const site = {
  name: "StitchCraft Studio",
  shortName: "StitchCraft",
  tagline: "Threadline Digitizing",
  description:
    "Professional embroidery digitizing and custom patches for clothing brands, uniforms, sports teams, and merchandise businesses.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.stitchcraftstudio.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "quotes@example.com",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE ?? "+1 555 014 8820",
  phoneHref: (process.env.NEXT_PUBLIC_PHONE ?? "+15550148820").replace(/\s+/g, ""),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "15550148820",
  address: {
    // REPLACE: legal / studio address
    line1: "Studio address to be confirmed",
    locality: "Available worldwide",
    country: "International production support",
  },
  hours: "Monday–Friday, 9:00–18:00 (GMT)",
  social: {
    instagram: "https://instagram.com/", // REPLACE
    linkedin: "https://www.linkedin.com/", // REPLACE
    facebook: "https://www.facebook.com/", // REPLACE
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
    ".ofm",
    ".pxf",
  ],
  acceptLabel: "AI, EPS, PDF, SVG, PNG, JPG, DST, EMB, PES, EXP (max 15 MB)",
} as const;

export function whatsappHref(message?: string) {
  const text = encodeURIComponent(
    message ?? "Hello StitchCraft Studio — I would like a quote for embroidery digitizing or custom patches.",
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function mailtoHref() {
  return `mailto:${site.email}`;
}

export function telHref() {
  return `tel:${site.phoneHref}`;
}
