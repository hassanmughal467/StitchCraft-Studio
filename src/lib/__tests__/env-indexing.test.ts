import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Indexing must be opt-in: only a confirmed production domain is crawlable.
 * Modules read process.env at import time, so each case re-imports them.
 */
async function load(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const key of ["NEXT_PUBLIC_SITE_ENV", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_VERCEL_URL", "VERCEL_URL"]) {
    vi.stubEnv(key, env[key] ?? "");
  }
  const envMod = await import("@/lib/env");
  const robots = (await import("@/app/robots")).default;
  const sitemap = (await import("@/app/sitemap")).default;
  const seo = await import("@/lib/seo");
  return { siteEnv: envMod.siteEnv, robots: robots(), sitemap: sitemap(), seo };
}

afterEach(() => vi.unstubAllEnvs());

describe("indexing by environment", () => {
  it("treats local and Vercel previews as noindex with an empty sitemap and no canonical", async () => {
    const preview = await load({ NEXT_PUBLIC_VERCEL_URL: "stitchcraft-studio-abc.vercel.app" });
    expect(preview.siteEnv.mode).toBe("preview");
    expect(preview.siteEnv.baseUrl).toBe("https://stitchcraft-studio-abc.vercel.app");
    expect(preview.robots).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(preview.sitemap).toEqual([]);
    const meta = preview.seo.pageMetadata({ title: "Test", description: "d", path: "/custom-patches" });
    expect(meta.alternates?.canonical).toBeUndefined();
    expect(meta.openGraph?.url).toBeUndefined();
    expect(JSON.stringify(meta)).not.toContain("vercel.app");
    expect(preview.seo.organizationJsonLd().url).toBeUndefined();
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("requires both SITE_ENV=production and a confirmed https SITE_URL", async () => {
    const envOnly = await load({ NEXT_PUBLIC_SITE_ENV: "production" });
    expect(envOnly.siteEnv.indexable).toBe(false);
    const urlOnly = await load({ NEXT_PUBLIC_SITE_URL: "https://www.example-studio.com" });
    expect(urlOnly.siteEnv.indexable).toBe(false);
    const insecure = await load({ NEXT_PUBLIC_SITE_ENV: "production", NEXT_PUBLIC_SITE_URL: "http://www.example-studio.com" });
    expect(insecure.siteEnv.indexable).toBe(false);
  });

  it("indexes the confirmed production domain with canonicals and a populated sitemap", async () => {
    const prod = await load({ NEXT_PUBLIC_SITE_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://www.example-studio.com/" });
    expect(prod.siteEnv.mode).toBe("production");
    expect(prod.siteEnv.baseUrl).toBe("https://www.example-studio.com");
    expect(prod.robots).toMatchObject({ rules: { userAgent: "*", allow: "/" }, sitemap: "https://www.example-studio.com/sitemap.xml" });
    const urls = prod.sitemap.map((entry) => entry.url);
    expect(urls).toContain("https://www.example-studio.com/");
    expect(urls).toContain("https://www.example-studio.com/custom-patches");
    expect(urls.some((u) => u.includes("/quote") || u.includes("/account") || u.includes("/api"))).toBe(false);
    // Portfolio is hidden until items are published.
    expect(urls.some((u) => u.includes("/portfolio"))).toBe(false);
    const meta = prod.seo.pageMetadata({ title: "Test", description: "d", path: "/custom-patches" });
    expect(meta.alternates?.canonical).toBe("https://www.example-studio.com/custom-patches");
    expect(meta.openGraph?.url).toBe("https://www.example-studio.com/custom-patches");
    expect(prod.seo.organizationJsonLd().url).toBe("https://www.example-studio.com");
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });
});
