import { describe, expect, it } from "vitest";
import {
  acceptQuote,
  applyPaymentEvent,
  approveProof,
  canAccess,
  canStartProduction,
  issueProof,
  issueQuoteVersion,
  projectForRole,
  reorderFrom,
  transition,
  WorkflowError,
  type Order,
  type Quote,
} from "@/lib/workflow";

const now = "2026-09-12T10:00:00.000Z";
const later = "2026-09-20T10:00:00.000Z";

function baseQuote(fulfillment: "digital" | "physical" = "physical"): Quote {
  return { reference: "SC-260912-ABCD", customerId: "cust-1", fulfillment, status: "new", versions: [] };
}

function quoted(fulfillment: "digital" | "physical" = "physical") {
  return issueQuoteVersion(baseQuote(fulfillment), {
    issuedAt: now,
    expiresAt: later,
    lineItems: [{ id: "li1", description: "Embroidered patch 3in", quantity: 100, unitPrice: { amount: 2.5, currency: "USD" }, serviceId: "custom-patches" }],
    shipping: fulfillment === "physical" ? { amount: 30, currency: "USD" } : undefined,
    paymentTerms: "deposit-50",
  });
}

function orderWithProof(fulfillment: "digital" | "physical" = "physical") {
  const { quote, order } = acceptQuote(quoted(fulfillment), 1, now, () => "ord-1");
  const proof = issueProof({ id: "pf-1", orderId: "ord-1", versions: [] }, { fileKey: "private/pf-1-v1.pdf", issuedAt: now, issuedBy: "staff-1" });
  return { quote, order: order as Order, proof };
}

describe("quote versions and acceptance", () => {
  it("issues versioned quotes and computes totals in one currency", () => {
    const q = quoted();
    expect(q.versions).toHaveLength(1);
    const { order } = acceptQuote(q, 1, now, () => "ord-1");
    expect(order?.total).toEqual({ amount: 280, currency: "USD" });
  });

  it("rejects mixed currencies and physical quotes without shipping", () => {
    expect(() =>
      issueQuoteVersion(baseQuote(), {
        issuedAt: now,
        expiresAt: later,
        lineItems: [
          { id: "a", description: "x", quantity: 1, unitPrice: { amount: 1, currency: "USD" }, serviceId: "s" },
          { id: "b", description: "y", quantity: 1, unitPrice: { amount: 1, currency: "GBP" }, serviceId: "s" },
        ],
        shipping: { amount: 1, currency: "USD" },
        paymentTerms: "full-upfront",
      }),
    ).toThrow(WorkflowError);
    expect(() => issueQuoteVersion(baseQuote(), { issuedAt: now, expiresAt: later, lineItems: [{ id: "a", description: "x", quantity: 1, unitPrice: { amount: 1, currency: "USD" }, serviceId: "s" }], paymentTerms: "full-upfront" })).toThrow(
      /shipping/,
    );
  });

  it("accepting twice is idempotent and stale versions are refused", () => {
    const q = quoted();
    const first = acceptQuote(q, 1, now, () => "ord-1");
    const second = acceptQuote(first.quote, 1, now, () => "ord-2");
    expect(second.order).toBeNull();
    expect(second.quote.orderId).toBe("ord-1");
    const q2 = issueQuoteVersion(q, { ...q.versions[0] });
    expect(() => acceptQuote(q2, 1, now, () => "x")).toThrow(/latest/);
    expect(() => acceptQuote(q, 1, "2027-01-01T00:00:00.000Z", () => "x")).toThrow(/expired/);
  });
});

describe("proof approval", () => {
  it("binds approval to the exact version and clears it on a new version", () => {
    const { proof } = orderWithProof();
    const approved = approveProof(proof, 1, "cust-1", now);
    expect(approved.approval?.version).toBe(1);
    const v2 = issueProof(approved, { fileKey: "private/pf-1-v2.pdf", issuedAt: later, issuedBy: "staff-1" });
    expect(v2.approval).toBeUndefined();
    expect(() => approveProof(v2, 1, "cust-1", later)).toThrow(/superseded/);
  });
});

describe("payments and production gate", () => {
  it("requires verified, non-duplicate payment events and enough paid before production", () => {
    const { order, proof } = orderWithProof();
    const approvedProof = approveProof(proof, 1, "cust-1", now);
    expect(canStartProduction(order, approvedProof).ok).toBe(false);
    expect(() => applyPaymentEvent(order, { id: "ev1", provider: "test", amount: { amount: 140, currency: "USD" }, status: "succeeded", verifiedSignature: false, receivedAt: now })).toThrow(/signature/);
    const paid = applyPaymentEvent(order, { id: "ev1", provider: "test", amount: { amount: 140, currency: "USD" }, status: "succeeded", verifiedSignature: true, receivedAt: now });
    const dup = applyPaymentEvent(paid, { id: "ev1", provider: "test", amount: { amount: 140, currency: "USD" }, status: "succeeded", verifiedSignature: true, receivedAt: now });
    expect(dup.paid.amount).toBe(140);
    expect(canStartProduction(dup, approvedProof).ok).toBe(true);
    const moved = transition(transition(dup, "awaiting-approval", "staff", now, { proof: approvedProof }), "in-production", "staff", now, { proof: approvedProof });
    expect(moved.status).toBe("in-production");
    expect(moved.history).toHaveLength(3);
  });

  it("blocks production when the proof is not approved", () => {
    const { order, proof } = orderWithProof();
    const paid = applyPaymentEvent(order, { id: "ev1", provider: "test", amount: { amount: 280, currency: "USD" }, status: "succeeded", verifiedSignature: true, receivedAt: now });
    expect(() => transition({ ...paid, status: "awaiting-approval" }, "in-production", "staff", now, { proof })).toThrow(/not approved/);
  });

  it("enforces fulfillment rules: tracking for shipping, full payment for digital delivery", () => {
    const physical = orderWithProof();
    const inProd: Order = { ...physical.order, status: "in-production" };
    expect(() => transition(inProd, "shipped", "staff", now, { proof: physical.proof })).toThrow(/tracking/);
    const withTracking = { ...inProd, tracking: { carrier: "DHL", number: "123", dispatchedAt: now } };
    expect(transition(withTracking, "shipped", "staff", now, { proof: physical.proof }).status).toBe("shipped");

    const digital = orderWithProof("digital");
    const digitalInProd: Order = { ...digital.order, status: "in-production" };
    expect(() => transition(digitalInProd, "shipped", "staff", now, { proof: digital.proof })).toThrow(/Digital/);
    expect(() => transition(digitalInProd, "delivered", "staff", now, { proof: digital.proof })).toThrow(/full payment/);
  });
});

describe("access and projections", () => {
  it("customers only access their own records; designers never see money or customer ids", () => {
    expect(canAccess("cust-1", { id: "cust-1", role: "customer" })).toBe(true);
    expect(canAccess("cust-1", { id: "cust-2", role: "customer" })).toBe(false);
    const { order } = orderWithProof();
    const view = projectForRole(order, "designer");
    expect(view).not.toHaveProperty("total");
    expect(view).not.toHaveProperty("customerId");
    expect(projectForRole(order, "admin")).toHaveProperty("total");
  });

  it("reorder copies the accepted specification but forces re-confirmation", () => {
    const { quote } = orderWithProof();
    const re = reorderFrom(quote, later, "SC-260920-WXYZ");
    expect(re.status).toBe("new");
    expect(re.versions[0].lineItems).toEqual(quote.versions[0].lineItems);
    expect(re.versions[0].notes).toMatch(/reconfirmed/);
  });
});
