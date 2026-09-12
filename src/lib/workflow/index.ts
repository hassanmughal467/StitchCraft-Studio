/**
 * Order workflow domain model and rules.
 *
 * This module is the single source of truth for how quotes, orders, proofs,
 * approvals and payments relate, so that the same rules run on the server when
 * a database and authentication are connected. It has no I/O; every function
 * is pure and covered by unit tests in src/lib/__tests__/workflow.test.ts.
 *
 * Status: implemented and unit-tested; NOT yet wired to a database, auth or a
 * payment provider (see docs/OWNER_INPUTS_REQUIRED.md).
 */

export type Currency = "USD" | "GBP" | "AUD" | "EUR" | "PKR";
export type Money = { amount: number; currency: Currency };
export type Role = "customer" | "designer" | "production" | "admin";
export type Fulfillment = "digital" | "physical";

export type QuoteLineItem = { id: string; description: string; quantity: number; unitPrice: Money; serviceId: string };

export type QuoteVersion = {
  version: number;
  issuedAt: string;
  expiresAt: string;
  lineItems: QuoteLineItem[];
  shipping?: Money;
  tax?: Money;
  paymentTerms: "full-upfront" | "deposit-50" | "on-delivery" | "net-terms";
  notes?: string;
};

export type QuoteStatus = "new" | "needs-info" | "quoted" | "accepted" | "declined" | "expired";

export type Quote = {
  reference: string;
  customerId: string;
  fulfillment: Fulfillment;
  status: QuoteStatus;
  versions: QuoteVersion[];
  acceptedVersion?: number;
  orderId?: string;
};

export type ProofVersion = { version: number; fileKey: string; issuedAt: string; issuedBy: string };
export type ProofApproval = { version: number; approvedBy: string; approvedAt: string };
export type Proof = { id: string; orderId: string; versions: ProofVersion[]; approval?: ProofApproval };

export type PaymentEvent = { id: string; provider: string; amount: Money; status: "succeeded" | "failed" | "refunded"; verifiedSignature: boolean; receivedAt: string };

export type OrderStatus = "awaiting-proof" | "awaiting-approval" | "awaiting-payment" | "in-production" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  quoteReference: string;
  quoteVersion: number;
  customerId: string;
  fulfillment: Fulfillment;
  currency: Currency;
  total: Money;
  paid: Money;
  paymentTerms: QuoteVersion["paymentTerms"];
  status: OrderStatus;
  paymentEvents: PaymentEvent[];
  history: { at: string; from: OrderStatus | null; to: OrderStatus; by: string }[];
  tracking?: { carrier: string; number: string; dispatchedAt: string };
};

export class WorkflowError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

function addMoney(a: Money, b: Money | undefined): Money {
  if (!b) return a;
  if (a.currency !== b.currency) throw new WorkflowError("currency-mismatch", "All amounts on a quote must share one currency.");
  return { amount: round(a.amount + b.amount), currency: a.currency };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function quoteVersionTotal(version: QuoteVersion): Money {
  if (!version.lineItems.length) throw new WorkflowError("empty-quote", "A quote version needs at least one line item.");
  const currency = version.lineItems[0].unitPrice.currency;
  let total: Money = { amount: 0, currency };
  for (const item of version.lineItems) {
    if (item.quantity < 1) throw new WorkflowError("bad-quantity", "Quantities must be at least 1.");
    total = addMoney(total, { amount: round(item.unitPrice.amount * item.quantity), currency: item.unitPrice.currency });
  }
  total = addMoney(total, version.shipping);
  total = addMoney(total, version.tax);
  return total;
}

/** Staff issues a new quote version; earlier versions remain for audit. */
export function issueQuoteVersion(quote: Quote, version: Omit<QuoteVersion, "version">): Quote {
  if (quote.status === "accepted" || quote.status === "declined") {
    throw new WorkflowError("quote-closed", `Cannot issue a new version on a ${quote.status} quote.`);
  }
  if (quote.fulfillment === "physical" && !version.shipping) {
    throw new WorkflowError("shipping-required", "Physical quotes must state shipping.");
  }
  quoteVersionTotal({ ...version, version: 0 }); // validates currency and items
  const next = quote.versions.length + 1;
  return { ...quote, status: "quoted", versions: [...quote.versions, { ...version, version: next }] };
}

/** Customer accepts a specific version; creates the order once (idempotent by version). */
export function acceptQuote(quote: Quote, version: number, now: string, makeOrderId: () => string): { quote: Quote; order: Order | null } {
  const target = quote.versions.find((v) => v.version === version);
  if (!target) throw new WorkflowError("unknown-version", "That quote version does not exist.");
  if (target.version !== quote.versions.length) throw new WorkflowError("stale-version", "Only the latest quote version can be accepted.");
  if (Date.parse(target.expiresAt) < Date.parse(now)) throw new WorkflowError("expired", "This quote has expired; ask for a refreshed quote.");
  if (quote.status === "accepted") {
    if (quote.acceptedVersion === version) return { quote, order: null };
    throw new WorkflowError("already-accepted", "A different version was already accepted.");
  }
  const total = quoteVersionTotal(target);
  const order: Order = {
    id: makeOrderId(),
    quoteReference: quote.reference,
    quoteVersion: version,
    customerId: quote.customerId,
    fulfillment: quote.fulfillment,
    currency: total.currency,
    total,
    paid: { amount: 0, currency: total.currency },
    paymentTerms: target.paymentTerms,
    status: "awaiting-proof",
    paymentEvents: [],
    history: [{ at: now, from: null, to: "awaiting-proof", by: quote.customerId }],
  };
  return { quote: { ...quote, status: "accepted", acceptedVersion: version, orderId: order.id }, order };
}

export function issueProof(proof: Proof, version: Omit<ProofVersion, "version">): Proof {
  const next = proof.versions.length + 1;
  // A new proof version invalidates any earlier approval.
  return { ...proof, versions: [...proof.versions, { ...version, version: next }], approval: undefined };
}

/** Approval binds to the exact version; approving a superseded version is rejected. */
export function approveProof(proof: Proof, version: number, approvedBy: string, approvedAt: string): Proof {
  const latest = proof.versions[proof.versions.length - 1];
  if (!latest) throw new WorkflowError("no-proof", "No proof has been issued.");
  if (version !== latest.version) throw new WorkflowError("superseded-proof", `Proof v${version} is superseded by v${latest.version}. Review the latest version.`);
  if (proof.approval?.version === version) return proof;
  return { ...proof, approval: { version, approvedBy, approvedAt } };
}

export function isProofApproved(proof: Proof) {
  const latest = proof.versions[proof.versions.length - 1];
  return Boolean(latest && proof.approval && proof.approval.version === latest.version);
}

/** Applies a verified provider event exactly once. Client redirects never call this. */
export function applyPaymentEvent(order: Order, event: PaymentEvent): Order {
  if (!event.verifiedSignature) throw new WorkflowError("unverified-webhook", "Payment events must carry a verified signature.");
  if (order.paymentEvents.some((e) => e.id === event.id)) return order; // idempotent
  if (event.amount.currency !== order.currency) throw new WorkflowError("currency-mismatch", "Payment currency does not match the order.");
  let paid = order.paid;
  if (event.status === "succeeded") paid = addMoney(paid, event.amount);
  if (event.status === "refunded") paid = { amount: round(paid.amount - event.amount.amount), currency: paid.currency };
  return { ...order, paid, paymentEvents: [...order.paymentEvents, event] };
}

export function requiredBeforeProduction(order: Order): Money {
  switch (order.paymentTerms) {
    case "full-upfront":
      return order.total;
    case "deposit-50":
      return { amount: round(order.total.amount / 2), currency: order.currency };
    case "on-delivery":
    case "net-terms":
      return { amount: 0, currency: order.currency };
  }
}

export function canStartProduction(order: Order, proof: Proof) {
  if (!isProofApproved(proof)) return { ok: false as const, reason: "The latest proof version is not approved." };
  const required = requiredBeforeProduction(order);
  if (order.paid.amount + 1e-9 < required.amount) return { ok: false as const, reason: `Payment of ${required.amount} ${required.currency} is required before production.` };
  return { ok: true as const };
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
  "awaiting-proof": ["awaiting-approval", "cancelled"],
  "awaiting-approval": ["awaiting-proof", "awaiting-payment", "in-production", "cancelled"],
  "awaiting-payment": ["in-production", "cancelled"],
  "in-production": ["shipped", "delivered", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function transition(order: Order, to: OrderStatus, by: string, at: string, context: { proof: Proof }): Order {
  if (!transitions[order.status].includes(to)) throw new WorkflowError("bad-transition", `Cannot move an order from ${order.status} to ${to}.`);
  if (to === "in-production") {
    const gate = canStartProduction(order, context.proof);
    if (!gate.ok) throw new WorkflowError("production-blocked", gate.reason);
  }
  if (to === "shipped" && order.fulfillment !== "physical") throw new WorkflowError("digital-order", "Digital orders are delivered, not shipped.");
  if (to === "shipped" && !order.tracking) throw new WorkflowError("tracking-required", "Dispatch requires carrier and tracking number.");
  if (to === "delivered" && order.fulfillment === "digital" && order.paid.amount + 1e-9 < order.total.amount) {
    throw new WorkflowError("unpaid-digital", "Digital files are released only after full payment.");
  }
  return { ...order, status: to, history: [...order.history, { at, from: order.status, to, by }] };
}

/** Role-based projection: designers never see prices or customer contact data. */
export function projectForRole<T extends { total?: Money; paid?: Money; customerId?: string; paymentEvents?: unknown }>(record: T, role: Role): Partial<T> {
  if (role === "designer" || role === "production") {
    const { total: _t, paid: _p, customerId: _c, paymentEvents: _e, ...rest } = record;
    void _t;
    void _p;
    void _c;
    void _e;
    return rest as Partial<T>;
  }
  return record;
}

/** Access rule for private resources: a customer sees only their own records; staff by role. */
export function canAccess(resourceOwnerId: string, actor: { id: string; role: Role }) {
  if (actor.role === "admin") return true;
  if (actor.role === "customer") return actor.id === resourceOwnerId;
  return true; // designer/production access is further limited by projectForRole
}

/** Reorder copies approved specification into a new quote request; prices are always re-confirmed. */
export function reorderFrom(quote: Quote, now: string, newReference: string): Quote {
  if (quote.status !== "accepted" || !quote.acceptedVersion) throw new WorkflowError("not-accepted", "Only accepted quotes can be reordered.");
  const version = quote.versions.find((v) => v.version === quote.acceptedVersion)!;
  return {
    reference: newReference,
    customerId: quote.customerId,
    fulfillment: quote.fulfillment,
    status: "new",
    versions: [
      {
        ...version,
        version: 1,
        issuedAt: now,
        expiresAt: now, // forces staff to re-issue with current price and availability
        notes: `Reorder of ${quote.reference} v${quote.acceptedVersion}. Price and availability to be reconfirmed.`,
      },
    ],
  };
}
