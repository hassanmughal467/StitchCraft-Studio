/**
 * Consent-aware, privacy-conscious analytics sink.
 *
 * Events are forwarded only when (a) a provider has pushed a `dataLayer` onto
 * window and (b) the visitor granted analytics consent (cookie `sc_consent=analytics`).
 *
 * Payload rules (enforced by the type below and `sanitize()`):
 *  - allowed: service id, customer type, step numbers, error categories, page type,
 *    campaign ids, contact method names, file counts, portfolio slugs (public URLs)
 *  - never: names, emails, phone numbers, addresses, artwork filenames or URLs,
 *    project descriptions, client names, previous-order references, quote references
 */
export type AnalyticsEvent =
  | { name: "service_page_viewed"; service: string }
  | { name: "portfolio_project_viewed"; project: string; service: string }
  | { name: "quote_started"; service?: string; customerType?: string; fromPortfolio?: boolean }
  | { name: "customer_type_selected"; customerType: string }
  | { name: "service_selected"; service: string }
  | { name: "quote_step_completed"; step: 1 | 2; service?: string }
  | { name: "upload_attempted"; fileCount: number; mode: "inline" | "direct" }
  | { name: "validation_error"; step: 1 | 2; category: "contact" | "service" | "specification" | "files" | "consent" | "deadline" | "server" }
  | { name: "quote_submitted"; service: string; customerType: string; fileCount: number; duplicate: boolean }
  | { name: "quote_submission_failed"; service?: string; reason: "network" | "validation" | "rate_limited" | "offline" | "server" | "upload" }
  | { name: "quote_unavailable" }
  | { name: "contact_method_selected"; method: "email" | "whatsapp" | "phone" }
  | { name: "offer_banner_viewed"; campaign: string }
  | { name: "offer_banner_clicked"; campaign: string }
  | { name: "offer_banner_dismissed"; campaign: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const allowedKeys = new Set(["service", "project", "customerType", "fromPortfolio", "step", "fileCount", "mode", "category", "duplicate", "reason", "method", "campaign"]);

/** Defensive: drop any key that is not on the allow-list and any long free text. */
export function sanitize(event: AnalyticsEvent): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = { event: event.name };
  for (const [key, value] of Object.entries(event)) {
    if (key === "name" || !allowedKeys.has(key)) continue;
    if (typeof value === "string") {
      if (value.length > 80 || /@|\d{6,}/.test(value)) continue;
      out[key] = value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
    }
  }
  return out;
}

export function hasAnalyticsConsent() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim() === "sc_consent=analytics");
}

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (!Array.isArray(window.dataLayer)) return;
  window.dataLayer.push(sanitize(event));
}

/** Maps a set of field errors to one coarse category for analytics. */
export function errorCategory(keys: string[]): Extract<AnalyticsEvent, { name: "validation_error" }>["category"] {
  if (keys.some((k) => ["artwork", "rights"].includes(k))) return keys.includes("artwork") ? "files" : "consent";
  if (keys.includes("consent")) return "consent";
  if (keys.some((k) => ["deadlineMode", "deadlineDate"].includes(k))) return "deadline";
  if (keys.some((k) => ["name", "company", "email", "phone", "countryCode", "countryName", "contactMethod", "customerType"].includes(k))) return "contact";
  if (keys.includes("service")) return "service";
  if (keys.includes("form")) return "server";
  return "specification";
}
