import { services } from "@/lib/services";

/**
 * Portfolio content model.
 *
 * Publishing rules (enforced by `publishedPortfolio()`):
 *  - `published` must be true;
 *  - `permission.status` must be `"approved"` (or a studio sample);
 *  - a `result` image must exist (no empty frames);
 *  - a customer name is shown only when `permission.nameApproved` is also true.
 *
 * The array is intentionally empty until approved photography and permission
 * records are supplied (see docs/ASSETS_REQUIRED.md). Sections that depend on
 * the portfolio hide themselves while it is empty. Never add stock photography
 * or invented projects here.
 */

export type PortfolioStatus = "client-work" | "studio-sample";
export type ImageStage = "artwork" | "proof" | "result" | "detail";
export type PortfolioCustomerType = "embroidery-shop" | "screen-printer" | "distributor" | "agency" | "brand" | "team" | "individual" | "studio";
export type PermissionStatus = "draft" | "approved" | "withheld";

export type PortfolioImage = {
  /** Path under /public (e.g. /portfolio/left-chest-01/result.jpg). Descriptive filename required. */
  src: string;
  alt: string;
  width: number;
  height: number;
  stage: ImageStage;
};

export type PortfolioItem = {
  slug: string;
  title: string;
  service: string;
  customerType: PortfolioCustomerType;
  problem: string;
  solution: string;
  status: PortfolioStatus;
  published: boolean;
  featured: boolean;
  permission: {
    status: PermissionStatus;
    granted: boolean;
    nameApproved: boolean;
    customerName?: string;
    recordedOn?: string;
  };
  brief: string;
  material: string;
  finishedSize: string;
  placement: string;
  decorationMethod: string;
  formatsDelivered: string[];
  quantity?: string;
  outcome: string;
  seoTitle: string;
  seoDescription: string;
  images: PortfolioImage[];
};

export const portfolioItems: PortfolioItem[] = [];

function isPublishable(item: PortfolioItem) {
  if (!item.published) return false;
  if (!item.images.some((img) => img.stage === "result")) return false;
  if (item.status === "studio-sample") return item.permission.status !== "withheld";
  return item.permission.status === "approved" && item.permission.granted;
}

export function publishedPortfolio(): PortfolioItem[] {
  return portfolioItems.filter(isPublishable);
}

export function featuredPortfolio(limit = 6): PortfolioItem[] {
  return publishedPortfolio()
    .filter((item) => item.featured)
    .slice(0, limit);
}

export function hasPublishedPortfolio() {
  return publishedPortfolio().length > 0;
}

export function getPortfolioItem(slug: string) {
  return publishedPortfolio().find((item) => item.slug === slug);
}

export function adjacentProjects(slug: string) {
  const items = publishedPortfolio();
  const index = items.findIndex((item) => item.slug === slug);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: items[index - 1],
    next: items[index + 1],
  };
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

export function quoteSimilarHref(item: Pick<PortfolioItem, "service" | "slug" | "title">) {
  const params = new URLSearchParams({ service: item.service, project: item.slug });
  return `/quote?${params.toString()}`;
}
