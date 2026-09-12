import { createHash, randomBytes } from "node:crypto";
import { emptyQuote, validateArtworkFile, validateQuote, type QuoteFieldErrors, type QuotePayload } from "@/lib/quote";
import { checkArtworkBytes } from "@/lib/server/file-check";
import { sendQuoteNotifications } from "@/lib/server/notify";
import { clientKey, createRateLimiter } from "@/lib/server/rate-limit";
import { resolveQuoteStore, type QuoteRecord, type QuoteStore } from "@/lib/server/quote-store";
import { fileUpload } from "@/lib/site";

const limiter = createRateLimiter({ limit: 6, windowMs: 10 * 60 * 1000 });

export function isQuoteIntakeAvailable(env: NodeJS.ProcessEnv = process.env) {
  const store = resolveQuoteStore(env);
  return { available: Boolean(store), store: store?.name ?? null };
}

export type IntakeResult =
  | { status: 201 | 200; body: { ok: true; reference: string; duplicate: boolean; notified: boolean; message: string } }
  | { status: 400 | 413 | 429 | 503 | 500; body: { ok: false; message: string; errors?: QuoteFieldErrors; retryAfterSeconds?: number } };

/** Builds a payload from multipart form data, ignoring unknown keys. */
export function payloadFromForm(form: FormData): QuotePayload {
  const payload = emptyQuote();
  (Object.keys(payload) as Array<keyof QuotePayload>).forEach((key) => {
    if (key === "fileName" || key === "fileType" || key === "fileSize") return;
    const raw = form.get(key);
    if (key === "rights" || key === "consent" || key === "marketing") {
      payload[key] = raw === "true" || raw === "on";
    } else if (typeof raw === "string") {
      payload[key] = raw.slice(0, 5000);
    }
  });
  return payload;
}

/** Reference format: SC-YYMMDD-XXXX (unambiguous base32 alphabet). */
export function generateReference(now = new Date()) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = randomBytes(4);
  let suffix = "";
  for (let i = 0; i < 4; i += 1) suffix += alphabet[bytes[i] % alphabet.length];
  return `SC-${date}-${suffix}`;
}

async function uniqueReference(store: QuoteStore) {
  for (let i = 0; i < 5; i += 1) {
    const ref = generateReference();
    if (!(await store.referenceExists(ref))) return ref;
  }
  throw new Error("Could not allocate a unique reference");
}

function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}:${process.env.QUOTE_IP_SALT ?? "stitchcraft"}`).digest("hex").slice(0, 24);
}

export async function processQuoteIntake(input: { form: FormData; headers: Headers; store?: QuoteStore | null; now?: Date }): Promise<IntakeResult> {
  const store = input.store === undefined ? resolveQuoteStore() : input.store;
  if (!store) {
    return { status: 503, body: { ok: false, message: "Quote requests are temporarily unavailable. Please try again later." } };
  }

  const key = clientKey(input.headers);
  const rate = limiter.check(key);
  if (!rate.allowed) {
    return { status: 429, body: { ok: false, message: "Too many requests from this connection. Please wait a few minutes and try again.", retryAfterSeconds: rate.retryAfterSeconds } };
  }

  const payload = payloadFromForm(input.form);
  const artworkEntry = input.form.get("artwork");
  const file = artworkEntry instanceof File && artworkEntry.size > 0 ? artworkEntry : null;

  const errors = validateQuote(payload);
  let bytes: Uint8Array | null = null;
  let detectedType = "";
  if (file) {
    const sizeError = validateArtworkFile({ name: file.name, size: file.size });
    if (sizeError) errors.artwork = sizeError;
    else {
      bytes = new Uint8Array(await file.arrayBuffer());
      const check = checkArtworkBytes(file.name, bytes);
      if (!check.ok) errors.artwork = check.reason;
      else detectedType = check.kind;
    }
    payload.fileName = file.name;
    payload.fileType = detectedType || file.type;
    payload.fileSize = file.size;
  }
  if (errors.form) {
    return { status: 400, body: { ok: false, message: errors.form, errors } };
  }
  if (Object.keys(errors).length) {
    return { status: 400, body: { ok: false, message: "Please correct the highlighted fields.", errors } };
  }

  // Idempotency: the same client submission id returns the original reference.
  const existing = await store.findBySubmissionId(payload.submissionId);
  if (existing) {
    return {
      status: 200,
      body: {
        ok: true,
        reference: existing.reference,
        duplicate: true,
        notified: existing.notification.customer.status === "sent",
        message: `This request was already received. Your reference is ${existing.reference}.`,
      },
    };
  }

  const reference = await uniqueReference(store);
  const now = input.now ?? new Date();
  const { website: _honeypot, ...safePayload } = payload;
  void _honeypot;
  const record: QuoteRecord = {
    reference,
    submissionId: payload.submissionId,
    receivedAt: now.toISOString(),
    status: "new",
    payload: safePayload,
    artwork:
      file && bytes
        ? {
            storedName: `artwork-${reference}.${file.name.split(".").pop()!.toLowerCase()}`,
            originalName: file.name.slice(0, 200),
            size: file.size,
            detectedType,
            sha256: createHash("sha256").update(bytes).digest("hex"),
          }
        : null,
    notification: { staff: { status: "not-configured" }, customer: { status: "not-configured" } },
    meta: { ipHash: hashIp(key), userAgent: (input.headers.get("user-agent") ?? "").slice(0, 200) },
  };

  try {
    await store.save(record, bytes ? { bytes } : null);
  } catch (error) {
    console.error("[quote] persistence failed", error);
    return { status: 500, body: { ok: false, message: "We could not save your request. Nothing was submitted; please try again." } };
  }

  // Notifications are handled after persistence; failure must not trigger a resubmit.
  const notification = await sendQuoteNotifications(record);
  try {
    await store.updateNotification(reference, notification);
  } catch (error) {
    console.error("[quote] could not record notification state", error);
  }
  const notified = notification.customer.status === "sent";

  return {
    status: 201,
    body: {
      ok: true,
      reference,
      duplicate: false,
      notified,
      message: notified
        ? `Your request is saved. Reference ${reference}. A confirmation email is on its way and we will reply with a quote.`
        : `Your request is saved. Reference ${reference}. Keep this reference; we will reply by your preferred contact method.`,
    },
  };
}

export const intakeLimits = { maxUploadBytes: fileUpload.maxSizeMb * 1024 * 1024 };
