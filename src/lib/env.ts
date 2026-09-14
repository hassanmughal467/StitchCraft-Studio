/**
 * Environment resolution for indexing, canonical URLs and provider availability.
 *
 * Production indexing is opt-in: it requires BOTH
 *   NEXT_PUBLIC_SITE_ENV=production
 *   NEXT_PUBLIC_SITE_URL=https://<confirmed-domain>
 * Anything else (local, Vercel preview, unconfirmed domain) is treated as a
 * preview: pages are served with noindex, no canonical, and an empty sitemap.
 */

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeOrigin(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

const configuredProductionUrl = normalizeOrigin(clean(process.env.NEXT_PUBLIC_SITE_URL));
const declaredEnv = clean(process.env.NEXT_PUBLIC_SITE_ENV);
const vercelHost = clean(process.env.NEXT_PUBLIC_VERCEL_URL) ?? clean(process.env.VERCEL_URL);
const port = clean(process.env.PORT) ?? "3000";

const isProduction = declaredEnv === "production" && Boolean(configuredProductionUrl);

const baseUrl = isProduction
  ? (configuredProductionUrl as string)
  : normalizeOrigin(vercelHost) ?? `http://localhost:${port}`;

export const siteEnv = {
  /** "production" only when the owner has confirmed the domain via env. */
  mode: isProduction ? ("production" as const) : ("preview" as const),
  isProduction,
  /** Absolute origin used for metadataBase, Open Graph and structured data. */
  baseUrl,
  /** Search engines may index only the confirmed production deployment. */
  indexable: isProduction,
  /** Confirmed production origin, or undefined when not yet approved. */
  productionUrl: configuredProductionUrl,
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteEnv.baseUrl).toString();
}

/**
 * Public, shareable URL. Uses the confirmed production origin only.
 * Preview hostnames (*.vercel.app) are never returned — callers must omit
 * canonical, Open Graph and schema URLs when this is undefined.
 */
export function publicAbsoluteUrl(path = "/"): string | undefined {
  if (!siteEnv.productionUrl) return undefined;
  return new URL(path, siteEnv.productionUrl).toString();
}
