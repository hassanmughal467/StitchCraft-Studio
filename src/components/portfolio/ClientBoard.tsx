import Link from "next/link";
import { StudioImage } from "@/components/media/StudioImage";
import { clientLogoSlots, clientSlots, type ClientSlot } from "@/lib/clients";
import { cn } from "@/lib/utils";

export function ClientSlotCard({ slot, className }: { slot: ClientSlot; className?: string }) {
  const name = slot.clientName.trim();

  return (
    <article className={cn("group h-full border border-line bg-card", className)}>
      {slot.image ? (
        <StudioImage
          src={slot.image.src}
          alt={slot.image.alt}
          credit={slot.image.credit}
          className="aspect-[4/3]"
          caption={name || slot.category}
        />
      ) : (
        <div
          className="relative flex aspect-[4/3] flex-col justify-between bg-warm p-5"
          data-placeholder="true"
          title="CLIENT_SLOT — add sew-out image and approved client name"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-copper">
              Slot {slot.slot}
            </p>
            <span className="border border-line px-2 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-stone">
              Awaiting sew-out
            </span>
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em]">{name || "Client work"}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {slot.industry} · {slot.placement}
            </p>
          </div>
          <span className="pointer-events-none absolute inset-3 border border-dashed border-copper/40" />
        </div>
      )}
      <div className="border-t border-line px-5 py-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-copper">{slot.category}</p>
        <p className="mt-1 text-sm text-ink-soft">{name || "Add approved client name"}</p>
      </div>
    </article>
  );
}

export function ClientLogoWall() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {clientLogoSlots.map((logo) => (
        <li
          key={logo.id}
          className="flex aspect-[5/3] items-center justify-center border border-dashed border-line bg-warm px-3 text-center"
          data-placeholder="true"
          title="CLIENT_LOGO_SLOT — replace with approved client mark"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-stone">{logo.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function ClientBoard({ limit }: { limit?: number }) {
  const slots = limit ? clientSlots.slice(0, limit) : clientSlots;
  return (
    <div>
      <ClientLogoWall />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {slots.map((slot) => (
          <li key={slot.id}>
            <ClientSlotCard slot={slot} />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-5 text-stone">
        Client names and logos are shown only with permission. Empty frames are labeled in code as{" "}
        <code>CLIENT_SLOT</code> / <code>CLIENT_LOGO_SLOT</code> so they can be replaced with real sew-outs.
      </p>
      {limit ? (
        <Link href="/portfolio#client-work" className="mt-4 inline-block text-sm font-semibold text-blue">
          Open the client gallery
        </Link>
      ) : null}
    </div>
  );
}
