import { resolveQuoteStore } from "@/lib/server/quote-store";

/**
 * Server-side switch for the public quote intake.
 *
 *   QUOTE_INTAKE_MODE=online   (default) intake is available when a durable store is configured
 *   QUOTE_INTAKE_MODE=offline  deliberate maintenance mode: the form is replaced by a notice
 *
 * When the store is missing or misconfigured the intake is also offline; the
 * reason is exposed to server code only. Public copy never mentions the cause.
 */
export type IntakeStatus = {
  online: boolean;
  /** Why intake is offline; null when online. */
  reason: "maintenance" | "no-store" | null;
  /** Public notice shown instead of the form when offline. */
  offlineMessage: string;
  /** Statement about response timing; configured by the owner, never invented. */
  responseStatement: string | null;
  /** How the browser should send files: multipart to our API, or directly to storage. */
  uploadMode: "inline" | "direct";
  storeName: string | null;
  spamCheck: "honeypot" | "turnstile";
};

const defaultOfflineMessage = "Online quote requests are paused for the moment. You can still reach the studio using the contact details below and we will pick the request up from there.";

export function getIntakeStatus(env: NodeJS.ProcessEnv = process.env): IntakeStatus {
  const mode = env.QUOTE_INTAKE_MODE?.trim().toLowerCase();
  const resolution = resolveQuoteStore(env);
  const responseStatement = env.QUOTE_RESPONSE_STATEMENT?.trim() || env.NEXT_PUBLIC_RESPONSE_STATEMENT?.trim() || null;
  const offlineMessage = env.QUOTE_OFFLINE_MESSAGE?.trim() || defaultOfflineMessage;
  const spamCheck = env.TURNSTILE_SECRET_KEY?.trim() && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ? "turnstile" : "honeypot";

  if (mode === "offline") {
    return { online: false, reason: "maintenance", offlineMessage, responseStatement, uploadMode: "inline", storeName: null, spamCheck };
  }
  if (!resolution.store) {
    return { online: false, reason: "no-store", offlineMessage, responseStatement, uploadMode: "inline", storeName: null, spamCheck };
  }
  return {
    online: true,
    reason: null,
    offlineMessage,
    responseStatement,
    uploadMode: resolution.store.direct ? "direct" : "inline",
    storeName: resolution.store.name,
    spamCheck,
  };
}

/** Subset of the status that is safe to send to the browser. */
export function publicIntakeConfig(status = getIntakeStatus()) {
  return {
    online: status.online,
    offlineMessage: status.offlineMessage,
    responseStatement: status.responseStatement,
    uploadMode: status.uploadMode,
    spamCheck: status.spamCheck,
  };
}

export type PublicIntakeConfig = ReturnType<typeof publicIntakeConfig>;
