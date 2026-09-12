import { siteEnv } from "@/lib/env";

/**
 * Studio identity and contact channels.
 *
 * Every contact channel is optional and comes from validated environment
 * configuration. Unset or malformed values resolve to `null`, and the UI hides
 * that channel instead of showing a placeholder. Do not hard-code contact data.
 */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function validEmail(value: string | undefined) {
  const v = clean(value);
  return v && emailPattern.test(v) && !/example\.(com|org|net)$/i.test(v) ? v : null;
}

function validPhone(value: string | undefined) {
  const v = clean(value);
  if (!v) return null;
  const digits = v.replace(/[^\d+]/g, "");
  // Reject obvious placeholders (US 555 exchange) and short strings.
  if (digits.replace(/\D/g, "").length < 7 || /^\+?1?555/.test(digits)) return null;
  return { display: v, href: digits.startsWith("+") ? digits : `+${digits}` };
}

function validWhatsApp(value: string | undefined) {
  const v = clean(value)?.replace(/\D/g, "");
  if (!v || v.length < 7 || /^1?555/.test(v)) return null;
  return v;
}

function validUrl(value: string | undefined, hostIncludes: string) {
  const v = clean(value);
  if (!v) return null;
  try {
    const url = new URL(v);
    if (url.protocol !== "https:" || !url.hostname.includes(hostIncludes)) return null;
    // A bare platform homepage is not a profile link.
    if (url.pathname === "/" || url.pathname === "") return null;
    return url.toString();
  } catch {
    return null;
  }
}

const phone = validPhone(process.env.NEXT_PUBLIC_PHONE);

export const site = {
  name: "Stitchcraft Studio",
  shortName: "Stitchcraft",
  copyrightYear: 2026,
  legalName: clean(process.env.NEXT_PUBLIC_LEGAL_NAME),
  tagline: "Embroidery Digitizing, Custom Patches & Branded Apparel",
  description:
    "Embroidery digitizing, vector tracing, logo design, custom patches, embroidered apparel, screen printing and caps for print shops, brands, teams and individual orders.",
  /** Truthful location statement. Kept out of the hero; used on About, Contact and footer. */
  location: "Based in Pakistan, working with customers in the United States, the United Kingdom, Australia and worldwide.",
  country: "Pakistan",
  markets: ["United States", "United Kingdom", "Australia"],
  url: siteEnv.baseUrl,
  email: validEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  phone,
  whatsapp: validWhatsApp(process.env.NEXT_PUBLIC_WHATSAPP),
  hours: clean(process.env.NEXT_PUBLIC_SUPPORT_HOURS),
  address: {
    line1: clean(process.env.NEXT_PUBLIC_ADDRESS_LINE1),
    city: clean(process.env.NEXT_PUBLIC_ADDRESS_CITY),
    country: "Pakistan",
  },
  social: {
    instagram: validUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL, "instagram.com"),
    linkedin: validUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL, "linkedin.com"),
    facebook: validUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL, "facebook.com"),
  },
} as const;

export const contactChannels = {
  email: site.email,
  phone: site.phone,
  whatsapp: site.whatsapp,
  hasAny: Boolean(site.email || site.phone || site.whatsapp),
} as const;

export const socialLinks: Array<[label: string, href: string]> = (
  [
    ["Instagram", site.social.instagram],
    ["LinkedIn", site.social.linkedin],
    ["Facebook", site.social.facebook],
  ] as Array<[string, string | null]>
).filter((entry): entry is [string, string] => Boolean(entry[1]));

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
  acceptLabel: "AI, EPS, PDF, SVG, PNG, JPG, WEBP, DST, EMB, PES, EXP, JEF, OFM, PXF (max 15 MB)",
} as const;

export function whatsappHref(message?: string) {
  if (!site.whatsapp) return null;
  const text = encodeURIComponent(message ?? "Hello Stitchcraft Studio, I would like a quote.");
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function mailtoHref() {
  return site.email ? `mailto:${site.email}` : null;
}

export function telHref() {
  return site.phone ? `tel:${site.phone.href}` : null;
}
