import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { emptyQuote, validateQuote } from "@/lib/quote";
import { checkArtworkBytes } from "@/lib/server/file-check";
import { generateReference, isQuoteIntakeAvailable, processQuoteIntake } from "@/lib/server/quote-intake";
import { FileQuoteStore, resolveQuoteStore } from "@/lib/server/quote-store";
import { createRateLimiter } from "@/lib/server/rate-limit";

const submissionId = "6f1c2a3e-4b5d-4c6e-8f70-1a2b3c4d5e6f";

function validForm(overrides: Record<string, string> = {}, file?: File) {
  const form = new FormData();
  const base: Record<string, string> = {
    submissionId,
    customerType: "Business",
    name: "Test Customer",
    company: "Test Shop",
    email: "buyer@example.test",
    phone: "",
    country: "United States",
    contactMethod: "Email",
    service: "embroidery-digitizing",
    details: "Left chest logo on pique polo.",
    deadline: "2026-10-01",
    width: "3.5",
    height: "2",
    unit: "in",
    formatNeeded: "DST",
    placement: "Left chest, pique polo",
    rights: "true",
    consent: "true",
    ...overrides,
  };
  Object.entries(base).forEach(([k, v]) => form.append(k, v));
  if (file) form.append("artwork", file);
  return form;
}

const headers = new Headers({ "x-forwarded-for": "203.0.113.10", "user-agent": "vitest" });

describe("validation", () => {
  it("requires service-specific fields", () => {
    const digital = { ...emptyQuote("embroidery-digitizing"), submissionId, name: "A", email: "a@b.co", details: "x", deadline: "2026-10-01", rights: true, consent: true };
    const e1 = validateQuote(digital);
    expect(e1.width).toBeDefined();
    expect(e1.formatNeeded).toBeDefined();
    expect(e1.company).toBeDefined();

    const physical = { ...digital, customerType: "Individual", service: "custom-patches", productType: "", quantity: "abc" };
    const e2 = validateQuote(physical);
    expect(e2.productType).toBeDefined();
    expect(e2.quantity).toMatch(/whole number/);
    expect(e2.postalCode).toBeDefined();
    expect(e2.company).toBeUndefined();

    const logo = { ...digital, service: "custom-logo-design" };
    const e3 = validateQuote(logo);
    expect(e3.wording).toBeDefined();
    expect(e3.width).toBeUndefined();
  });

  it("rejects honeypot and bad session ids", () => {
    const ok = { ...emptyQuote("vector-tracing"), submissionId, customerType: "Individual", name: "A", email: "a@b.co", details: "x", deadline: "2026-10-01", width: "1", height: "1", formatNeeded: "AI", placement: "print", rights: true, consent: true };
    expect(validateQuote(ok)).toEqual({});
    expect(validateQuote({ ...ok, website: "http://spam" }).form).toBeDefined();
    expect(validateQuote({ ...ok, submissionId: "nope" }).form).toBeDefined();
  });
});

describe("file content checks", () => {
  it("accepts real signatures and rejects mismatches and scripted SVG", () => {
    expect(checkArtworkBytes("a.png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2])).ok).toBe(true);
    expect(checkArtworkBytes("a.png", new TextEncoder().encode("<html>")).ok).toBe(false);
    expect(checkArtworkBytes("a.pdf", new TextEncoder().encode("%PDF-1.7 ...")).ok).toBe(true);
    expect(checkArtworkBytes("a.dst", new TextEncoder().encode("LA:design   ")).ok).toBe(true);
    expect(checkArtworkBytes("a.svg", new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>')).ok).toBe(true);
    const scripted = checkArtworkBytes("a.svg", new TextEncoder().encode('<svg><script>alert(1)</script></svg>'));
    expect(scripted.ok).toBe(false);
    expect(checkArtworkBytes("a.exp", new TextEncoder().encode("<script>")).ok).toBe(false);
    expect(checkArtworkBytes("a.exe", new Uint8Array([1])).ok).toBe(false);
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

describe("intake with file store", () => {
  let dir: string;
  let store: FileQuoteStore;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "sc-quotes-"));
    store = new FileQuoteStore(dir);
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("is unavailable without a configured store", async () => {
    const emptyEnv = {} as NodeJS.ProcessEnv;
    expect(isQuoteIntakeAvailable(emptyEnv).available).toBe(false);
    expect(resolveQuoteStore(emptyEnv)).toBeNull();
    const result = await processQuoteIntake({ form: validForm(), headers, store: null });
    expect(result.status).toBe(503);
  });

  it("persists once, returns a reference, and is idempotent on the same submission id", async () => {
    const png = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0])], "logo.png", { type: "image/png" });
    const first = await processQuoteIntake({ form: validForm({}, png), headers, store });
    expect(first.status).toBe(201);
    if (!first.body.ok) throw new Error("expected ok");
    expect(first.body.reference).toMatch(/^SC-\d{6}-[A-Z2-9]{4}$/);
    expect(first.body.notified).toBe(false);

    const files = await readdir(path.join(dir, first.body.reference));
    expect(files).toContain("record.json");
    expect(files.some((f) => f.startsWith("artwork-"))).toBe(true);
    const record = JSON.parse(await readFile(path.join(dir, first.body.reference, "record.json"), "utf8"));
    expect(record.payload.website).toBeUndefined();
    expect(record.artwork.detectedType).toBe("image/png");
    expect(record.notification.staff.status).toBe("not-configured");

    const second = await processQuoteIntake({ form: validForm({}, png), headers, store });
    expect(second.status).toBe(200);
    if (!second.body.ok) throw new Error("expected ok");
    expect(second.body.duplicate).toBe(true);
    expect(second.body.reference).toBe(first.body.reference);
    expect(await readdir(dir)).toHaveLength(1);
  });

  it("returns field errors and saves nothing on invalid input or bad files", async () => {
    const bad = await processQuoteIntake({ form: validForm({ email: "not-an-email", width: "" }), headers, store });
    expect(bad.status).toBe(400);
    if (bad.body.ok) throw new Error("expected error");
    expect(bad.body.errors?.email).toBeDefined();
    expect(bad.body.errors?.width).toBeDefined();
    const fake = new File([new TextEncoder().encode("<script>alert(1)</script>")], "logo.png", { type: "image/png" });
    const badFile = await processQuoteIntake({ form: validForm({}, fake), headers, store });
    expect(badFile.status).toBe(400);
    if (badFile.body.ok) throw new Error("expected error");
    expect(badFile.body.errors?.artwork).toMatch(/PNG/);
    expect(await readdir(dir)).toHaveLength(0);
  });

  it("generates references in the documented format", () => {
    expect(generateReference(new Date("2026-09-12T00:00:00Z"))).toMatch(/^SC-260912-[A-Z2-9]{4}$/);
  });
});
