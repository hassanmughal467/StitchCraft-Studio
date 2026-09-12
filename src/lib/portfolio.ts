import { services } from "@/lib/services";

/**
 * Portfolio content model.
 *
 * Publishing rules (enforced by `publishedPortfolio()`):
 *  - `published` must be true;
 *  - a `result` image must exist (no empty frames);
 *  - client work requires `permission.granted`; a customer name/mark is shown
 *    only when `permission.nameApproved` is also true;
 *  - studio samples are self-initiated work and are labeled as such.
 *
 * The array is intentionally empty until approved photography and permission
 * records are supplied (see docs/ASSETS_REQUIRED.md). Sections that depend on
 * the portfolio hide themselves while it is empty. Never add stock photography
 * or invented projects here.
 */

export type PortfolioStatus = "client-work" | "studio-sample";
export type ImageStage = "artwork" | "proof" | "result" | "detail";

export type PortfolioImage = {
  /** Path under /public (e.g. /portfolio/left-chest-01/result.jpg). */
  src: string;
  alt: string;
  width: number;
  height: number;
  stage: ImageStage;
};

export type PortfolioItem = {
  slug: string;
  title: string;
  /** Service id from src/lib/services.ts */
  service: string;
  status: PortfolioStatus;
  published: boolean;
  permission: {
    granted: boolean;
    nameApproved: boolean;
    customerName?: string;
    recordedOn?: string;
  };
  brief: string;
  material: string;
  placement: string;
  outcome: string;
  images: PortfolioImage[];
};

export const portfolioItems: PortfolioItem[] = [];

export function publishedPortfolio(): PortfolioItem[] {
  return portfolioItems.filter(
    (item) =>
      item.published &&
      item.images.some((img) => img.stage === "result") &&
      (item.status === "studio-sample" || item.permission.granted),
  );
}

export function hasPublishedPortfolio() {
  return publishedPortfolio().length > 0;
}

export function getPortfolioItem(slug: string) {
  return publishedPortfolio().find((item) => item.slug === slug);
}

/** Filters are derived from services that actually have published work. */
export function portfolioFilters() {
  const ids = new Set(publishedPortfolio().map((item) => item.service));
  return services.filter((service) => ids.has(service.id)).map((service) => ({ id: service.id, label: service.title }));
}

export function displayName(item: PortfolioItem) {
  if (item.status === "studio-sample") return "Studio sample";
  return item.permission.nameApproved && item.permission.customerName ? item.permission.customerName : "Client project";
}
