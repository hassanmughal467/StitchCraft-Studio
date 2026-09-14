import { createHash, randomBytes } from "node:crypto";
import { fileLimits, extensionOf } from "@/lib/config/limits";
import { countryName } from "@/lib/countries";
import { booleanFields, emptyQuote, validateArtworkFiles, validateQuote, type QuoteFieldErrors, type QuotePayload } from "@/lib/quote";
import { checkArtworkBytes } from "@/lib/server/file-check";
import { getIntakeStatus } from "@/lib/server/intake-config";
import { log } from "@/lib/server/log";
import { sendQuoteNotifications, type NotifyOptions } from "@/lib/server/notify";
import { clientKey, createRateLimiter } from "@/lib/server/rate-limit";
import { DuplicateSubmissionError, resolveQuoteStore, type IncomingFile, type QuoteRecord, type QuoteStore, type StoredArtwork } from "@/lib/server/quote-store";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const intakeLimits = {
  maxUploadBytes: fileLimits.maxSizeBytes,
  maxRequestBytes: fileLimits.maxTotalBytes + 256 * 1024,
  rate: { limit: 6, windowMs: 10 * 60 * 1000 },
} as const;

const limiter = createRateLimiter(intakeLimits.rate);

export type IntakeSuccess = { ok: true; reference: string; duplicate: boolean; notified: boolean; message: string };
export type IntakeFailure = { ok: false; message: string; errors?: QuoteFieldErrors; retryAfterSeconds?: number; retryable?: boolean };
export type IntakeResult = { status: 201 | 200; body: IntakeSuccess } | { status: 400 | 413 | 429 | 503 | 500; body: IntakeFailure };

/** Builds a payload from multipart form data, ignoring unknown keys and files. */
export function payloadFromForm(form: FormData): QuotePayload {
  const payload = emptyQuote();
  (Object.keys(payload) as Array<keyof QuotePayload>).forEach((key) => {
    const raw = form.get(key);
    if (booleanFields.includes(key)) {
      (payload as Record<string, unknown>)[key] = raw === "true" || raw === "on";
    } else if (typeof raw === "string") {
      (payload as Record<string, unknown>)[key] = raw.slice(0, 8000);
    }
  });
  return payload;
}

/** Reference format: SC-YYMMDD-XXXX (unambiguous base32 alphabet, no 0/O/1/I/L). */
export function generateReference(now = new Date(), random: (n: number) => Uint8Array = (n) => randomBytes(n)) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = random(4);
  let suffix = "";
  for (let i = 0; i < 4; i += 1) suffix += alphabet[bytes[i] % alphabet.length];
  return `SC-${date}-${suffix}`;
}

async function uniqueReference(store: QuoteStore, now: Date) {
  for (let i = 0; i < 6; i += 1) {
    const ref = generateReference(now);
    if (!(await store.referenceExists(ref))) return ref;
  }
  throw new Error("Could not allocate a unique reference");
}

function hashIp(ip: string, env: NodeJS.ProcessEnv) {
  return createHash("sha256").update(`${ip}:${env.QUOTE_IP_SALT ?? "stitchcraft"}`).digest("hex").slice(0, 24);
}

/** Server-generated filename: index + reference + verified extension. The customer's name is metadata only. */
export function storedFileName(reference: string, index: number, originalName: string) {
  return `artwork-${index + 1}-${reference.toLowerCase()}${extensionOf(originalName)}`;
}

type Verified = { artwork: Omit<StoredArtwork, "storedName" | "location">; file: { bytes: Uint8Array; contentType: string; location?: string }; originalName: string };

/** Direct-upload descriptor sent by the browser after uploading straight to storage. */
type DirectUpload = { location: string; originalName: string };

function parseDirectUploads(raw: string | null): DirectUpload[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, fileLimits.maxFiles + 1).map((u) => ({ location: String(u?.location ?? ""), originalName: String(u?.originalName ?? "").slice(0, 200) }));
  } catch {
    return [];
  }
}

export type IntakeInput = {
  form: FormData;
  headers: Headers;
  /** Injected for tests; resolved from the environment otherwise. */
  store?: QuoteStore | null;
  now?: Date;
  env?: NodeJS.ProcessEnv;
  notify?: NotifyOptions;
};

export async function processQuoteIntake(input: IntakeInput): Promise<IntakeResult> {
  const env = input.env ?? process.env;
  const now = input.now ?? new Date();
  const status = getIntakeStatus(env);
  const store = input.store === undefined ? resolveQuoteStore(env).store : input.store;

  if (env.QUOTE_INTAKE_MODE?.trim().toLowerCase() === "offline" || !store) {
    log.warn("quote.intake.offline", { reason: status.reason });
    return { status: 503, body: { ok: false, message: status.offlineMessage, retryable: false } };
  }

  const key = clientKey(input.headers);
  const rate = limiter.check(key, now.getTime());
  if (!rate.allowed) {
    log.warn("quote.intake.rate_limited", { ipHash: hashIp(key, env) });
    return { status: 429, body: { ok: false, message: "Too many requests from this connection. Please wait a few minutes and try again; your details stay in the form.", retryAfterSeconds: rate.retryAfterSeconds, retryable: true } };
  }

  const payload = payloadFromForm(input.form);
  if (!(await verifyTurnstile(payload.turnstileToken, key, env))) {
    return { status: 400, body: { ok: false, message: "The spam check did not pass. Please try again.", errors: { form: "Spam check failed." } } };
  }

  // Files: inline multipart parts, or descriptors of direct uploads to verify.
  const inlineFiles = input.form.getAll("artwork").filter((f): f is File => f instanceof File && f.size > 0);
  const directUploads = store.direct ? parseDirectUploads(typeof input.form.get("uploads") === "string" ? (input.form.get("uploads") as string) : null) : [];
  const fileCount = inlineFiles.length + directUploads.length;

  const errors = validateQuote(payload, { fileCount, now });
  const screening = validateArtworkFiles([...inlineFiles.map((f) => ({ name: f.name, size: f.size })), ...directUploads.map((u) => ({ name: u.originalName, size: 1 }))]);
  if (screening) errors.artwork = screening;
  if (errors.form) {
    return { status: 400, body: { ok: false, message: errors.form, errors } };
  }
  if (Object.keys(errors).length) {
    return { status: 400, body: { ok: false, message: "Please correct the highlighted fields.", errors } };
  }

  // Idempotency: the same client submission id returns the original reference and saves nothing new.
  const existing = await store.findBySubmissionId(payload.submissionId);
  if (existing) return duplicateResult(existing);

  // Concurrent requests for the same submission id (a double click that beat the
  // client guard) share one persistence pass within this process.
  const pending = inFlight.get(payload.submissionId);
  if (pending) {
    const first = await pending;
    return first.body.ok ? { status: 200, body: { ...first.body, duplicate: true, message: `This request was already received. Your reference is ${first.body.reference}.` } } : first;
  }
  const work = persistAndNotify({ input, env, now, status, store, key, payload, inlineFiles, directUploads });
  inFlight.set(payload.submissionId, work);
  try {
    return await work;
  } finally {
    inFlight.delete(payload.submissionId);
  }
}

const inFlight = new Map<string, Promise<IntakeResult>>();

function duplicateResult(existing: QuoteRecord): IntakeResult {
  log.info("quote.intake.duplicate", { reference: existing.reference });
  return {
    status: 200,
    body: { ok: true, reference: existing.reference, duplicate: true, notified: existing.notification.customer.status === "sent", message: `This request was already received. Your reference is ${existing.reference}.` },
  };
}

async function persistAndNotify({
  input,
  env,
  now,
  status,
  store,
  key,
  payload,
  inlineFiles,
  directUploads,
}: {
  input: IntakeInput;
  env: NodeJS.ProcessEnv;
  now: Date;
  status: ReturnType<typeof getIntakeStatus>;
  store: QuoteStore;
  key: string;
  payload: QuotePayload;
  inlineFiles: File[];
  directUploads: DirectUpload[];
}): Promise<IntakeResult> {

  // Verify file content. Extensions and MIME types are not trusted.
  const verified: Verified[] = [];
  let totalBytes = 0;
  for (const file of inlineFiles) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const check = checkArtworkBytes(file.name, bytes);
    if (!check.ok) return { status: 400, body: { ok: false, message: "Please correct the highlighted fields.", errors: { artwork: `“${file.name.slice(0, 60)}”: ${check.reason}` } } };
    totalBytes += bytes.byteLength;
    verified.push({ originalName: file.name.slice(0, 200), file: { bytes, contentType: check.kind }, artwork: { originalName: file.name.slice(0, 200), size: bytes.byteLength, detectedType: check.kind, sha256: createHash("sha256").update(bytes).digest("hex") } });
  }
  if (store.direct) {
    const prefix = store.direct.prefixFor(payload.submissionId);
    for (const upload of directUploads) {
      if (!upload.location.startsWith(prefix) || upload.location.includes("..")) {
        return { status: 400, body: { ok: false, message: "Please correct the highlighted fields.", errors: { artwork: "One of the uploaded files could not be matched to this request. Remove it and upload again." } } };
      }
      const pending = await store.direct.read(upload.location);
      if (!pending) return { status: 400, body: { ok: false, message: "Please correct the highlighted fields.", errors: { artwork: `“${upload.originalName.slice(0, 60)}” did not finish uploading. Remove it and try again.` } } };
      if (pending.size === 0 || pending.size > fileLimits.maxSizeBytes) {
        await store.direct.discard(upload.location);
        return { status: 400, body: { ok: false, message: "Please correct the highlighted fields.", errors: { artwork: `“${upload.originalName.slice(0, 60)}” is empty or larger than ${fileLimits.maxSizeMb} MB.` } } };
      }
      const check = checkArtworkBytes(upload.originalName, pending.bytes);
      if (!check.ok) {
        await store.direct.discard(upload.location);
        return { status: 400, body: { ok: false, message: "Please correct the highlighted fields.", errors: { artwork: `“${upload.originalName.slice(0, 60)}”: ${check.reason}` } } };
      }
      totalBytes += pending.size;
      verified.push({ originalName: upload.originalName, file: { bytes: pending.bytes, contentType: check.kind, location: upload.location }, artwork: { originalName: upload.originalName, size: pending.size, detectedType: check.kind, sha256: createHash("sha256").update(pending.bytes).digest("hex") } });
    }
  }
  if (totalBytes > fileLimits.maxTotalBytes) {
    return { status: 413, body: { ok: false, message: "The files together are too large. Remove one and try again.", errors: { artwork: `Keep the total under ${Math.round(fileLimits.maxTotalBytes / 1024 / 1024)} MB.` } } };
  }

  let reference: string;
  try {
    reference = await uniqueReference(store, now);
  } catch (error) {
    log.error("quote.intake.reference_failed", error);
    return { status: 500, body: { ok: false, message: "We could not save your request. Nothing was submitted; please try again in a moment.", retryable: true } };
  }

  const { website: _honeypot, turnstileToken: _token, ...safePayload } = payload;
  void _honeypot;
  void _token;
  const files: IncomingFile[] = [];
  const artwork: StoredArtwork[] = verified.map((v, index) => {
    const storedName = storedFileName(reference, index, v.originalName);
    if (v.file.location) files.push({ storedName, contentType: v.file.contentType, location: v.file.location });
    else files.push({ storedName, contentType: v.file.contentType, bytes: v.file.bytes });
    return { ...v.artwork, storedName, location: v.file.location ?? storedName };
  });

  const record: QuoteRecord = {
    reference,
    submissionId: payload.submissionId,
    receivedAt: now.toISOString(),
    status: "new",
    payload: safePayload,
    countryLabel: countryName(payload.countryCode, payload.countryName),
    artwork,
    notification: { staff: { status: "not-configured" }, customer: { status: "not-configured" } },
    meta: { ipHash: hashIp(key, env), userAgent: (input.headers.get("user-agent") ?? "").slice(0, 200), uploadMode: directUploads.length ? "direct" : "inline" },
  };

  try {
    await store.save(record, files);
  } catch (error) {
    if (error instanceof DuplicateSubmissionError) {
      // Another process saved this submission first; hand back its reference.
      const winner = await store.findBySubmissionId(payload.submissionId);
      if (winner) return duplicateResult(winner);
    }
    log.error("quote.intake.persist_failed", error, { store: store.name });
    return { status: 500, body: { ok: false, message: "We could not save your request. Nothing was submitted; please try again in a moment.", retryable: true } };
  }
  log.info("quote.intake.saved", { reference, service: payload.service, files: artwork.length, store: store.name });

  // Notifications run after persistence; a failure here must never ask the customer to resubmit.
  const notification = await sendQuoteNotifications(record, { responseStatement: status.responseStatement, now, env, ...input.notify });
  if (notification.staff.status === "failed" || notification.customer.status === "failed") {
    log.error("quote.intake.notify_failed", undefined, { reference, staff: notification.staff.status, customer: notification.customer.status, provider: notification.staff.provider ?? null });
  }
  try {
    await store.updateNotification(reference, notification);
  } catch (error) {
    log.error("quote.intake.notification_state_failed", error, { reference });
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
        ? `Your request is saved under reference ${reference}. A confirmation email is on its way.`
        : `Your request is saved under reference ${reference}. Keep this reference; we will reply by your preferred contact method.`,
    },
  };
}
