import path from "node:path";
import type { QuotePayload } from "@/lib/quote";
import { FileQuoteStore } from "@/lib/server/stores/file";
import { MemoryQuoteStore } from "@/lib/server/stores/memory";
import { VercelBlobQuoteStore, vercelBlobClient } from "@/lib/server/stores/vercel-blob";

export type StoredArtwork = {
  /** Server-generated filename used in links and emails. */
  storedName: string;
  /** Customer's filename, kept as metadata only (never used as a path). */
  originalName: string;
  size: number;
  detectedType: string;
  sha256: string;
  /** Store-specific location (path or object key). */
  location: string;
};

export type NotificationState = {
  status: "sent" | "logged" | "failed" | "not-configured";
  provider?: string;
  error?: string;
  attemptedAt?: string;
};

export type QuoteRecord = {
  reference: string;
  submissionId: string;
  receivedAt: string;
  status: "new";
  payload: Omit<QuotePayload, "website" | "turnstileToken">;
  /** Resolved country label for display. */
  countryLabel: string;
  artwork: StoredArtwork[];
  notification: { staff: NotificationState; customer: NotificationState };
  meta: { ipHash: string; userAgent: string; uploadMode: "inline" | "direct" };
};

/** A file to persist alongside the record. Either raw bytes or an already-uploaded object. */
export type IncomingFile = { storedName: string; contentType: string } & ({ bytes: Uint8Array } | { location: string });

export type ArtworkStream = { stream: ReadableStream<Uint8Array>; size: number; contentType: string };

export interface DirectUploadSupport {
  /** Object-key prefix under which a client may upload for a given submission id. */
  prefixFor(submissionId: string): string;
  /** Reads a pending upload for verification. Returns null when missing. */
  read(location: string): Promise<{ bytes: Uint8Array; size: number } | null>;
  /** Removes a pending upload that failed verification. */
  discard(location: string): Promise<void>;
}

/** Thrown by `save` when another request already claimed the same submission id. */
export class DuplicateSubmissionError extends Error {
  constructor(public readonly submissionId: string) {
    super(`Submission ${submissionId} already saved`);
    this.name = "DuplicateSubmissionError";
  }
}

export interface QuoteStore {
  readonly name: string;
  /** Direct-to-storage client uploads (needed on hosts with small request-body limits). */
  readonly direct: DirectUploadSupport | null;
  findBySubmissionId(submissionId: string): Promise<QuoteRecord | null>;
  referenceExists(reference: string): Promise<boolean>;
  /**
   * Persist files then the record. A resolved promise means the record is durably saved.
   * Throws `DuplicateSubmissionError` when the submission id was already claimed.
   */
  save(record: QuoteRecord, files: IncomingFile[]): Promise<void>;
  updateNotification(reference: string, notification: QuoteRecord["notification"]): Promise<void>;
  /** Streams a stored artwork file for an authenticated staff link. */
  openArtwork(reference: string, storedName: string): Promise<ArtworkStream | null>;
}

export type StoreResolution = { store: QuoteStore; reason: null } | { store: null; reason: "unset" | "unknown" | "file-on-serverless" | "memory-in-production" | "blob-missing-token" };

/**
 * Resolves the configured store. Returns no store (and a reason) when nothing
 * durable is configured, which keeps the public form in offline mode rather
 * than pretending a submission succeeded.
 */
export function resolveQuoteStore(env: NodeJS.ProcessEnv = process.env): StoreResolution {
  const kind = env.QUOTE_STORE?.trim();
  if (!kind) return { store: null, reason: "unset" };
  if (kind === "file") {
    if (env.VERCEL && !env.QUOTE_STORE_DIR?.trim()) return { store: null, reason: "file-on-serverless" };
    const root = env.QUOTE_STORE_DIR?.trim() || path.join(process.cwd(), ".data", "quotes");
    return { store: new FileQuoteStore(root), reason: null };
  }
  if (kind === "memory") {
    if (env.NODE_ENV === "production" && env.QUOTE_STORE_ALLOW_VOLATILE !== "true") return { store: null, reason: "memory-in-production" };
    return { store: memorySingleton(), reason: null };
  }
  if (kind === "vercel-blob") {
    if (!env.BLOB_READ_WRITE_TOKEN?.trim()) return { store: null, reason: "blob-missing-token" };
    return { store: new VercelBlobQuoteStore(vercelBlobClient(env.BLOB_READ_WRITE_TOKEN.trim()), env.QUOTE_STORE_PREFIX?.trim() || "stitchcraft"), reason: null };
  }
  return { store: null, reason: "unknown" };
}

let memory: MemoryQuoteStore | null = null;
function memorySingleton() {
  return (memory ||= new MemoryQuoteStore());
}

export { FileQuoteStore, MemoryQuoteStore, VercelBlobQuoteStore };
