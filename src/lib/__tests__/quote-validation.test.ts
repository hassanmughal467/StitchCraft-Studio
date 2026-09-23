import { describe, expect, it } from "vitest";
import {
  emptyQuote,
  resolveCustomerParam,
  resolveServiceParam,
  validateQuote,
  type QuotePayload,
} from "@/lib/quote";

function base(overrides: Partial<QuotePayload> = {}): QuotePayload {
  return {
    ...emptyQuote("embroidery-digitizing"),
    submissionId: "6f1c2a3e-4b5d-4c6e-8f70-1a2b3c4d5e6f",
    customerType: "Business",
    name: "Test Customer",
    company: "Test Shop",
    email: "buyer@example.test",
    countryCode: "US",
    contactMethod: "Email",
    details: "Left chest logo.",
    deadlineMode: "flexible",
    width: "3.5",
    height: "2",
    unit: "in",
    placement: "Left chest",
    fabric: "Piqué",
    embroideryStyle: "Flat embroidery",
    formatNeeded: "DST",
    designCount: "1",
    consent: true,
    ...overrides,
  };
}

describe("service and customer preselection", () => {
  it("accepts known service ids and ignores unknown ones", () => {
    expect(resolveServiceParam("embroidery-digitizing")).toBe("embroidery-digitizing");
    expect(resolveServiceParam("custom-hats")).toBe("custom-hats");
    expect(resolveServiceParam("not-a-service")).toBe("");
    expect(resolveServiceParam(undefined)).toBe("");
  });

  it("maps customer=individual and defaults to Business", () => {
    expect(resolveCustomerParam("individual")).toBe("Individual");
    expect(resolveCustomerParam("business")).toBe("Business");
    expect(resolveCustomerParam(undefined)).toBe("Business");
  });
});

describe("country", () => {
  it("requires a name when Other is selected", () => {
    const errors = validateQuote(base({ countryCode: "OTHER", countryName: "" }));
    expect(errors.countryName).toBeDefined();
    expect(validateQuote(base({ countryCode: "OTHER", countryName: "Faroe Islands" })).countryName).toBeUndefined();
  });

  it("rejects an unknown country code", () => {
    expect(validateQuote(base({ countryCode: "XX" })).countryCode).toBeDefined();
  });
});

describe("deadline", () => {
  const now = new Date("2026-09-14T12:00:00Z");

  it("rejects past dates on fixed and preferred modes", () => {
    const fixed = validateQuote(base({ deadlineMode: "fixed", deadlineDate: "2026-09-13" }), { fileCount: 0, now });
    expect(fixed.deadlineDate).toMatch(/passed/);
    const preferred = validateQuote(base({ deadlineMode: "preferred", deadlineDate: "2026-09-01" }), { fileCount: 0, now });
    expect(preferred.deadlineDate).toMatch(/passed/);
  });

  it("accepts today and flexible with no date", () => {
    expect(validateQuote(base({ deadlineMode: "fixed", deadlineDate: "2026-09-14" }), { fileCount: 0, now }).deadlineDate).toBeUndefined();
    expect(validateQuote(base({ deadlineMode: "flexible", deadlineDate: "" }), { fileCount: 0, now }).deadlineDate).toBeUndefined();
  });
});

describe("dimensions and quantity", () => {
  it("rejects zero and negative sizes", () => {
    expect(validateQuote(base({ width: "0", height: "2" })).width).toBeDefined();
    expect(validateQuote(base({ width: "-1", height: "2" })).width).toBeDefined();
  });

  it("allows size-not-decided", () => {
    expect(validateQuote(base({ sizeUndecided: true, width: "", height: "" })).width).toBeUndefined();
  });
});

describe("screen printing", () => {
  it("requires ink colors and destination fields", () => {
    const payload = base({
      service: "screen-printing",
      productType: "T-shirts",
      quantity: "24",
      garmentColors: "Navy",
      placements: "Full front",
      supplyMode: "Brandstitch Works supplies the garments",
      destinationCity: "Austin",
      postalCode: "78701",
    });
    expect(validateQuote(payload).inkColors).toBeDefined();
    expect(validateQuote({ ...payload, inkColors: "2 colors" })).toEqual({});
  });
});

describe("logo design artwork rights", () => {
  it("does not require rights when no files are uploaded", () => {
    const payload = base({
      service: "custom-logo-design",
      wording: "North Peak",
      industry: "Outdoor retail",
      audience: "Hikers",
      requiredUses: "Caps and site",
      styleDirection: "Badge or crest",
      deliverables: "Vector files (AI, EPS, SVG, PDF)",
    });
    expect(validateQuote(payload, { fileCount: 0 }).rights).toBeUndefined();
    expect(validateQuote(payload, { fileCount: 1 }).rights).toBeDefined();
  });
});
