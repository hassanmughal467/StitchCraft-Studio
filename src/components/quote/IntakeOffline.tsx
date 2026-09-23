import Link from "next/link";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { contactChannels } from "@/lib/site";

/**
 * Shown instead of the quote form while intake is offline (maintenance or no
 * durable store). It never promises an immediate reference and only shows
 * contact routes that are configured.
 */
export function IntakeOffline({ message, service }: { message: string; service?: string }) {
  return (
    <div className="bg-card p-6 sm:p-8" role="status">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper-dark">Quote requests paused</p>
      <h2 className="mt-3 text-2xl font-semibold">The online form is not taking requests right now</h2>
      <p className="mt-3 leading-7 text-ink-soft">{message}</p>
      {contactChannels.hasAny ? (
        <div className="mt-6 rounded-sm border border-line bg-warm p-5">
          <h3 className="text-base font-semibold">Reach the studio directly</h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            Tell us the service{service ? ` (${service})` : ""}, quantity or size, the date you need it and attach your artwork. We will reply with a reference and a quotation.
          </p>
          <div className="mt-4">
            <ContactChannels message={`Hello Brandstitch Works, I would like a quote${service ? ` for ${service}` : ""}.`} compact />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm leading-6 text-ink-soft">
          Please check back shortly. In the meantime, the{" "}
          <Link href="/how-it-works" className="font-semibold text-blue hover:underline">
            how ordering works
          </Link>{" "}
          page explains what we will need from you.
        </p>
      )}
    </div>
  );
}
