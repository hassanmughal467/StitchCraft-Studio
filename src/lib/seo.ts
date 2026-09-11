import type { Metadata } from "next";
import { site } from "@/lib/site";

type BuildMeta = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: BuildMeta): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = path === "/" ? `${site.name} — ${title}` : `${title} — ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phoneDisplay,
    areaServed: "Worldwide",
    serviceType: [
      "Embroidery digitizing",
      "Custom embroidered patches",
      "Logo digitizing",
      "3D puff embroidery",
    ],
    openingHours: "Mo-Fr 09:00-18:00",
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What artwork should I send for embroidery digitizing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vector files are preferred. Include intended size, garment or patch type, and thread colors.",
        },
      },
      {
        "@type": "Question",
        name: "Which embroidery file formats do you deliver?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DST, EMB, PES, EXP, and other shop formats on request.",
        },
      },
    ],
  };
}
