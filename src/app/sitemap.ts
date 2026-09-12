import type { MetadataRoute } from "next";
import { absoluteUrl, siteEnv } from "@/lib/env";
import { hasPublishedPortfolio, publishedPortfolio } from "@/lib/portfolio";
import { guides, services } from "@/lib/services";

/** Public, canonical pages only. Quote, account, API and utility routes are excluded. */
export function publicPaths() {
  const paths = [
    "/",
    "/digitizing-artwork",
    "/custom-products",
    ...services.map((s) => s.href),
    "/trade",
    "/how-it-works",
    "/about",
    "/resources",
    ...guides.map((g) => g.href),
    "/contact",
    "/faq",
    "/shipping",
    "/artwork-guidelines",
    "/file-formats",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/cookies",
    "/accessibility",
  ];
  if (hasPublishedPortfolio()) {
    paths.push("/portfolio", ...publishedPortfolio().map((item) => `/portfolio/${item.slug}`));
  }
  return paths;
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteEnv.indexable) return [];
  const lastModified = new Date("2026-09-12");
  return publicPaths().map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : services.some((s) => s.href === path) ? 0.8 : 0.6,
  }));
}
