import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fileLimits } from "@/lib/config/limits";
import { emptyQuote, validateQuote, type QuotePayload } from "@/lib/quote";
import { checkArtworkBytes } from "@/lib/server/file-check";
import { getIntakeStatus } from "@/lib/server/intake-config";
import type { MailConfig } from "@/lib/server/mailer";
import { generateReference, intakeLimits, processQuoteIntake, storedFileName } from "@/lib/server/quote-intake";
import { DuplicateSubmissionError, FileQuoteStore, MemoryQuoteStore, resolveQuoteStore } from "@/lib/server/quote-store";
import { createRateLimiter } from "@/lib/server/rate-limit";

const submissionId = "6f1c2a3e-4b5d-4c6e-8f70-1a2b3c4d5e6f";
const baseEnv: NodeJS.ProcessEnv = { QUOTE_STORE: "memory", NODE_ENV: "test" };

export function validDigitizing(overrides: Partial<QuotePayload> = {}): QuotePayload {
  return {
    ...emptyQuote("embroidery-digitizing"),
    submissionId,
    customerType: "Business",
    name: "Test Customer",
    company: "Test Shop",
    email: "buyer@example.test",
    countryCode: "US",
    contactMethod: "Email",
    details: "Left chest logo on piqué polo.",
    deadlineMode: "flexible",
    width: "3.5",
    height: "2",
    unit: "in",
    placement: "Left chest",
    fabric: "Piqué polo",
    embroideryStyle: "Flat embroidery",
    formatNeeded: "DST",
    designCount: "1",
    consent: true,
    ...overrides,
  };
}

function toForm(payload: QuotePayload, files: File[] = []) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => form.append(k, String(v)));
  files.forEach((f) => form.append("artwork", f, f.name));
  return form;
}

const png = () => new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13])], "logo.png", { type: "image/png" });
const pdf = () => new File([new TextEncoder().encode("%PDF-1.7 test")], "artwork.pdf", { type: "application/pdf" });

let ipCounter = 0;
const freshHeaders = () => new Headers({ "x-forwarded-for": `203.0.113.${(ipCounter += 1) % 250}`, "user-agent": "vitest" });

function fakeMail(fail?: "staff" | "customer" | "both") {
  const sent: Array<{ to: string; subject: string; text: string }> = [];
  const config: MailConfig = {
    from: "quotes@studio.test",
    inbox: "staff@studio.test",
    mailer: {
      name: "fake",
      resultStatus: "sent",
      async send(message) {
        const isStaff = message.to === "staff@studio.test";
        if (fail === "both" || (fail === "staff" && isStaff) || (fail === "customer" && !isStaff)) throw new Error("provider down");
        sent.push(message);
      },
    },
  };
  return { config, sent };
}

describe("file content checks", () => {
  it("accepts real signatures and rejects mismatches, empty files and scripted SVG", () => {
    expect(checkArtworkBytes("a.png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2])).ok).toBe(true);
    expect(checkArtworkBytes("a.png", new TextEncoder().encode("<html>")).ok).toBe(false);
    expect(checkArtworkBytes("a.png", new Uint8Array([])).ok).toBe(false);
    expect(checkArtworkBytes("a.pdf", new TextEncoder().encode("%PDF-1.7 ...")).ok).toBe(true);
    expect(checkArtworkBytes("a.dst", new TextEncoder().encode("LA:design   ")).ok).toBe(true);
    expect(checkArtworkBytes("a.svg", new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>')).ok).toBe(true);
    expect(checkArtworkBytes("a.svg", new TextEncoder().encode("<svg><script>alert(1)</script></svg>")).ok).toBe(false);
    expect(checkArtworkBytes("a.exp", new TextEncoder().encode("<script>")).ok).toBe(false);
    expect(checkArtworkBytes("a.exe", new Uint8Array([1])).ok).toBe(false);
    // Extension says JPEG but bytes are PNG: rejected.
    expect(checkArtworkBytes("a.jpg", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])).ok).toBe(false);
  });
});

describe("rate limiter", () => {
  it("blocks after the limit within the window and resets after it", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("k", 0).allowed).toBe(true);
    expect(limiter.check("k", 10).allowed).toBe(true);
    const blocked = limiter.check("k", 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(limiter.check("k", 1001).allowed).toBe(true);
  });
});

describe("store resolution and intake status", () => {
  it("is offline without a configured store and never pretends to save", async () => {
    const env = { NODE_ENV: "test" } as NodeJS.ProcessEnv;
    expect(resolveQuoteStore(env)).toEqual({ store: null, reason: "unset" });
    const status = getIntakeStatus(env);
    expect(status.online).toBe(false);
    expect(status.reason).toBe("no-store");
    const result = await processQuoteIntake({ form: toForm(validDigitizing()), headers: freshHeaders(), store: null, env });
    expect(result.status).toBe(503);
  });

  it("refuses the file store on serverless hosts and the memory store in production", () => {
    const env = (o: Record<string, string>) => o as unknown as NodeJS.ProcessEnv;
    expect(resolveQuoteStore(env({ QUOTE_STORE: "file", VERCEL: "1" })).reason).toBe("file-on-serverless");
    expect(resolveQuoteStore(env({ QUOTE_STORE: "memory", NODE_ENV: "production" })).reason).toBe("memory-in-production");
    expect(resolveQuoteStore(env({ QUOTE_STORE: "vercel-blob" })).reason).toBe("blob-missing-token");
    expect(resolveQuoteStore(env({ QUOTE_STORE: "vercel-blob", BLOB_READ_WRITE_TOKEN: "x" })).store?.name).toBe("vercel-blob");
  });

  it("supports deliberate maintenance mode with a configurable message", async () => {
    const env = { ...baseEnv, QUOTE_INTAKE_MODE: "offline", QUOTE_OFFLINE_MESSAGE: "Back on Monday." };
    const status = getIntakeStatus(env);
    expect(status).toMatchObject({ online: false, reason: "maintenance", offlineMessage: "Back on Monday." });
    const store = new MemoryQuoteStore();
    const result = await processQuoteIntake({ form: toForm(validDigitizing()), headers: freshHeaders(), store, env });
    expect(result.status).toBe(503);
    expect(result.body.message).toBe("Back on Monday.");
    expect(store.records.size).toBe(0);
  });
});

describe("intake with the memory store", () => {
  let store: MemoryQuoteStore;
  beforeEach(() => {
    store = new MemoryQuoteStore();
  });

  it("saves once, returns a reference, notifies both parties and is idempotent", async () => {
    const mail = fakeMail();
    const first = await processQuoteIntake({ form: toForm(validDigitizing({ previousReference: "SC-260101-ABCD", rights: true }), [png()]), headers: freshHeaders(), store, env: baseEnv, notify: { config: mail.config, responseStatement: "We reply within one working day." } });
    expect(first.status).toBe(201);
    if (!first.body.ok) throw new Error("expected ok");
    expect(first.body.reference).toMatch(/^SC-\d{6}-[A-Z2-9]{4}$/);
    expect(first.body.notified).toBe(true);
    expect(mail.sent).toHaveLength(2);
    const staff = mail.sent.find((m) => m.to === "staff@studio.test")!;
    expect(staff.subject).toContain("[REPEAT ORDER]");
    expect(staff.text).toContain("Previous quote/order reference: SC-260101-ABCD");
    expect(staff.text).toContain("logo.png");
    const customer = mail.sent.find((m) => m.to === "buyer@example.test")!;
    expect(customer.text).toContain(first.body.reference);
    expect(customer.text).toContain("Embroidery Digitizing");
    expect(customer.text).toContain("We reply within one working day.");
    expect(customer.text).toContain("Finished size: 3.5 × 2 in");

    const record = store.records.get(first.body.reference)!;
    expect((record.payload as Record<string, unknown>).website).toBeUndefined();
    expect((record.payload as Record<string, unknown>).turnstileToken).toBeUndefined();
    expect(record.artwork).toHaveLength(1);
    expect(record.artwork[0].detectedType).toBe("image/png");
    expect(record.artwork[0].storedName).toBe(storedFileName(first.body.reference, 0, "logo.png"));
    expect(record.countryLabel).toBe("United States");

    const second = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), [png()]), headers: freshHeaders(), store, env: baseEnv, notify: { config: mail.config } });
    expect(second.status).toBe(200);
    if (!second.body.ok) throw new Error("expected ok");
    expect(second.body.duplicate).toBe(true);
    expect(second.body.reference).toBe(first.body.reference);
    expect(store.records.size).toBe(1);
    expect(mail.sent).toHaveLength(2);
  });

  it("collapses concurrent submissions with the same session id into one record", async () => {
    const mail = fakeMail();
    const burst = await Promise.all(
      [0, 1, 2].map(() => processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), [png()]), headers: freshHeaders(), store, env: baseEnv, notify: { config: mail.config } })),
    );
    const references = new Set(burst.map((r) => (r.body.ok ? r.body.reference : "fail")));
    expect(references.size).toBe(1);
    expect(burst.filter((r) => r.status === 201)).toHaveLength(1);
    expect(burst.filter((r) => r.status === 200 && r.body.ok && r.body.duplicate)).toHaveLength(2);
    expect(store.records.size).toBe(1);
    expect(mail.sent).toHaveLength(2);
  });

  it("throws a typed duplicate error when the store already holds the session id", async () => {
    const first = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true })), headers: freshHeaders(), store, env: baseEnv });
    if (!first.body.ok) throw new Error("expected ok");
    const clash = { ...store.records.get(first.body.reference)!, reference: "SC-999999-ZZZZ" };
    await expect(store.save(clash, [])).rejects.toBeInstanceOf(DuplicateSubmissionError);
    expect(store.records.size).toBe(1);
  });

  it("accepts multiple files and records each one", async () => {
    const result = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), [png(), pdf()]), headers: freshHeaders(), store, env: baseEnv, notify: { config: null } });
    expect(result.status).toBe(201);
    if (!result.body.ok) throw new Error("expected ok");
    const record = store.records.get(result.body.reference)!;
    expect(record.artwork.map((a) => a.detectedType)).toEqual(["image/png", "application/pdf"]);
    expect(store.files.size).toBe(2);
    expect(result.body.notified).toBe(false);
  });

  it("requires the artwork-rights confirmation only when files are attached", async () => {
    const noFiles = await processQuoteIntake({ form: toForm(validDigitizing({ rights: false })), headers: freshHeaders(), store, env: baseEnv, notify: { config: null } });
    expect(noFiles.status).toBe(201);
    const withFile = await processQuoteIntake({ form: toForm(validDigitizing({ rights: false, submissionId: "6f1c2a3e-4b5d-4c6e-8f70-1a2b3c4d5e70" }), [png()]), headers: freshHeaders(), store, env: baseEnv, notify: { config: null } });
    expect(withFile.status).toBe(400);
    if (withFile.body.ok) throw new Error("expected error");
    expect(withFile.body.errors?.rights).toBeDefined();
  });

  it("returns field errors and saves nothing on invalid input", async () => {
    const bad = await processQuoteIntake({ form: toForm(validDigitizing({ email: "not-an-email", width: "", deadlineMode: "fixed", deadlineDate: "2020-01-01" })), headers: freshHeaders(), store, env: baseEnv });
    expect(bad.status).toBe(400);
    if (bad.body.ok) throw new Error("expected error");
    expect(bad.body.errors?.email).toBeDefined();
    expect(bad.body.errors?.width).toBeDefined();
    expect(bad.body.errors?.deadlineDate).toMatch(/passed/);
    expect(store.records.size).toBe(0);
  });

  it("rejects unsupported, spoofed, empty and oversized files without saving", async () => {
    const spoofed = new File([new TextEncoder().encode("<script>alert(1)</script>")], "logo.png", { type: "image/png" });
    const r1 = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), [spoofed]), headers: freshHeaders(), store, env: baseEnv });
    expect(r1.status).toBe(400);
    if (r1.body.ok) throw new Error("expected error");
    expect(r1.body.errors?.artwork).toMatch(/PNG/);

    const exe = new File([new Uint8Array([0x4d, 0x5a, 1, 2])], "virus.exe", { type: "application/octet-stream" });
    const r2 = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), [exe]), headers: freshHeaders(), store, env: baseEnv });
    expect(r2.status).toBe(400);
    if (r2.body.ok) throw new Error("expected error");
    expect(r2.body.errors?.artwork).toMatch(/not an accepted type/);

    const big = new File([new Uint8Array(fileLimits.maxSizeBytes + 1)], "huge.png", { type: "image/png" });
    const r3 = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), [big]), headers: freshHeaders(), store, env: baseEnv });
    expect(r3.status).toBe(400);
    if (r3.body.ok) throw new Error("expected error");
    expect(r3.body.errors?.artwork).toMatch(/larger than/);

    const tooMany = Array.from({ length: fileLimits.maxFiles + 1 }, () => png());
    const r4 = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), tooMany), headers: freshHeaders(), store, env: baseEnv });
    expect(r4.status).toBe(400);
    expect(store.records.size).toBe(0);
    expect(intakeLimits.maxRequestBytes).toBeGreaterThan(fileLimits.maxTotalBytes);
  });

  it("reports a storage failure honestly and does not notify", async () => {
    const mail = fakeMail();
    store.failNextSave = new Error("disk full");
    const result = await processQuoteIntake({ form: toForm(validDigitizing()), headers: freshHeaders(), store, env: baseEnv, notify: { config: mail.config } });
    expect(result.status).toBe(500);
    if (result.body.ok) throw new Error("expected error");
    expect(result.body.retryable).toBe(true);
    expect(mail.sent).toHaveLength(0);
    expect(store.records.size).toBe(0);
  });

  it("keeps the saved quote when email fails and records the failure", async () => {
    const mail = fakeMail("both");
    const result = await processQuoteIntake({ form: toForm(validDigitizing()), headers: freshHeaders(), store, env: baseEnv, notify: { config: mail.config } });
    expect(result.status).toBe(201);
    if (!result.body.ok) throw new Error("expected ok");
    expect(result.body.notified).toBe(false);
    const record = store.records.get(result.body.reference)!;
    expect(record.notification.staff.status).toBe("failed");
    expect(record.notification.customer.status).toBe("failed");
  });

  it("rate limits repeated submissions from one connection", async () => {
    const headers = new Headers({ "x-forwarded-for": "198.51.100.7" });
    let last: Awaited<ReturnType<typeof processQuoteIntake>> | null = null;
    for (let i = 0; i < intakeLimits.rate.limit + 1; i += 1) {
      last = await processQuoteIntake({ form: toForm(validDigitizing({ email: "x" })), headers, store, env: baseEnv });
    }
    expect(last?.status).toBe(429);
    if (!last || last.body.ok) throw new Error("expected error");
    expect(last.body.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("rejects honeypot submissions and bad session ids", async () => {
    const hp = await processQuoteIntake({ form: toForm(validDigitizing({ website: "http://spam" })), headers: freshHeaders(), store, env: baseEnv });
    expect(hp.status).toBe(400);
    const bad = await processQuoteIntake({ form: toForm(validDigitizing({ submissionId: "nope" })), headers: freshHeaders(), store, env: baseEnv });
    expect(bad.status).toBe(400);
    expect(store.records.size).toBe(0);
  });

  it("stores the honest 'Other' country label", async () => {
    const result = await processQuoteIntake({ form: toForm(validDigitizing({ countryCode: "OTHER", countryName: "Faroe Islands" })), headers: freshHeaders(), store, env: baseEnv });
    expect(result.status).toBe(201);
    if (!result.body.ok) throw new Error("expected ok");
    expect(store.records.get(result.body.reference)!.countryLabel).toBe("Faroe Islands");
  });
});

describe("intake with the file store", () => {
  let dir: string;
  let store: FileQuoteStore;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "sc-quotes-"));
    store = new FileQuoteStore(dir);
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("writes record and files to disk and can stream the artwork back", async () => {
    const result = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true }), [png()]), headers: freshHeaders(), store, env: baseEnv });
    expect(result.status).toBe(201);
    if (!result.body.ok) throw new Error("expected ok");
    const files = await readdir(path.join(dir, result.body.reference));
    expect(files).toContain("record.json");
    expect(files.some((f) => f.startsWith("artwork-1-"))).toBe(true);
    const record = JSON.parse(await readFile(path.join(dir, result.body.reference, "record.json"), "utf8"));
    expect(record.notification.staff.status).toBe("not-configured");
    const stream = await store.openArtwork(result.body.reference, record.artwork[0].storedName);
    expect(stream?.size).toBe(12);
    expect(stream?.contentType).toBe("image/png");
    expect(await store.openArtwork(result.body.reference, "../record.json")).toBeNull();
  });

  it("claims the session id atomically so a second process cannot save it again", async () => {
    const first = await processQuoteIntake({ form: toForm(validDigitizing({ rights: true })), headers: freshHeaders(), store, env: baseEnv });
    if (!first.body.ok) throw new Error("expected ok");
    const found = await store.findBySubmissionId(submissionId);
    expect(found?.reference).toBe(first.body.reference);
    // A fresh store instance pointing at the same directory (another process) must see the claim.
    const other = new FileQuoteStore(dir);
    const clash = { ...found!, reference: "SC-999999-ZZZZ" };
    await expect(other.save(clash, [])).rejects.toBeInstanceOf(DuplicateSubmissionError);
    expect(await store.referenceExists("SC-999999-ZZZZ")).toBe(false);
  });
});

describe("reference generation", () => {
  it("uses the documented format and an unambiguous alphabet", () => {
    const ref = generateReference(new Date("2026-09-14T00:00:00Z"));
    expect(ref).toMatch(/^SC-260914-[A-Z2-9]{4}$/);
    expect(ref.slice(-4)).not.toMatch(/[01OIL]/);
    const fixed = generateReference(new Date("2026-09-14T00:00:00Z"), () => new Uint8Array([0, 1, 2, 3]));
    expect(fixed).toBe("SC-260914-ABCD");
    const set = new Set(Array.from({ length: 200 }, () => generateReference()));
    expect(set.size).toBeGreaterThan(190);
  });
});

describe("validation shared by client and server", () => {
  it("is clean for a valid payload", () => {
    expect(validateQuote(validDigitizing(), { fileCount: 0 })).toEqual({});
  });
});
