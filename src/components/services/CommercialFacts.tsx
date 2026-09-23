import { commercialRows, fulfilmentCopy } from "@/lib/config/business";

export function CommercialFacts({ serviceId, kind }: { serviceId: string; kind: "digital" | "physical" }) {
  const rows = commercialRows(serviceId);
  if (!rows.length) return null;
  return (
    <div className="rounded-sm border border-line p-6">
      <h3 className="text-lg font-semibold">At a glance</h3>
      <dl className="mt-4 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-5 sm:gap-4">
            <dt className="text-sm font-medium text-charcoal sm:col-span-2">{row.label}</dt>
            <dd className="text-sm leading-6 text-ink-soft sm:col-span-3">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-5 text-stone">{kind === "digital" ? fulfilmentCopy.digitalDelivery : fulfilmentCopy.physicalDelivery}</p>
    </div>
  );
}

export function FulfilmentNotes({ kind }: { kind: "digital" | "physical" }) {
  return (
    <div className="rounded-sm border border-line p-6">
      <h3 className="text-lg font-semibold">How fulfillment works</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-soft">
        {kind === "digital" ? (
          <>
            <li>{fulfilmentCopy.afterQuoteDigital}</li>
            <li>{fulfilmentCopy.digitalDelivery}</li>
          </>
        ) : (
          <>
            <li>{fulfilmentCopy.afterApprovalPhysical}</li>
            <li>{fulfilmentCopy.shippingSeparate}</li>
            <li>{fulfilmentCopy.physicalDelivery}</li>
          </>
        )}
        <li>{fulfilmentCopy.deadlinesUnconfirmed}</li>
      </ul>
    </div>
  );
}
