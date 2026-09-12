/**
 * Consent-aware analytics sink.
 *
 * No analytics provider is configured in this repository. Events are only
 * forwarded when (a) a provider has pushed a `dataLayer`/`gtag` onto window
 * and (b) the visitor has granted analytics consent (cookie `sc_consent=analytics`).
 * Event payloads must never contain personal data, artwork or file URLs.
 */
export type AnalyticsEvent =
  | { name: "quote_start"; service?: string; customerType?: string }
  | { name: "quote_step"; step: number; service?: string }
  | { name: "service_selected"; service: string }
  | { name: "quote_error"; field?: string; code?: string }
  | { name: "quote_submitted"; service: string; reference: string; duplicate: boolean }
  | { name: "quote_unavailable" };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function hasAnalyticsConsent() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim() === "sc_consent=analytics");
}

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (!Array.isArray(window.dataLayer)) return;
  const { name, ...params } = event;
  window.dataLayer.push({ event: name, ...params });
}
