/**
 * Owner-controlled commercial facts.
 *
 * Every value is `null` until the owner supplies a verified figure or statement.
 * Service pages render a row only when the value is a non-empty string.
 * Do not invent prices, minimums, turnaround times or legal promises here.
 */

export type ServiceCommercial = {
  startingPrice: string | null;
  minimumQuantity: string | null;
  typicalTurnaround: string | null;
  rushAvailability: string | null;
  revisionsIncluded: string | null;
  supportedFormats: string | null;
  proofType: string | null;
  shippingRequirement: string | null;
  exclusions: string | null;
};

export type CommercialRow = { label: string; value: string };

const empty: ServiceCommercial = {
  startingPrice: null,
  minimumQuantity: null,
  typicalTurnaround: null,
  rushAvailability: null,
  revisionsIncluded: null,
  supportedFormats: null,
  proofType: null,
  shippingRequirement: null,
  exclusions: null,
};

const labels: Record<keyof ServiceCommercial, string> = {
  startingPrice: "Starting price",
  minimumQuantity: "Minimum quantity",
  typicalTurnaround: "Typical turnaround",
  rushAvailability: "Rush",
  revisionsIncluded: "Revisions included",
  supportedFormats: "Supported formats",
  proofType: "Proof",
  shippingRequirement: "Shipping",
  exclusions: "Not included",
};

/** Per-service commercial facts. Copy a field from `empty` and set only approved values. */
export const serviceCommercial: Record<string, ServiceCommercial> = {
  "embroidery-digitizing": { ...empty },
  "vector-tracing": { ...empty },
  "custom-logo-design": { ...empty },
  "custom-patches": { ...empty },
  "embroidered-apparel": { ...empty },
  "screen-printing": { ...empty },
  "custom-hats": { ...empty },
};

export function commercialRows(serviceId: string): CommercialRow[] {
  const facts = serviceCommercial[serviceId];
  if (!facts) return [];
  return (Object.keys(labels) as Array<keyof ServiceCommercial>)
    .map((key) => {
      const value = facts[key]?.trim();
      return value ? { label: labels[key], value } : null;
    })
    .filter((row): row is CommercialRow => Boolean(row));
}

/**
 * Process statements that are always true of the studio workflow.
 * These are not prices or guarantees — they explain sequence, not speed.
 * Digital and physical jobs use different wording so file work is not described as manufacturing.
 */
export const fulfilmentCopy = {
  afterQuoteDigital: "Digitizing or artwork work begins after you confirm the written quote.",
  afterApprovalPhysical: "Production starts after you approve the proof and payment is received.",
  shippingSeparate: "Shipping time is quoted separately from production time.",
  deadlinesUnconfirmed: "Requested dates are noted but are not confirmed until they appear on your written quotation.",
  digitalDelivery: "Stitch previews and artwork proofs are part of the digital work. Final files are delivered by download after you approve them.",
  physicalDelivery: "Finished products are manufactured after proof approval, then shipped with tracking.",
} as const;
