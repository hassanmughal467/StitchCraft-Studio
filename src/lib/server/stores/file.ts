import { mkdir, open, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { DuplicateSubmissionError, type ArtworkStream, type IncomingFile, type QuoteRecord, type QuoteStore } from "@/lib/server/quote-store";

const referencePattern = /^[A-Z0-9-]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const storedNamePattern = /^[a-z0-9][a-z0-9.-]{0,120}$/;

/**
 * Local filesystem store for development and single-server deployments with a
 * persistent disk. Layout: <root>/<reference>/record.json plus one file per
 * artwork. The root lives outside /public and is gitignored.
 */
export class FileQuoteStore implements QuoteStore {
  readonly name = "file";
  readonly direct = null;
  constructor(private readonly root: string) {}

  private dir(reference: string) {
    if (!referencePattern.test(reference)) throw new Error("Invalid reference");
    return path.join(this.root, reference);
  }

  private indexPath(submissionId: string) {
    if (!uuidPattern.test(submissionId)) throw new Error("Invalid submission id");
    return path.join(this.root, ".index", submissionId.toLowerCase());
  }

  private async readRecord(reference: string) {
    try {
      return JSON.parse(await readFile(path.join(this.dir(reference), "record.json"), "utf8")) as QuoteRecord;
    } catch {
      return null;
    }
  }

  async findBySubmissionId(submissionId: string) {
    if (!uuidPattern.test(submissionId)) return null;
    // Fast path: the atomic claim written by `save`.
    try {
      const reference = (await readFile(this.indexPath(submissionId), "utf8")).trim();
      if (referencePattern.test(reference)) {
        const record = await this.readRecord(reference);
        if (record?.submissionId === submissionId) return record;
      }
    } catch {
      // no index entry yet; fall through to the scan
    }
    let entries: string[] = [];
    try {
      entries = await readdir(this.root);
    } catch {
      return null;
    }
    for (const entry of entries) {
      if (entry.startsWith(".")) continue;
      const record = await this.readRecord(entry).catch(() => null);
      if (record?.submissionId === submissionId) return record;
    }
    return null;
  }

  async referenceExists(reference: string) {
    try {
      await stat(path.join(this.dir(reference), "record.json"));
      return true;
    } catch {
      return false;
    }
  }

  async save(record: QuoteRecord, files: IncomingFile[]) {
    const dir = this.dir(record.reference);
    // Claim the submission id first so two processes cannot both save it.
    const index = this.indexPath(record.submissionId);
    await mkdir(path.dirname(index), { recursive: true });
    try {
      await writeFile(index, record.reference, { flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new DuplicateSubmissionError(record.submissionId);
      throw error;
    }
    await mkdir(dir, { recursive: true });
    for (const file of files) {
      if (!storedNamePattern.test(file.storedName)) throw new Error("Invalid stored name");
      if (!("bytes" in file)) throw new Error("File store only accepts inline uploads");
      await writeFile(path.join(dir, file.storedName), file.bytes, { flag: "wx" });
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

  async openArtwork(reference: string, storedName: string): Promise<ArtworkStream | null> {
    if (!storedNamePattern.test(storedName)) return null;
    let record: QuoteRecord;
    try {
      record = JSON.parse(await readFile(path.join(this.dir(reference), "record.json"), "utf8")) as QuoteRecord;
    } catch {
      return null;
    }
    const artwork = record.artwork.find((a) => a.storedName === storedName);
    if (!artwork) return null;
    const filePath = path.join(this.dir(reference), storedName);
    try {
      const handle = await open(filePath, "r");
      const info = await handle.stat();
      const stream = Readable.toWeb(handle.createReadStream()) as ReadableStream<Uint8Array>;
      return { stream, size: info.size, contentType: artwork.detectedType || "application/octet-stream" };
    } catch {
      return null;
    }
  }
}
