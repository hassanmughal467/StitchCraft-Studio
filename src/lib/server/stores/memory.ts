import { DuplicateSubmissionError, type ArtworkStream, type IncomingFile, type QuoteRecord, type QuoteStore } from "@/lib/server/quote-store";

/**
 * In-memory store for automated tests and local experiments. Data is lost when
 * the process exits, so the resolver refuses it in production unless
 * QUOTE_STORE_ALLOW_VOLATILE=true is set deliberately.
 */
export class MemoryQuoteStore implements QuoteStore {
  readonly name = "memory";
  readonly direct = null;
  readonly records = new Map<string, QuoteRecord>();
  readonly files = new Map<string, { bytes: Uint8Array; contentType: string }>();
  /** Test hook: throw on the next save. */
  failNextSave: Error | null = null;

  async findBySubmissionId(submissionId: string) {
    for (const record of this.records.values()) if (record.submissionId === submissionId) return record;
    return null;
  }

  async referenceExists(reference: string) {
    return this.records.has(reference);
  }

  async save(record: QuoteRecord, files: IncomingFile[]) {
    if (this.failNextSave) {
      const error = this.failNextSave;
      this.failNextSave = null;
      throw error;
    }
    if (this.records.has(record.reference)) throw new Error("Reference already exists");
    for (const existing of this.records.values()) {
      if (existing.submissionId === record.submissionId) throw new DuplicateSubmissionError(record.submissionId);
    }
    for (const file of files) {
      if (!("bytes" in file)) throw new Error("Memory store only accepts inline uploads");
      this.files.set(`${record.reference}/${file.storedName}`, { bytes: file.bytes, contentType: file.contentType });
    }
    this.records.set(record.reference, structuredClone(record));
  }

  async updateNotification(reference: string, notification: QuoteRecord["notification"]) {
    const record = this.records.get(reference);
    if (!record) throw new Error("Unknown reference");
    record.notification = notification;
  }

  async openArtwork(reference: string, storedName: string): Promise<ArtworkStream | null> {
    const file = this.files.get(`${reference}/${storedName}`);
    if (!file) return null;
    const bytes = file.bytes;
    return {
      size: bytes.byteLength,
      contentType: file.contentType,
      stream: new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      }),
    };
  }

  clear() {
    this.records.clear();
    this.files.clear();
  }
}
