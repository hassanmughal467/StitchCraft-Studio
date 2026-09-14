import { ContactLink } from "@/components/contact/ContactLink";
import { contactChannels, mailtoHref, site, telHref, whatsappDisplay, whatsappHref } from "@/lib/site";

/**
 * Verified business contact channels. Every row renders only when the owner has
 * configured a real value (see src/lib/site.ts). Used on Contact, in the quote
 * offline notice and in the footer so the fallback route is identical everywhere.
 */
export function ContactChannels({ message, compact, invert }: { message?: string; compact?: boolean; invert?: boolean }) {
  const email = mailtoHref();
  const tel = telHref();
  const wa = whatsappHref(message);
  const waDisplay = whatsappDisplay();
  const addressParts = [site.address.line1, site.address.city].filter(Boolean);
  const labelClass = invert ? "text-card/55" : "text-stone";
  const linkClass = invert ? "font-medium text-card hover:underline" : "font-medium text-blue hover:underline";
  const bodyClass = invert ? "text-card/75" : "text-ink-soft";
  const hasLocation = addressParts.length > 0;

  if (!contactChannels.hasAny && !site.hours && !site.responseStatement && !hasLocation) {
    return null;
  }

  return (
    <dl className={compact ? "space-y-2 text-sm leading-6" : "space-y-4 text-sm leading-6"}>
      {email && site.email ? (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${labelClass}`}>Email</dt>
          <dd>
            <ContactLink href={email} method="email" className={`${linkClass} break-all`}>
              {site.email}
            </ContactLink>
          </dd>
        </div>
      ) : null}
      {wa && waDisplay ? (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${labelClass}`}>WhatsApp</dt>
          <dd>
            <ContactLink href={wa} method="whatsapp" external className={linkClass} aria-label={`Message ${site.name} on WhatsApp, ${waDisplay}`}>
              {waDisplay}
            </ContactLink>
          </dd>
        </div>
      ) : null}
      {tel && site.phone ? (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${labelClass}`}>Telephone</dt>
          <dd>
            <ContactLink href={tel} method="phone" className={linkClass} aria-label={`Call ${site.name} on ${site.phone.display}`}>
              {site.phone.display}
            </ContactLink>
          </dd>
        </div>
      ) : null}
      {site.responseStatement ? (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${labelClass}`}>Response time</dt>
          <dd className={bodyClass}>{site.responseStatement}</dd>
        </div>
      ) : null}
      {site.hours ? (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${labelClass}`}>Customer service</dt>
          <dd className={bodyClass}>{site.hours}</dd>
        </div>
      ) : null}
      {!compact && hasLocation ? (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${labelClass}`}>Location</dt>
          <dd className={bodyClass}>{addressParts.join(", ")}</dd>
        </div>
      ) : null}
    </dl>
  );
}
