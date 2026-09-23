import { fileLimits } from "@/lib/config/limits";
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
  name: "Brandstitch Works",
  shortName: "Brandstitch",
  copyrightYear: 2026,
  legalName: clean(process.env.NEXT_PUBLIC_LEGAL_NAME),
  tagline: "Embroidery Digitizing, Custom Patches and Branded Apparel",
  description:
    "Explore embroidery digitizing, vector artwork, custom patches, embroidery, and screen printing with Brandstitch Works. Tell us about your project.",
  /** Truthful location statement. Kept out of the hero; used on About, Contact and footer. */
  location: "Based in Pakistan, serving businesses and organizations in the United States, the United Kingdom, Australia and worldwide.",
  country: "Pakistan",
  markets: ["United States", "United Kingdom", "Australia"],
  url: siteEnv.baseUrl,
  email: validEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  phone,
  whatsapp: validWhatsApp(process.env.NEXT_PUBLIC_WHATSAPP),
  /** Customer-service availability, e.g. "Monday to Saturday, 09:00–18:00 PKT". Hidden when unset. */
  hours: clean(process.env.NEXT_PUBLIC_SUPPORT_HOURS),
  /**
   * Response-time statement shown on Contact and in confirmations, e.g.
   * "We usually reply within one business day." Hidden when unset; never invented.
   */
  responseStatement: clean(process.env.NEXT_PUBLIC_RESPONSE_STATEMENT),
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

/** Upload limits live in one place; re-exported here for existing imports. */
export const fileUpload = {
  maxSizeMb: fileLimits.maxSizeMb,
  maxFiles: fileLimits.maxFiles,
  accept: fileLimits.accept,
  acceptLabel: fileLimits.acceptLabel,
} as const;

/** WhatsApp deep link with the international number (digits only, no leading +). */
export function whatsappHref(message?: string) {
  if (!site.whatsapp) return null;
  const text = encodeURIComponent(message ?? "Hello Brandstitch Works, I would like a quote.");
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

/** Human-readable WhatsApp number for display, e.g. "+92 300 1234567" → "+923001234567". */
export function whatsappDisplay() {
  return site.whatsapp ? `+${site.whatsapp}` : null;
}

export function mailtoHref() {
  return site.email ? `mailto:${site.email}` : null;
}

export function telHref() {
  return site.phone ? `tel:${site.phone.href}` : null;
}
