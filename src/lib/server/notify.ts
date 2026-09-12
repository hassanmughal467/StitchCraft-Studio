import type { NotificationState, QuoteRecord } from "@/lib/server/quote-store";
import { site } from "@/lib/site";

/**
 * Transactional email through Resend. Only active when RESEND_API_KEY,
 * RESEND_FROM_EMAIL and QUOTE_INBOX_EMAIL are configured. Artwork is never
 * attached to email; staff open it from the private store.
 */
export type Mailer = (message: { to: string; subject: string; text: string; replyTo?: string }) => Promise<void>;

export function resendMailer(env: NodeJS.ProcessEnv = process.env): { mailer: Mailer; from: string; inbox: string } | null {
  const key = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim();
  const inbox = env.QUOTE_INBOX_EMAIL?.trim();
  if (!key || !from || !inbox) return null;
  const mailer: Mailer = async (message) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, ...(message.replyTo ? { reply_to: message.replyTo } : {}) }),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}`);
  };
  return { mailer, from, inbox };
}

export function staffEmailText(record: QuoteRecord) {
  const p = record.payload;
  const lines = [
    `New quote request ${record.reference}`,
    `Received: ${record.receivedAt}`,
    "",
    `Service: ${p.service}`,
    `Customer type: ${p.customerType}`,
    `Name: ${p.name}`,
    p.company ? `Business: ${p.company}` : null,
    `Email: ${p.email}`,
    p.phone ? `Phone: ${p.phone}` : null,
    `Country: ${p.country}`,
    `Preferred contact: ${p.contactMethod}`,
    `Deadline: ${p.deadline}`,
    p.budget ? `Budget: ${p.budget}` : null,
    "",
    "Specification:",
    ...specLines(p),
    "",
    "Details:",
    p.details,
    "",
    record.artwork ? `Artwork: ${record.artwork.originalName} (${record.artwork.size} bytes, ${record.artwork.detectedType}) stored as ${record.artwork.storedName}` : "Artwork: none attached",
    `Source page: ${p.sourcePath || "-"}`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function customerEmailText(record: QuoteRecord) {
  const p = record.payload;
  return [
    `Hello ${p.name},`,
    "",
    `Thanks for your quote request. Your reference is ${record.reference}.`,
    "",
    "What happens next: we review the details, ask for anything missing, and reply with an itemized quote and timing by your preferred contact method.",
    "",
    `Service: ${p.service}`,
    `Deadline: ${p.deadline}`,
    "",
    "Keep this reference for any follow-up.",
    "",
    site.name,
  ].join("\n");
}

function specLines(p: QuoteRecord["payload"]) {
  const out: string[] = [];
  const add = (label: string, value?: string) => value && out.push(`${label}: ${value}`);
  add("Product/type", p.productType);
  add("Quantity", p.quantity);
  add("Sizes", p.sizes);
  add("Width x height", p.width && p.height ? `${p.width} x ${p.height} ${p.unit}` : "");
  add("Format needed", p.formatNeeded);
  add("Placement / material", p.placement);
  add("Decoration size", p.decorationSize);
  add("Options", p.materials);
  add("Colors", p.colors);
  add("Rush", p.rush !== "No" ? p.rush : "");
  add("Wording", p.wording);
  add("Audience", p.audience);
  add("Style references", p.styleReferences);
  add("Required uses", p.requiredUses);
  add("Intended use", p.intendedUse);
  add("Destination", p.destination ? `${p.destination} ${p.postalCode}`.trim() : "");
  return out.length ? out : ["-"];
}

export async function sendQuoteNotifications(record: QuoteRecord, config = resendMailer()): Promise<QuoteRecord["notification"]> {
  if (!config) {
    return { staff: { status: "not-configured" }, customer: { status: "not-configured" } };
  }
  const attemptedAt = new Date().toISOString();
  const run = async (fn: () => Promise<void>): Promise<NotificationState> => {
    try {
      await fn();
      return { status: "sent", provider: "resend", attemptedAt };
    } catch (error) {
      return { status: "failed", provider: "resend", attemptedAt, error: error instanceof Error ? error.message : "unknown" };
    }
  };
  const staff = await run(() =>
    config.mailer({ to: config.inbox, subject: `Quote request ${record.reference}: ${record.payload.service}`, text: staffEmailText(record), replyTo: record.payload.email }),
  );
  const customer = await run(() => config.mailer({ to: record.payload.email, subject: `We received your quote request (${record.reference})`, text: customerEmailText(record) }));
  return { staff, customer };
}
