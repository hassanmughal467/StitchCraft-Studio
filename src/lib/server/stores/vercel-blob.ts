import { DuplicateSubmissionError, type ArtworkStream, type DirectUploadSupport, type IncomingFile, type QuoteRecord, type QuoteStore } from "@/lib/server/quote-store";

/**
 * Vercel Blob store (private access). Chosen because the site deploys to Vercel,
 * where functions have no persistent disk and a 4.5 MB request-body limit.
 *
 * Layout (all objects private):
 *   <prefix>/quotes/<reference>/record.json
 *   <prefix>/quotes/<reference>/<storedName>          inline uploads (small files)
 *   <prefix>/index/submissions/<submissionId>.json     idempotency index → { reference }
 *   <prefix>/uploads/<submissionId>/<name>             direct client uploads, referenced by the record
 *
 * The SDK is wrapped behind `BlobClient` so the store can be unit-tested with a fake.
 */
export interface BlobClient {
  put(pathname: string, body: Uint8Array | string, options: { contentType: string; allowOverwrite: boolean }): Promise<void>;
  head(pathname: string): Promise<{ size: number } | null>;
  get(pathname: string): Promise<{ stream: ReadableStream<Uint8Array>; size: number; contentType: string } | null>;
  del(pathname: string): Promise<void>;
}

export function vercelBlobClient(token: string): BlobClient {
  // Loaded lazily so the SDK is only bundled into the server when this store is used.
  const sdk = () => import("@vercel/blob");
  return {
    async put(pathname, body, options) {
      const { put } = await sdk();
      const payload = typeof body === "string" ? body : Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      await put(pathname, payload, { access: "private", addRandomSuffix: false, allowOverwrite: options.allowOverwrite, contentType: options.contentType, token });
    },
    async head(pathname) {
      const { head, BlobNotFoundError } = await sdk();
      try {
        const result = await head(pathname, { token });
        return { size: result.size };
      } catch (error) {
        if (error instanceof BlobNotFoundError) return null;
        throw error;
      }
    },
    async get(pathname) {
      const { get } = await sdk();
      const result = await get(pathname, { access: "private", token, useCache: false });
      if (!result || result.statusCode !== 200) return null;
      return { stream: result.stream, size: result.blob.size, contentType: result.blob.contentType };
    },
    async del(pathname) {
      const { del } = await sdk();
      await del(pathname, { token });
    },
  };
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

const referencePattern = /^[A-Z0-9-]+$/;
const storedNamePattern = /^[a-z0-9][a-z0-9.-]{0,120}$/;
const uuidPattern = /^[0-9a-f-]{36}$/i;

export class VercelBlobQuoteStore implements QuoteStore {
  readonly name = "vercel-blob";
  readonly direct: DirectUploadSupport;

  constructor(
    private readonly client: BlobClient,
    private readonly prefix: string,
  ) {
    this.direct = {
      prefixFor: (submissionId) => this.uploadPrefix(submissionId),
      read: async (location) => {
        if (!location.startsWith(`${this.prefix}/uploads/`)) return null;
        const result = await this.client.get(location);
        if (!result) return null;
        const bytes = await readAll(result.stream);
        return { bytes, size: result.size };
      },
      discard: async (location) => {
        if (!location.startsWith(`${this.prefix}/uploads/`)) return;
        try {
          await this.client.del(location);
        } catch {
          // best effort
        }
      },
    };
  }

  private uploadPrefix(submissionId: string) {
    if (!uuidPattern.test(submissionId)) throw new Error("Invalid submission id");
    return `${this.prefix}/uploads/${submissionId.toLowerCase()}/`;
  }

  private recordKey(reference: string) {
    if (!referencePattern.test(reference)) throw new Error("Invalid reference");
    return `${this.prefix}/quotes/${reference}/record.json`;
  }

  private indexKey(submissionId: string) {
    if (!uuidPattern.test(submissionId)) throw new Error("Invalid submission id");
    return `${this.prefix}/index/submissions/${submissionId.toLowerCase()}.json`;
  }

  private async readJson<T>(pathname: string): Promise<T | null> {
    const result = await this.client.get(pathname);
    if (!result) return null;
    const bytes = await readAll(result.stream);
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  }

  async findBySubmissionId(submissionId: string) {
    if (!uuidPattern.test(submissionId)) return null;
    const index = await this.readJson<{ reference: string }>(this.indexKey(submissionId));
    if (!index?.reference) return null;
    return this.readJson<QuoteRecord>(this.recordKey(index.reference));
  }

  async referenceExists(reference: string) {
    return (await this.client.head(this.recordKey(reference))) !== null;
  }

  async save(record: QuoteRecord, files: IncomingFile[]) {
    // Claim the submission id first; `allowOverwrite: false` makes this atomic.
    const index = this.indexKey(record.submissionId);
    if ((await this.client.head(index)) !== null) throw new DuplicateSubmissionError(record.submissionId);
    try {
      await this.client.put(index, JSON.stringify({ reference: record.reference }), { contentType: "application/json", allowOverwrite: false });
    } catch (error) {
      if (/already exists/i.test(error instanceof Error ? error.message : String(error))) throw new DuplicateSubmissionError(record.submissionId);
      throw error;
    }
    try {
      for (const file of files) {
        if (!storedNamePattern.test(file.storedName)) throw new Error("Invalid stored name");
        if ("bytes" in file) {
          await this.client.put(`${this.prefix}/quotes/${record.reference}/${file.storedName}`, file.bytes, { contentType: file.contentType, allowOverwrite: false });
        }
        // Direct uploads already live under uploads/<submissionId>/ and are referenced by location.
      }
      await this.client.put(this.recordKey(record.reference), JSON.stringify(record), { contentType: "application/json", allowOverwrite: false });
    } catch (error) {
      // Release the claim so a retry with the same submission id can succeed.
      await this.client.del(index).catch(() => undefined);
      throw error;
    }
  }

  async updateNotification(reference: string, notification: QuoteRecord["notification"]) {
    const record = await this.readJson<QuoteRecord>(this.recordKey(reference));
    if (!record) throw new Error("Unknown reference");
    record.notification = notification;
    await this.client.put(this.recordKey(reference), JSON.stringify(record), { contentType: "application/json", allowOverwrite: true });
  }

  async openArtwork(reference: string, storedName: string): Promise<ArtworkStream | null> {
    if (!storedNamePattern.test(storedName)) return null;
    const record = await this.readJson<QuoteRecord>(this.recordKey(reference));
    const artwork = record?.artwork.find((a) => a.storedName === storedName);
    if (!record || !artwork) return null;
    const result = await this.client.get(artwork.location);
    if (!result) return null;
    return { stream: result.stream, size: result.size, contentType: artwork.detectedType || "application/octet-stream" };
  }
}
