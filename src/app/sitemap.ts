import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const paths = [
  "/",
  "/digitizing-artwork",
  "/embroidery-digitizing",
  "/vector-tracing",
  "/custom-logo-design",
  "/custom-products",
  "/custom-patches",
  "/embroidered-apparel",
  "/screen-printing",
  "/custom-hats",
  "/portfolio",
  "/trade",
  "/how-it-works",
  "/about",
  "/resources",
  "/resources/choosing-a-patch-type",
  "/resources/embroidery-proofs",
  "/resources/artwork-for-printing",
  "/quote",
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/quote" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/quote" ? 0.9 : 0.7,
  }));
}
