import type { MetadataRoute } from "next";
import { siteEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!siteEnv.indexable) {
    // Preview / unconfirmed domain: pages also carry noindex meta + X-Robots-Tag.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/quote/"],
    },
    sitemap: `${siteEnv.baseUrl}/sitemap.xml`,
  };
}
