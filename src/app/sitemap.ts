import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const paths = [
  "/",
  "/services",
  "/embroidery-digitizing",
  "/custom-patches",
  "/industries",
  "/portfolio",
  "/how-it-works",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/contact" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/contact" ? 0.9 : 0.7,
  }));
}
