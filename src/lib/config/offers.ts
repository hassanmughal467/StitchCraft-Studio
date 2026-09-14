/**
 * Announcement-banner campaigns.
 *
 * Nothing is published until `enabled` is true AND (if the copy mentions a
 * price, discount, free service or minimum) `approvedValue` is set.
 * Dates are ISO date strings (YYYY-MM-DD) in UTC.
 */

export type OfferAudience = "all" | "trade" | "new";

export type OfferCampaign = {
  id: string;
  enabled: boolean;
  message: string;
  linkLabel: string | null;
  href: string | null;
  startsAt: string | null;
  endsAt: string | null;
  audience: OfferAudience;
  /** Path prefixes; empty means every public page. */
  pages: string[];
  dismissible: boolean;
  campaign: string;
  /**
   * Required when the message asserts a price, discount, free service or
   * minimum. Leave null for informational copy with no commercial claim.
   */
  approvedValue: string | null;
};

export const offerCampaigns: OfferCampaign[] = [
  {
    id: "first-order-one-design",
    enabled: false,
    message: "First order? Start with one design.",
    linkLabel: "Request a quote",
    href: "/quote",
    startsAt: null,
    endsAt: null,
    audience: "new",
    pages: [],
    dismissible: true,
    campaign: "first-order-one-design",
    approvedValue: null,
  },
  {
    id: "artwork-review",
    enabled: false,
    message: "Not sure which service you need? Request an artwork review.",
    linkLabel: "Request a review",
    href: "/quote",
    startsAt: null,
    endsAt: null,
    audience: "all",
    pages: [],
    dismissible: true,
    campaign: "artwork-review",
    approvedValue: null,
  },
  {
    id: "trade-overflow",
    enabled: false,
    message: "Trade customer? Ask about overflow and repeat-order pricing.",
    linkLabel: "Trade information",
    href: "/trade",
    startsAt: null,
    endsAt: null,
    audience: "trade",
    pages: ["/trade", "/quote"],
    dismissible: true,
    campaign: "trade-overflow",
    approvedValue: null,
  },
  {
    id: "bulk-quantity",
    enabled: false,
    message: "Planning a bulk patch or cap order? Request quantity pricing.",
    linkLabel: "Request quantity pricing",
    href: "/quote?service=custom-patches",
    startsAt: null,
    endsAt: null,
    audience: "all",
    pages: ["/custom-patches", "/custom-hats", "/custom-products"],
    dismissible: true,
    campaign: "bulk-quantity",
    approvedValue: null,
  },
];

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export function offerIsScheduled(offer: OfferCampaign, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  if (offer.startsAt) {
    if (!isoDate.test(offer.startsAt) || offer.startsAt > today) return false;
  }
  if (offer.endsAt) {
    if (!isoDate.test(offer.endsAt) || offer.endsAt < today) return false;
  }
  return true;
}

export function offerHasPublicLink(offer: OfferCampaign) {
  return Boolean(offer.href?.trim() && offer.linkLabel?.trim());
}

/**
 * A campaign may go live only when it is enabled, in date, has no empty link,
 * and does not make an unapproved commercial claim.
 */
export function offerIsPublishable(offer: OfferCampaign, now = new Date()) {
  if (!offer.enabled) return false;
  if (!offer.message.trim()) return false;
  if ((offer.href && !offer.linkLabel) || (offer.linkLabel && !offer.href)) return false;
  if (assertsCommercialClaim(offer.message) && !offer.approvedValue?.trim()) return false;
  return offerIsScheduled(offer, now);
}

const claimPattern = /\b(off|discount|free|%\s*off|minimum|from\s*\$|save\s*\$)\b/i;

export function assertsCommercialClaim(message: string) {
  return claimPattern.test(message);
}

export function offerMatchesPage(offer: OfferCampaign, pathname: string) {
  if (!offer.pages.length) return true;
  return offer.pages.some((page) => pathname === page || pathname.startsWith(`${page}/`));
}

export function offerMatchesAudience(offer: OfferCampaign, audience: OfferAudience | "all" = "all") {
  if (offer.audience === "all" || audience === "all") return true;
  return offer.audience === audience;
}

export function activeOffers(pathname: string, now = new Date(), audience: OfferAudience | "all" = "all") {
  return offerCampaigns.filter(
    (offer) => offerIsPublishable(offer, now) && offerMatchesPage(offer, pathname) && offerMatchesAudience(offer, audience),
  );
}
