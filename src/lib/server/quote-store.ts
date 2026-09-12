import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { QuotePayload } from "@/lib/quote";

export type StoredArtwork = {
  /** Server-generated filename; the original name is kept only as metadata. */
  storedName: string;
  originalName: string;
  size: number;
  detectedType: string;
  sha256: string;
};

export type NotificationState = {
  status: "sent" | "failed" | "not-configured";
  provider?: string;
  error?: string;
  attemptedAt?: string;
};

export type QuoteRecord = {
  reference: string;
  submissionId: string;
  receivedAt: string;
  status: "new";
  payload: Omit<QuotePayload, "website">;
  artwork: StoredArtwork | null;
  notification: { staff: NotificationState; customer: NotificationState };
  meta: { ipHash: string; userAgent: string };
};

export interface QuoteStore {
  readonly name: string;
  findBySubmissionId(submissionId: string): Promise<QuoteRecord | null>;
  referenceExists(reference: string): Promise<boolean>;
  /** Persist the record and artwork atomically enough that a success response implies a saved record. */
  save(record: QuoteRecord, artwork: { bytes: Uint8Array } | null): Promise<void>;
  updateNotification(reference: string, notification: QuoteRecord["notification"]): Promise<void>;
}

/**
 * Local filesystem store for development and single-server deployments.
 * Layout: <root>/<reference>/record.json and <root>/<reference>/<storedName>.
 * The root lives outside /public and is gitignored.
 */
export class FileQuoteStore implements QuoteStore {
  readonly name = "file";
  constructor(private readonly root: string) {}

  private dir(reference: string) {
    if (!/^[A-Z0-9-]+$/.test(reference)) throw new Error("Invalid reference");
    return path.join(this.root, reference);
  }

  async findBySubmissionId(submissionId: string) {
    let entries: string[] = [];
    try {
      entries = await readdir(this.root);
    } catch {
      return null;
    }
    for (const entry of entries) {
      try {
        const raw = await readFile(path.join(this.root, entry, "record.json"), "utf8");
        const record = JSON.parse(raw) as QuoteRecord;
        if (record.submissionId === submissionId) return record;
      } catch {
        // skip unreadable entries
      }
    }
    return null;
  }

  async referenceExists(reference: string) {
    try {
      await readFile(path.join(this.dir(reference), "record.json"));
      return true;
    } catch {
      return false;
    }
  }

  async save(record: QuoteRecord, artwork: { bytes: Uint8Array } | null) {
    const dir = this.dir(record.reference);
    await mkdir(dir, { recursive: true });
    if (artwork && record.artwork) {
      await writeFile(path.join(dir, record.artwork.storedName), artwork.bytes, { flag: "wx" });
    }
    const tmp = path.join(dir, "record.json.tmp");
    await writeFile(tmp, JSON.stringify(record, null, 2), { flag: "wx" });
    await rename(tmp, path.join(dir, "record.json"));
  }

  async updateNotification(reference: string, notification: QuoteRecord["notification"]) {
    const file = path.join(this.dir(reference), "record.json");
    const record = JSON.parse(await readFile(file, "utf8")) as QuoteRecord;
    record.notification = notification;
    await writeFile(file, JSON.stringify(record, null, 2));
  }
}

/**
 * Resolves the configured store. Returns null when no durable store is
 * configured, which keeps the public quote form unavailable rather than
 * pretending a submission succeeded.
 */
export function resolveQuoteStore(env: NodeJS.ProcessEnv = process.env): QuoteStore | null {
  const kind = env.QUOTE_STORE?.trim();
  if (kind === "file") {
    const root = env.QUOTE_STORE_DIR?.trim() || path.join(process.cwd(), ".data", "quotes");
    return new FileQuoteStore(root);
  }
  return null;
}
