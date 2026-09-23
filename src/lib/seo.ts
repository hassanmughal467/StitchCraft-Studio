import type { Metadata } from "next";
import { publicAbsoluteUrl, siteEnv } from "@/lib/env";
import { site } from "@/lib/site";

type BuildMeta = {
  title: string;
  description: string;
  path: string;
  /** Force noindex regardless of environment (private or utility routes). */
  noindex?: boolean;
  type?: "website" | "article";
};

/** Robots directive for the current environment. Preview builds are never indexable. */
export function robotsFor(noindex = false): NonNullable<Metadata["robots"]> {
  if (noindex || !siteEnv.indexable) {
    return { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } };
  }
  return { index: true, follow: true };
}

export function pageMetadata({ title, description, path, noindex, type = "website" }: BuildMeta): Metadata {
  const publicUrl = publicAbsoluteUrl(path);
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    // Canonicals are only emitted once the production domain is confirmed and indexing is on.
    alternates: siteEnv.indexable && publicUrl ? { canonical: publicUrl } : undefined,
    robots: robotsFor(noindex),
    openGraph: {
      title: fullTitle,
      description,
      ...(publicUrl ? { url: publicUrl } : {}),
      siteName: site.name,
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/** Organization schema without unconfirmed contact data or opening hours. */
export function organizationJsonLd() {
  const origin = siteEnv.productionUrl;
  const sameAs = [site.social.instagram, site.social.linkedin, site.social.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...(origin ? { "@id": `${origin}/#organization`, url: origin, logo: `${origin}/icon` } : {}),
    name: site.name,
    ...(site.legalName ? { legalName: site.legalName } : {}),
    description: site.description,
    address: { "@type": "PostalAddress", addressCountry: "PK" },
    areaServed: ["US", "GB", "AU"],
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone.href } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function serviceJsonLd(input: { name: string; description: string; path: string; serviceType: string }) {
  const url = publicAbsoluteUrl(input.path);
  const origin = siteEnv.productionUrl;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    ...(url ? { url } : {}),
    ...(origin ? { provider: { "@id": `${origin}/#organization` } } : {}),
    areaServed: ["US", "GB", "AU"],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const last = items.length - 1;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      // Intermediate crumbs need absolute item URLs when a production origin is configured.
      // The final crumb may omit `item` per Google BreadcrumbList guidance.
      const url = index < last ? publicAbsoluteUrl(item.path) : undefined;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(url ? { item: url } : {}),
      };
    }),
  };
}

export function articleJsonLd(input: { headline: string; description: string; path: string; datePublished: string; dateModified?: string }) {
  const origin = siteEnv.productionUrl;
  const page = publicAbsoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    ...(page ? { mainEntityOfPage: page } : {}),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(origin
      ? {
          author: { "@id": `${origin}/#organization` },
          publisher: { "@id": `${origin}/#organization` },
        }
      : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
