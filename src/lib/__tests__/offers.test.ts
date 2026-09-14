import { describe, expect, it } from "vitest";
import {
  activeOffers,
  assertsCommercialClaim,
  offerCampaigns,
  offerIsPublishable,
  offerIsScheduled,
  type OfferCampaign,
} from "@/lib/config/offers";

const sample = (overrides: Partial<OfferCampaign> = {}): OfferCampaign => ({
  id: "test",
  enabled: true,
  message: "First order? Start with one design.",
  linkLabel: "Request a quote",
  href: "/quote",
  startsAt: null,
  endsAt: null,
  audience: "all",
  pages: [],
  dismissible: true,
  campaign: "test",
  approvedValue: null,
  ...overrides,
});

describe("offer scheduling", () => {
  const now = new Date("2026-09-14T12:00:00Z");

  it("hides disabled, future and expired campaigns", () => {
    expect(offerIsPublishable(sample({ enabled: false }), now)).toBe(false);
    expect(offerIsScheduled(sample({ startsAt: "2026-09-20" }), now)).toBe(false);
    expect(offerIsScheduled(sample({ endsAt: "2026-09-01" }), now)).toBe(false);
    expect(offerIsPublishable(sample({ startsAt: "2026-09-01", endsAt: "2026-09-30" }), now)).toBe(true);
  });

  it("does not render an empty link", () => {
    expect(offerIsPublishable(sample({ href: "/quote", linkLabel: null }), now)).toBe(false);
    expect(offerIsPublishable(sample({ href: null, linkLabel: "Go" }), now)).toBe(false);
    expect(offerIsPublishable(sample({ href: null, linkLabel: null }), now)).toBe(true);
  });

  it("blocks discount copy without an approved value", () => {
    expect(assertsCommercialClaim("20% off first digitizing file")).toBe(true);
    expect(offerIsPublishable(sample({ message: "20% off first file", approvedValue: null }), now)).toBe(false);
    expect(offerIsPublishable(sample({ message: "20% off first file", approvedValue: "20% off one file" }), now)).toBe(true);
  });

  it("filters by page and keeps prepared campaigns unpublished", () => {
    expect(activeOffers("/embroidery-digitizing", now)).toEqual([]);
    const trade = sample({ pages: ["/trade"] });
    expect(offerIsPublishable(trade, now)).toBe(true);
    expect(offerCampaigns.every((offer) => offer.enabled === false)).toBe(true);
  });
});
