import { absoluteUrl } from "@/lib/env";
import { summarizeQuote } from "@/lib/quote";
import { artworkLinksEnabled, linkTtlMs, signArtworkLink } from "@/lib/server/artwork-links";
import { resolveMailer, type MailConfig } from "@/lib/server/mailer";
import type { NotificationState, QuoteRecord } from "@/lib/server/quote-store";
import { getService } from "@/lib/services";
import { contactChannels, site, whatsappDisplay } from "@/lib/site";

export type NotifyOptions = {
  config?: MailConfig | null;
  responseStatement?: string | null;
  now?: Date;
  env?: NodeJS.ProcessEnv;
};

const defaultResponseWording = "We review every request personally and reply by your preferred contact method. If anything is missing we will ask before quoting.";

function serviceTitle(id: string) {
  return getService(id)?.title ?? id;
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function staffEmailText(record: QuoteRecord, options: NotifyOptions = {}) {
  const env = options.env ?? process.env;
  const p = record.payload;
  const now = options.now ?? new Date();
  const expiresAt = now.getTime() + linkTtlMs(env);
  const lines: Array<string | null> = [];

  lines.push(`New quote request ${record.reference}`);
  if (p.previousReference) {
    lines.push("");
    lines.push("=== REPEAT ORDER ===");
    lines.push(`Previous quote/order reference: ${p.previousReference}`);
    lines.push("Check the approved file and specification before quoting.");
    lines.push("====================");
  }
  lines.push("");
  lines.push(`Service: ${serviceTitle(p.service)}`);
  lines.push(`Received: ${record.receivedAt}`);
  lines.push(`Customer type: ${p.customerType}`);
  lines.push("");
  lines.push("Contact");
  lines.push(`  Name: ${p.name}`);
  if (p.company) lines.push(`  Business: ${p.company}`);
  lines.push(`  Email: ${p.email}`);
  if (p.phone) lines.push(`  Phone / WhatsApp: ${p.phone}`);
  lines.push(`  Country: ${record.countryLabel}`);
  lines.push(`  Reply by: ${p.contactMethod}`);
  lines.push("");
  lines.push("Specification");
  for (const [label, value] of summarizeQuote(p, record.countryLabel)) {
    if (label === "Customer type" || label === "Previous reference") continue;
    lines.push(`  ${label}: ${value}`);
  }
  lines.push("");
  lines.push("Project description");
  lines.push(p.details);
  lines.push("");
  if (record.artwork.length) {
    lines.push(`Artwork (${record.artwork.length} file${record.artwork.length === 1 ? "" : "s"})`);
    for (const file of record.artwork) {
      const link = signArtworkLink({ reference: record.reference, storedName: file.storedName, expiresAt }, absoluteUrl("/"), env);
      lines.push(`  ${file.originalName} (${formatSize(file.size)}, ${file.detectedType})`);
      lines.push(`    ${link ?? `stored as ${file.storedName}`}`);
    }
    lines.push(artworkLinksEnabled(env) ? `  Links expire ${new Date(expiresAt).toISOString()}.` : "  Open files from the quote store (no link secret configured).");
  } else {
    lines.push("Artwork: none attached");
  }
  lines.push("");
  lines.push(`Marketing opt-in: ${p.marketing ? "yes" : "no"}`);
  lines.push(`Source page: ${p.sourcePath || "-"}`);
  lines.push(`Referrer: ${p.referrer || "-"}`);
  return lines.filter((l) => l !== null).join("\n");
}

export function customerEmailText(record: QuoteRecord, options: NotifyOptions = {}) {
  const p = record.payload;
  const wording = options.responseStatement?.trim() || defaultResponseWording;
  const lines: string[] = [
    `Hello ${p.name},`,
    "",
    `Thank you for your quote request. Your reference is ${record.reference}. Please keep it for any follow-up.`,
    "",
    `Service: ${serviceTitle(p.service)}`,
    "",
    "What you told us",
  ];
  for (const [label, value] of summarizeQuote(p, record.countryLabel)) lines.push(`  ${label}: ${value}`);
  lines.push(`  Description: ${p.details.length > 400 ? `${p.details.slice(0, 400)}…` : p.details}`);
  if (record.artwork.length) lines.push(`  Files received: ${record.artwork.map((a) => a.originalName).join(", ")}`);
  lines.push("");
  lines.push("What happens next");
  lines.push(wording);
  if (p.deadlineMode !== "flexible" && p.deadlineDate) {
    lines.push("Requested dates are noted but are not confirmed until they appear on your written quotation.");
  }
  lines.push("");
  const fallback: string[] = [];
  if (contactChannels.email) fallback.push(`email ${contactChannels.email}`);
  if (contactChannels.whatsapp) fallback.push(`WhatsApp ${whatsappDisplay()}`);
  if (contactChannels.phone) fallback.push(`phone ${contactChannels.phone.display}`);
  if (fallback.length) {
    lines.push(`Need to add something? Reply to this email quoting ${record.reference}, or contact us by ${fallback.join(", ")}.`);
    lines.push("");
  }
  lines.push(site.name);
  return lines.join("\n");
}

export async function sendQuoteNotifications(record: QuoteRecord, options: NotifyOptions = {}): Promise<QuoteRecord["notification"]> {
  const config = options.config === undefined ? resolveMailer(options.env) : options.config;
  if (!config) {
    return { staff: { status: "not-configured" }, customer: { status: "not-configured" } };
  }
  const attemptedAt = (options.now ?? new Date()).toISOString();
  const run = async (fn: () => Promise<void>): Promise<NotificationState> => {
    try {
      await fn();
      return { status: config.mailer.resultStatus, provider: config.mailer.name, attemptedAt };
    } catch (error) {
      return { status: "failed", provider: config.mailer.name, attemptedAt, error: error instanceof Error ? error.message.slice(0, 200) : "unknown" };
    }
  };
  const subjectService = serviceTitle(record.payload.service);
  const repeat = record.payload.previousReference ? " [REPEAT ORDER]" : "";
  const staff = await run(() =>
    config.mailer.send({ to: config.inbox, subject: `Quote request ${record.reference}: ${subjectService}${repeat}`, text: staffEmailText(record, options), replyTo: record.payload.email }),
  );
  const customer = await run(() => config.mailer.send({ to: record.payload.email, subject: `We received your quote request (${record.reference})`, text: customerEmailText(record, options) }));
  return { staff, customer };
}
