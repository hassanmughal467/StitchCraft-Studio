"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChoiceGroup, CountrySelect, Field, RowsEditor, inputClass } from "@/components/quote/fields";
import { FileList, type QueuedFile } from "@/components/quote/FileList";
import { Turnstile } from "@/components/quote/Turnstile";
import { Button } from "@/components/ui/Button";
import { errorCategory, track } from "@/lib/analytics";
import { countLimits, dimensionLimits, fileLimits, quantityLimits } from "@/lib/config/limits";
import { countryName } from "@/lib/countries";
import {
  contactMethods,
  customerTypes,
  deadlineLabels,
  deadlineModes,
  emptyQuote,
  isApparel,
  isDigitizing,
  isLogoDesign,
  isPhysical,
  isVector,
  compactRows,
  parseRows,
  serviceOptions,
  stepOneErrors,
  stringifyRows,
  todayIso,
  units,
  validateArtworkFiles,
  validateQuote,
  type CustomerType,
  type QuoteFieldErrors,
  type QuotePayload,
} from "@/lib/quote";
import type { PublicIntakeConfig } from "@/lib/server/intake-config";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

type ErrorKind = "validation" | "network" | "server" | "offline" | "rate_limited" | "upload";

type Status =
  | { type: "idle" }
  | { type: "uploading"; index: number; total: number }
  | { type: "submitting"; progress: number }
  | { type: "success"; reference: string; message: string; notified: boolean; duplicate: boolean; service: string }
  | { type: "error"; message: string; kind: ErrorKind; retryable: boolean };

export type QuoteFormProps = {
  initialService?: string;
  initialCustomerType?: CustomerType;
  initialPortfolio?: { ref: string; title: string } | null;
  config: PublicIntakeConfig & { uploadPrefix?: string | null; turnstileSiteKey?: string | null };
};

const labels: Record<keyof QuoteFieldErrors, string> = {
  submissionId: "Form session",
  customerType: "Ordering as",
  name: "Full name",
  company: "Business name",
  email: "Email",
  phone: "Phone or WhatsApp",
  countryCode: "Country",
  countryName: "Country name",
  contactMethod: "Reply by",
  service: "Service",
  previousReference: "Previous reference",
  portfolioRef: "Portfolio project",
  portfolioTitle: "Portfolio project",
  details: "Project description",
  deadlineMode: "Timing",
  deadlineDate: "Date",
  budget: "Budget",
  rights: "Artwork rights",
  consent: "Consent",
  marketing: "Updates",
  width: "Finished size",
  height: "Height",
  unit: "Unit",
  sizeUndecided: "Size not decided",
  placement: "Placement",
  fabric: "Fabric or material",
  embroideryStyle: "Embroidery type",
  formatNeeded: "File format",
  designCount: "Number of designs",
  rush: "Rush",
  intendedUse: "Intended use",
  colorCount: "Colour count",
  fontsEditable: "Fonts",
  reproductionMode: "Redraw type",
  wording: "Exact wording",
  industry: "Industry",
  audience: "Audience",
  requiredUses: "Intended uses",
  styleDirection: "Style direction",
  colors: "Colour preferences",
  styleReferences: "Reference material",
  deliverables: "Deliverables",
  productType: "Product",
  quantity: "Total quantity",
  rows: "Breakdown",
  garmentColors: "Garment colours",
  supplyMode: "Supply",
  placements: "Decoration locations",
  decoration: "Decoration type",
  backing: "Backing type",
  border: "Border finish",
  shape: "Shape",
  destinationCity: "Delivery city",
  postalCode: "Postal code",
  sourcePath: "Source",
  referrer: "Referrer",
  website: "Website",
  turnstileToken: "Spam check",
  artwork: "Artwork files",
  form: "Form",
};

/** Keys whose error link should point at a fieldset rather than an input. */
const summaryTargets: Partial<Record<keyof QuoteFieldErrors, string>> = { rights: "rights", consent: "consent", width: "width", form: "" };

let keyCounter = 0;

export function QuoteForm({ initialService = "", initialCustomerType = "Business", initialPortfolio = null, config }: QuoteFormProps) {
  const uid = useId();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<QuotePayload>(() => ({ ...emptyQuote(initialService, initialCustomerType), portfolioRef: initialPortfolio?.ref ?? "", portfolioTitle: initialPortfolio?.title ?? "" }));
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const inFlightRef = useRef(false);
  const sessionRef = useRef("");
  const session = () => (sessionRef.current ||= crypto.randomUUID());

  useEffect(() => {
    track({ name: "quote_started", service: initialService || undefined, customerType: initialCustomerType, fromPortfolio: Boolean(initialPortfolio) });
    if (!config.online) track({ name: "quote_unavailable" });
  }, [initialService, initialCustomerType, initialPortfolio, config.online]);

  useEffect(() => {
    if (status.type === "success") successRef.current?.focus();
  }, [status.type]);

  const busy = status.type === "uploading" || status.type === "submitting";

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      if (!Object.keys(next).length) setStatus((s) => (s.type === "error" && s.kind === "validation" ? { type: "idle" } : s));
      return next;
    });
  }

  function withSession(current: QuotePayload): QuotePayload {
    return {
      ...current,
      submissionId: session(),
      sourcePath: typeof window === "undefined" ? "" : window.location.pathname + window.location.search,
      referrer: typeof document === "undefined" || !document.referrer ? "" : safeOrigin(document.referrer),
    };
  }

  function focusSummary() {
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  function showErrors(next: QuoteFieldErrors, stepNo: 1 | 2) {
    setErrors(next);
    setStatus({ type: "error", message: "Please correct the highlighted fields.", kind: "validation", retryable: false });
    track({ name: "validation_error", step: stepNo, category: errorCategory(Object.keys(next)) });
    focusSummary();
  }

  function goNext() {
    const stepErrors = stepOneErrors(withSession(values));
    if (Object.keys(stepErrors).length) return showErrors(stepErrors, 1);
    setErrors({});
    setStatus({ type: "idle" });
    setStep(2);
    track({ name: "quote_step_completed", step: 1, service: values.service });
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function goBack() {
    setStep(1);
    setStatus({ type: "idle" });
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function addFiles(picked: File[]) {
    const next = [...files, ...picked.map((file) => ({ key: `f${(keyCounter += 1)}`, file, progress: null }))];
    const error = validateArtworkFiles(next.map((f) => ({ name: f.file.name, size: f.file.size })));
    if (error) {
      setErrors((current) => ({ ...current, artwork: error }));
      // Keep only files that individually pass, so a single bad pick does not block the rest.
      setFiles(next.filter((f) => !validateArtworkFiles([{ name: f.file.name, size: f.file.size }])).slice(0, fileLimits.maxFiles));
      track({ name: "validation_error", step: 2, category: "files" });
      return;
    }
    setFiles(next);
    setErrors((current) => {
      const copy = { ...current };
      delete copy.artwork;
      return copy;
    });
    track({ name: "upload_attempted", fileCount: next.length, mode: config.uploadMode });
  }

  function removeFile(key: string) {
    setFiles((current) => current.filter((f) => f.key !== key));
    setErrors((current) => {
      const copy = { ...current };
      delete copy.artwork;
      return copy;
    });
  }

  const onToken = useCallback((token: string) => setValues((current) => ({ ...current, turnstileToken: token })), []);

  async function uploadDirect(submission: QuotePayload): Promise<Array<{ location: string; originalName: string }> | null> {
    const { upload } = await import("@vercel/blob/client");
    const prefix = `${config.uploadPrefix}${submission.submissionId}/`;
    const results: Array<{ location: string; originalName: string }> = [];
    for (let i = 0; i < files.length; i += 1) {
      const item = files[i];
      if (item.location) {
        results.push({ location: item.location, originalName: item.file.name });
        continue;
      }
      setStatus({ type: "uploading", index: i + 1, total: files.length });
      setFiles((current) => current.map((f) => (f.key === item.key ? { ...f, progress: 0, error: undefined } : f)));
      try {
        const safe = item.file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^[^a-z0-9]+/, "").slice(0, 80) || "artwork";
        const result = await upload(`${prefix}${safe}`, item.file, {
          access: "private",
          handleUploadUrl: "/api/quote/upload",
          clientPayload: submission.submissionId,
          onUploadProgress: ({ percentage }) => setFiles((current) => current.map((f) => (f.key === item.key ? { ...f, progress: Math.round(percentage) } : f))),
        });
        setFiles((current) => current.map((f) => (f.key === item.key ? { ...f, progress: null, location: result.pathname } : f)));
        results.push({ location: result.pathname, originalName: item.file.name });
      } catch {
        setFiles((current) => current.map((f) => (f.key === item.key ? { ...f, progress: null, error: "Upload failed. Check your connection and try again, or remove this file." } : f)));
        return null;
      }
    }
    return results;
  }

  function submit() {
    // `busy` is derived from state, which lags a synchronous double click; the ref guards the same tick.
    if (!config.online || busy || inFlightRef.current) return;
    const submission = { ...withSession(values), rows: compactRows(values.rows) };
    const nextErrors = validateQuote(submission, { fileCount: files.length });
    const fileError = validateArtworkFiles(files.map((f) => ({ name: f.file.name, size: f.file.size })));
    if (fileError) nextErrors.artwork = fileError;
    if (Object.keys(nextErrors).length) return showErrors(nextErrors, 2);
    setErrors({});
    inFlightRef.current = true;
    void send(submission).finally(() => {
      inFlightRef.current = false;
    });
  }

  function send(submission: QuotePayload) {
    return new Promise<void>((done) => void sendInner(submission, done));
  }

  async function sendInner(submission: QuotePayload, done: () => void) {
    let uploads: Array<{ location: string; originalName: string }> | null = [];
    if (files.length && config.uploadMode === "direct") {
      uploads = await uploadDirect(submission);
      if (!uploads) {
        setStatus({ type: "error", message: "One of the files could not be uploaded. Your details are still in the form; try again or remove the file.", kind: "upload", retryable: true });
        track({ name: "quote_submission_failed", service: submission.service, reason: "upload" });
        focusSummary();
        done();
        return;
      }
    }
    setStatus({ type: "submitting", progress: 0 });
    const body = new FormData();
    Object.entries(submission).forEach(([key, value]) => body.append(key, String(value)));
    if (config.uploadMode === "direct") body.append("uploads", JSON.stringify(uploads));
    else files.forEach((f) => body.append("artwork", f.file, f.file.name));

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", "/api/quote");
    xhr.responseType = "json";
    xhr.timeout = 120_000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setStatus({ type: "submitting", progress: Math.round((e.loaded / e.total) * 100) });
    };
    const fail = (message: string, kind: ErrorKind, retryable: boolean, reason: "network" | "validation" | "rate_limited" | "offline" | "server") => {
      setStatus({ type: "error", message, kind, retryable });
      track({ name: "quote_submission_failed", service: submission.service, reason });
      focusSummary();
      done();
    };
    xhr.onerror = () => fail("The request could not be sent. Check your connection and try again; your details are still in the form.", "network", true, "network");
    xhr.ontimeout = () => fail("The request took too long. Try again; your details are still in the form.", "network", true, "network");
    xhr.onabort = () => done();
    xhr.onload = () => {
      const data = (xhr.response ?? {}) as { ok?: boolean; message?: string; errors?: QuoteFieldErrors; reference?: string; notified?: boolean; duplicate?: boolean; retryable?: boolean };
      if (xhr.status >= 200 && xhr.status < 300 && data.ok && data.reference) {
        setStatus({ type: "success", reference: data.reference, message: data.message ?? "", notified: Boolean(data.notified), duplicate: Boolean(data.duplicate), service: submission.service });
        track({ name: "quote_submitted", service: submission.service, customerType: submission.customerType, fileCount: files.length, duplicate: Boolean(data.duplicate) });
        sessionRef.current = "";
        done();
        return;
      }
      if (xhr.status === 503) return fail(data.message ?? "Quote requests are paused at the moment.", "offline", false, "offline");
      if (xhr.status === 429) return fail(data.message ?? "Too many requests. Please wait a few minutes and try again.", "rate_limited", true, "rate_limited");
      if (xhr.status === 400 || xhr.status === 413) {
        setErrors(data.errors ?? {});
        return fail(data.message ?? "Please correct the highlighted fields.", "validation", false, "validation");
      }
      fail(data.message ?? "Something went wrong on our side. Nothing was submitted; please try again.", "server", true, "server");
    };
    xhr.send(body);
  }

  function reset() {
    setValues({ ...emptyQuote(initialService, initialCustomerType), portfolioRef: initialPortfolio?.ref ?? "", portfolioTitle: initialPortfolio?.title ?? "" });
    setFiles([]);
    setErrors({});
    setStatus({ type: "idle" });
    setStep(1);
  }

  const serviceTitle = services.find((s) => s.id === values.service)?.title ?? "your service";

  if (status.type === "success") {
    return (
      <div className="bg-card p-6 sm:p-8">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-success">Request received</p>
        <h2 ref={successRef} tabIndex={-1} className="mt-3 text-2xl font-semibold outline-none">
          Your reference is <span className="whitespace-nowrap">{status.reference}</span>
        </h2>
        <p className="mt-3 leading-7 text-ink-soft">{status.message}</p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-stone">Service</dt>
            <dd className="font-medium">{services.find((s) => s.id === status.service)?.title ?? status.service}</dd>
          </div>
          <div>
            <dt className="text-stone">Confirmation email</dt>
            <dd className="font-medium">{status.notified ? "Sent to the address you gave" : "Not sent automatically; keep this reference"}</dd>
          </div>
        </dl>
        <div className="mt-6 rounded-sm border border-line bg-warm p-4 text-sm leading-6 text-ink-soft">
          <p className="font-semibold text-charcoal">What happens next</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>We read the request and ask for anything missing.</li>
            <li>You receive an itemised quotation with timing and payment terms.</li>
            <li>Work starts after you approve the quotation and the proof.</li>
          </ol>
          {config.responseStatement ? <p className="mt-2">{config.responseStatement}</p> : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={reset}>
            Send another request
          </Button>
          <Link href="/how-it-works" className="inline-flex min-h-12 items-center text-sm font-semibold text-blue hover:underline">
            How ordering works
          </Link>
        </div>
      </div>
    );
  }

  const errorEntries = Object.entries(errors).filter(([, v]) => v) as [keyof QuoteFieldErrors, string][];
  const digitizing = isDigitizing(values.service);
  const vector = isVector(values.service);
  const logo = isLogoDesign(values.service);
  const physical = isPhysical(values.service);
  const apparel = isApparel(values.service);
  const hats = values.service === "custom-hats";
  const patches = values.service === "custom-patches";
  const needsSize = digitizing || vector || physical;
  const rows = parseRows(values.rows);
  const opts = serviceOptions;
  const maxDim = values.unit === "mm" ? dimensionLimits.max.mm : dimensionLimits.max.in;
  const today = todayIso();

  return (
    <form
      id="quote-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1) goNext();
        else submit();
      }}
      noValidate
      className="bg-card p-5 sm:p-8"
      aria-describedby={`${uid}-intro`}
    >
      <div className="flex items-center justify-between gap-4">
        <p id={`${uid}-intro`} className="text-sm text-stone">
          Step {step} of 2 · {step === 1 ? "About you and the service" : `Details for ${serviceTitle}`}
        </p>
        <ol className="flex gap-1.5" aria-hidden>
          <li className={cn("h-1.5 w-8 rounded-full", step >= 1 ? "bg-blue" : "bg-line")} />
          <li className={cn("h-1.5 w-8 rounded-full", step >= 2 ? "bg-blue" : "bg-line")} />
        </ol>
      </div>

      {initialPortfolio ? (
        <p className="mt-4 rounded-sm border border-line bg-warm px-4 py-3 text-sm leading-6 text-ink-soft">
          Quoting a project similar to <strong className="text-charcoal">{initialPortfolio.title}</strong>. We will use it as the reference point.
        </p>
      ) : null}

      {/* Error summary: focused after failed validation; links jump to fields. */}
      <div ref={summaryRef} tabIndex={-1} className="mt-4 outline-none" aria-live="assertive" aria-atomic="true">
        {status.type === "error" ? (
          <div className="rounded-sm border border-error/40 bg-error/10 px-4 py-3 text-sm text-charcoal">
            <p className="font-semibold text-error">{status.message}</p>
            {status.kind === "offline" ? (
              <p className="mt-2 leading-6">
                Please use the{" "}
                <Link href="/contact" className="font-semibold text-blue underline underline-offset-2">
                  contact page
                </Link>{" "}
                instead. Your details stay in this form if you would rather wait and try again.
              </p>
            ) : null}
            {errorEntries.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errorEntries.map(([key, message]) => (
                  <li key={key}>
                    {key === "form" ? (
                      <span>{message}</span>
                    ) : (
                      <a href={`#${uid}-${summaryTargets[key] ?? key}`} className="underline underline-offset-2">
                        {labels[key] ?? key}: {message}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            {status.retryable && step === 2 ? (
              <div className="mt-3">
                <Button type="button" variant="secondary" className="min-h-10 px-4 text-[0.78rem]" onClick={() => void send(withSession(values))}>
                  Try again
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Asynchronous status for assistive tech */}
      <p className="sr-only" role="status" aria-live="polite">
        {status.type === "uploading" ? `Uploading file ${status.index} of ${status.total}.` : status.type === "submitting" ? `Sending your request, ${status.progress}% complete.` : ""}
      </p>

      {/* Honeypot: hidden from users and assistive tech */}
      <div className="hidden" aria-hidden>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      {step === 1 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <h2 ref={stepHeadingRef} tabIndex={-1} className="text-lg font-semibold outline-none sm:col-span-2">
            About you
          </h2>
          <ChoiceGroup
            uid={uid}
            id="customerType"
            legend="I am ordering as"
            options={customerTypes.map((t) => (t === "Business" ? "A business, shop or organisation" : "An individual"))}
            value={values.customerType === "Business" ? "A business, shop or organisation" : "An individual"}
            onChange={(v) => {
              const type: CustomerType = v.startsWith("A business") ? "Business" : "Individual";
              update("customerType", type);
              track({ name: "customer_type_selected", customerType: type });
            }}
            required
            error={errors.customerType}
            className="sm:col-span-2"
          />
          <Field uid={uid} id="name" label="Full name" error={errors.name} required>
            {(p) => <input {...p} autoComplete="name" className={inputClass(errors.name)} value={values.name} onChange={(e) => update("name", e.target.value)} />}
          </Field>
          {values.customerType === "Business" ? (
            <Field uid={uid} id="company" label="Business name" error={errors.company} required>
              {(p) => <input {...p} autoComplete="organization" className={inputClass(errors.company)} value={values.company} onChange={(e) => update("company", e.target.value)} />}
            </Field>
          ) : (
            <div className="hidden sm:block" />
          )}
          <Field uid={uid} id="email" label="Email" error={errors.email} required>
            {(p) => <input {...p} type="email" inputMode="email" autoComplete="email" className={inputClass(errors.email)} value={values.email} onChange={(e) => update("email", e.target.value)} />}
          </Field>
          <Field uid={uid} id="phone" label="Phone or WhatsApp" hint="Include the country code, for example +1 or +44." error={errors.phone} required={values.contactMethod !== "Email"}>
            {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" className={inputClass(errors.phone)} value={values.phone} onChange={(e) => update("phone", e.target.value)} />}
          </Field>
          <CountrySelect
            uid={uid}
            code={values.countryCode}
            otherName={values.countryName}
            onCode={(v) => update("countryCode", v)}
            onOtherName={(v) => update("countryName", v)}
            errorCode={errors.countryCode}
            errorName={errors.countryName}
            hint={isPhysical(values.service) ? "Products ship to this country." : undefined}
          />
          <Field uid={uid} id="contactMethod" label="Reply by" error={errors.contactMethod} required>
            {(p) => (
              <select {...p} className={inputClass(errors.contactMethod)} value={values.contactMethod} onChange={(e) => update("contactMethod", e.target.value)}>
                {contactMethods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            )}
          </Field>
          <Field uid={uid} id="service" label="Service" error={errors.service} required className="sm:col-span-2">
            {(p) => (
              <select
                {...p}
                className={inputClass(errors.service)}
                value={values.service}
                onChange={(e) => {
                  update("service", e.target.value);
                  update("productType", "");
                  update("placements", "");
                  update("formatNeeded", "");
                  if (e.target.value) track({ name: "service_selected", service: e.target.value });
                }}
              >
                <option value="">Select a service</option>
                <optgroup label="Digitizing and artwork (you receive files)">
                  {services.filter((s) => s.route === "digitizing").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Custom products (shipped to you)">
                  {services.filter((s) => s.route === "products").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            )}
          </Field>
          <Field uid={uid} id="previousReference" label="Previous quote or order reference" hint="For repeat orders. We reuse the approved file and specification." error={errors.previousReference} className="sm:col-span-2 sm:max-w-sm">
            {(p) => <input {...p} autoComplete="off" className={inputClass(errors.previousReference)} value={values.previousReference} onChange={(e) => update("previousReference", e.target.value)} placeholder="e.g. SC-260912-S4HJ" />}
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              Continue to project details
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <h2 ref={stepHeadingRef} tabIndex={-1} className="text-lg font-semibold outline-none sm:col-span-2">
            {serviceTitle}: project details
          </h2>

          {/* Embroidery digitizing */}
          {digitizing ? (
            <>
              <Field uid={uid} id="placement" label="Placement" hint="Where the design will be sewn, e.g. left chest, cap front, jacket back, patch." error={errors.placement} required>
                {(p) => <input {...p} className={inputClass(errors.placement)} value={values.placement} onChange={(e) => update("placement", e.target.value)} />}
              </Field>
              <Field uid={uid} id="fabric" label="Fabric or material" hint="e.g. piqué polo, twill cap, fleece, leather patch." error={errors.fabric} required>
                {(p) => <input {...p} className={inputClass(errors.fabric)} value={values.fabric} onChange={(e) => update("fabric", e.target.value)} />}
              </Field>
              <ChoiceGroup uid={uid} id="embroideryStyle" legend="Flat embroidery or 3D puff" options={opts["embroidery-digitizing"].embroideryStyle} value={values.embroideryStyle} onChange={(v) => update("embroideryStyle", v)} required error={errors.embroideryStyle} className="sm:col-span-2" />
              <Field uid={uid} id="formatNeeded" label="Machine format" error={errors.formatNeeded} required>
                {(p) => (
                  <select {...p} className={inputClass(errors.formatNeeded)} value={values.formatNeeded} onChange={(e) => update("formatNeeded", e.target.value)}>
                    <option value="">Select a format</option>
                    {opts["embroidery-digitizing"].formats.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field uid={uid} id="designCount" label="Number of designs" hint="Each placement or size is a separate file." error={errors.designCount} required>
                {(p) => <input {...p} type="number" inputMode="numeric" min={countLimits.min} max={countLimits.max} step={1} className={inputClass(errors.designCount)} value={values.designCount} onChange={(e) => update("designCount", e.target.value)} />}
              </Field>
            </>
          ) : null}

          {/* Vector tracing */}
          {vector ? (
            <>
              <Field uid={uid} id="intendedUse" label="Intended use" error={errors.intendedUse} required>
                {(p) => (
                  <select {...p} className={inputClass(errors.intendedUse)} value={values.intendedUse} onChange={(e) => update("intendedUse", e.target.value)}>
                    <option value="">Select a use</option>
                    {opts["vector-tracing"].intendedUse.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field uid={uid} id="formatNeeded" label="Format needed" error={errors.formatNeeded} required>
                {(p) => (
                  <select {...p} className={inputClass(errors.formatNeeded)} value={values.formatNeeded} onChange={(e) => update("formatNeeded", e.target.value)}>
                    <option value="">Select a format</option>
                    {opts["vector-tracing"].formats.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field uid={uid} id="colorCount" label="Approximate colour count" error={errors.colorCount}>
                {(p) => <input {...p} type="number" inputMode="numeric" min={countLimits.min} max={countLimits.max} step={1} className={inputClass(errors.colorCount)} value={values.colorCount} onChange={(e) => update("colorCount", e.target.value)} />}
              </Field>
              <div className="hidden sm:block" />
              <ChoiceGroup uid={uid} id="fontsEditable" legend="Must fonts remain editable?" options={opts["vector-tracing"].fontsEditable} value={values.fontsEditable} onChange={(v) => update("fontsEditable", v)} required error={errors.fontsEditable} className="sm:col-span-2" />
              <ChoiceGroup uid={uid} id="reproductionMode" legend="Exact reproduction or cleaned-up redraw?" options={opts["vector-tracing"].reproductionMode} value={values.reproductionMode} onChange={(v) => update("reproductionMode", v)} required error={errors.reproductionMode} className="sm:col-span-2" />
            </>
          ) : null}

          {/* Logo design */}
          {logo ? (
            <>
              <Field uid={uid} id="wording" label="Exact wording" hint="Name, tagline and abbreviations, spelled as they should appear." error={errors.wording} required className="sm:col-span-2">
                {(p) => <input {...p} className={inputClass(errors.wording)} value={values.wording} onChange={(e) => update("wording", e.target.value)} />}
              </Field>
              <Field uid={uid} id="industry" label="Industry or type of organisation" hint="e.g. landscaping company, youth football club, coffee roaster." error={errors.industry} required>
                {(p) => <input {...p} className={inputClass(errors.industry)} value={values.industry} onChange={(e) => update("industry", e.target.value)} />}
              </Field>
              <Field uid={uid} id="audience" label="Who is it for?" hint="Your customers, members or players." error={errors.audience} required>
                {(p) => <input {...p} className={inputClass(errors.audience)} value={values.audience} onChange={(e) => update("audience", e.target.value)} />}
              </Field>
              <Field uid={uid} id="requiredUses" label="Where will it be used?" hint="e.g. caps, polos, patches, signage, website." error={errors.requiredUses} required className="sm:col-span-2">
                {(p) => <input {...p} className={inputClass(errors.requiredUses)} value={values.requiredUses} onChange={(e) => update("requiredUses", e.target.value)} />}
              </Field>
              <ChoiceGroup uid={uid} id="styleDirection" legend="Style direction" options={opts["custom-logo-design"].styleDirection} value={values.styleDirection} onChange={(v) => update("styleDirection", v)} required error={errors.styleDirection} className="sm:col-span-2" />
              <Field uid={uid} id="colors" label="Colour preferences" hint="Colours to use or avoid; thread colours if you already know them." error={errors.colors} className="sm:col-span-2">
                {(p) => <input {...p} className={inputClass(errors.colors)} value={values.colors} onChange={(e) => update("colors", e.target.value)} />}
              </Field>
              <ChoiceGroup uid={uid} id="deliverables" legend="Required deliverables" options={opts["custom-logo-design"].deliverables} value={values.deliverables} onChange={(v) => update("deliverables", v)} multiple required error={errors.deliverables} className="sm:col-span-2" />
              <Field uid={uid} id="styleReferences" label="Reference material" hint="Describe logos you like or dislike, or paste links. You can also attach reference images below." error={errors.styleReferences} className="sm:col-span-2">
                {(p) => <textarea {...p} rows={3} className={inputClass(errors.styleReferences)} value={values.styleReferences} onChange={(e) => update("styleReferences", e.target.value)} />}
              </Field>
            </>
          ) : null}

          {/* Physical products */}
          {physical ? (
            <>
              <Field uid={uid} id="productType" label={patches ? "Patch type" : hats ? "Cap style" : "Garment type"} error={errors.productType} required>
                {(p) => (
                  <select {...p} className={inputClass(errors.productType)} value={values.productType} onChange={(e) => update("productType", e.target.value)}>
                    <option value="">Select</option>
                    {(opts[values.service as keyof typeof opts] as { productType: readonly string[] }).productType.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field uid={uid} id="quantity" label="Total quantity" hint={patches ? "All variants together." : "All sizes and colours together."} error={errors.quantity} required>
                {(p) => <input {...p} type="number" inputMode="numeric" min={quantityLimits.min} max={quantityLimits.max} step={1} className={inputClass(errors.quantity)} value={values.quantity} onChange={(e) => update("quantity", e.target.value)} />}
              </Field>
              <RowsEditor
                uid={uid}
                id="rows"
                legend={patches ? "Patch variants" : hats ? "Colour breakdown" : "Size and colour breakdown"}
                hint={patches ? "Add a row per variant if you need more than one design, size or colourway." : hats ? "Add a row per cap colour if the order is mixed." : "Add a row per size, e.g. M / Navy / 10. Leave empty if you do not know yet."}
                labels={patches ? { label: "Variant (design or size)", color: "Colourway or notes", quantity: "Qty" } : hats ? { label: "Cap colour", color: "Notes", quantity: "Qty" } : { label: "Size", color: "Garment colour", quantity: "Qty" }}
                rows={rows}
                onChange={(next) => update("rows", stringifyRows(next))}
                error={errors.rows}
                addLabel={patches ? "Add a variant" : "Add a row"}
              />
              {apparel ? (
                <Field uid={uid} id="garmentColors" label="Garment colour or colours" hint="e.g. navy and white, or list per size above." error={errors.garmentColors} required className="sm:col-span-2">
                  {(p) => <input {...p} className={inputClass(errors.garmentColors)} value={values.garmentColors} onChange={(e) => update("garmentColors", e.target.value)} />}
                </Field>
              ) : null}
              {patches ? (
                <>
                  <Field uid={uid} id="shape" label="Shape" hint="e.g. circle, shield, rectangle or custom shape following the artwork." error={errors.shape} className="sm:col-span-2">
                    {(p) => <input {...p} className={inputClass(errors.shape)} value={values.shape} onChange={(e) => update("shape", e.target.value)} />}
                  </Field>
                  <ChoiceGroup uid={uid} id="backing" legend="Backing type" options={opts["custom-patches"].backing} value={values.backing} onChange={(v) => update("backing", v)} required error={errors.backing} className="sm:col-span-2" />
                  <ChoiceGroup uid={uid} id="border" legend="Border finish" options={opts["custom-patches"].border} value={values.border} onChange={(v) => update("border", v)} required error={errors.border} className="sm:col-span-2" />
                </>
              ) : null}
              {hats ? (
                <>
                  <ChoiceGroup uid={uid} id="decoration" legend="Decoration type" options={opts["custom-hats"].decoration} value={values.decoration} onChange={(v) => update("decoration", v)} required error={errors.decoration} className="sm:col-span-2" />
                  <ChoiceGroup uid={uid} id="placements" legend="Decoration locations" options={opts["custom-hats"].placements} value={values.placements} onChange={(v) => update("placements", v)} multiple required error={errors.placements} className="sm:col-span-2" />
                  <ChoiceGroup uid={uid} id="supplyMode" legend="Who supplies the caps?" options={opts["custom-hats"].supplyMode} value={values.supplyMode} onChange={(v) => update("supplyMode", v)} required error={errors.supplyMode} className="sm:col-span-2" />
                </>
              ) : null}
              {apparel ? (
                <>
                  <ChoiceGroup uid={uid} id="placements" legend="Decoration locations" options={(opts[values.service as "embroidered-apparel" | "screen-printing"]).placements} value={values.placements} onChange={(v) => update("placements", v)} multiple required error={errors.placements} className="sm:col-span-2" />
                  <ChoiceGroup uid={uid} id="supplyMode" legend="Who supplies the garments?" options={(opts[values.service as "embroidered-apparel" | "screen-printing"]).supplyMode} value={values.supplyMode} onChange={(v) => update("supplyMode", v)} required error={errors.supplyMode} className="sm:col-span-2" />
                </>
              ) : null}
            </>
          ) : null}

          {/* Finished / design size */}
          {needsSize ? (
            <fieldset id={`${uid}-width`} className="min-w-0 sm:col-span-2" aria-describedby={errors.width ? `${uid}-width-error` : undefined} aria-invalid={errors.width ? true : undefined}>
              <legend className="text-sm font-medium text-charcoal">
                {patches ? "Patch size" : physical ? "Design size" : "Finished size"}
                {!vector ? (
                  <>
                    <span className="text-error" aria-hidden>
                      {" "}
                      *
                    </span>
                    <span className="sr-only"> (required unless size is not decided)</span>
                  </>
                ) : (
                  <span className="font-normal text-stone"> (optional)</span>
                )}
              </legend>
              <div className={cn("mt-2 grid grid-cols-[1fr_1fr_5.5rem] gap-2 sm:max-w-md", values.sizeUndecided && "opacity-60")}>
                <div>
                  <label htmlFor={`${uid}-width-input`} className="block text-xs font-medium text-ink-soft">
                    Width
                  </label>
                  <input id={`${uid}-width-input`} name="width" type="number" inputMode="decimal" min={dimensionLimits.min} max={maxDim} step={0.01} disabled={values.sizeUndecided} className={inputClass(errors.width, "mt-1")} value={values.width} onChange={(e) => update("width", e.target.value)} placeholder={values.unit === "mm" ? "90" : "3.5"} />
                </div>
                <div>
                  <label htmlFor={`${uid}-height-input`} className="block text-xs font-medium text-ink-soft">
                    Height
                  </label>
                  <input id={`${uid}-height-input`} name="height" type="number" inputMode="decimal" min={dimensionLimits.min} max={maxDim} step={0.01} disabled={values.sizeUndecided} className={inputClass(errors.width, "mt-1")} value={values.height} onChange={(e) => update("height", e.target.value)} placeholder={values.unit === "mm" ? "50" : "2"} />
                </div>
                <div>
                  <label htmlFor={`${uid}-unit`} className="block text-xs font-medium text-ink-soft">
                    Unit
                  </label>
                  <select id={`${uid}-unit`} name="unit" disabled={values.sizeUndecided} className={inputClass(errors.unit, "mt-1")} value={values.unit} onChange={(e) => update("unit", e.target.value)}>
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u === "in" ? "inches" : "mm"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="mt-3 flex items-start gap-3 text-sm leading-6">
                <input type="checkbox" name="sizeUndecided" checked={values.sizeUndecided} onChange={(e) => update("sizeUndecided", e.target.checked)} className="mt-1 h-4 w-4 accent-blue" />
                <span>Size not decided: please advise on the quote.</span>
              </label>
              {errors.width ? (
                <p id={`${uid}-width-error`} className="mt-1.5 text-sm text-error">
                  <span className="sr-only">Error: </span>
                  {errors.width}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {/* Rush (digital) */}
          {digitizing || vector ? (
            <Field uid={uid} id="rush" label="Rush request" hint="Rush availability and any surcharge are confirmed on the quotation." className="sm:max-w-sm">
              {(p) => (
                <select {...p} className={inputClass()} value={values.rush} onChange={(e) => update("rush", e.target.value)}>
                  <option>No</option>
                  <option>Yes, please prioritise</option>
                </select>
              )}
            </Field>
          ) : null}

          {/* Deadline */}
          <ChoiceGroup
            uid={uid}
            id="deadlineMode"
            legend="Timing"
            options={deadlineModes.map((m) => deadlineLabels[m])}
            value={values.deadlineMode ? deadlineLabels[values.deadlineMode as keyof typeof deadlineLabels] : ""}
            onChange={(label) => {
              const mode = deadlineModes.find((m) => deadlineLabels[m] === label) ?? "";
              update("deadlineMode", mode);
              if (mode === "flexible") update("deadlineDate", "");
            }}
            required
            error={errors.deadlineMode}
            hint="Requested dates are noted but are not confirmed until they appear on your written quotation."
            className="sm:col-span-2"
          />
          {values.deadlineMode && values.deadlineMode !== "flexible" ? (
            <Field uid={uid} id="deadlineDate" label={values.deadlineMode === "fixed" ? "Date needed in hand" : "Preferred date"} error={errors.deadlineDate} required className="sm:max-w-xs">
              {(p) => <input {...p} type="date" min={today} className={inputClass(errors.deadlineDate)} value={values.deadlineDate} onChange={(e) => update("deadlineDate", e.target.value)} />}
            </Field>
          ) : null}

          <Field uid={uid} id="budget" label="Budget range" error={errors.budget} className="sm:max-w-xs">
            {(p) => <input {...p} className={inputClass(errors.budget)} value={values.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. up to $500" />}
          </Field>

          <Field uid={uid} id="details" label="Project description" hint={logo ? "Tell us about the business and what the logo should say about it." : "Anything else we need: colours, thread or ink references, reorder notes."} error={errors.details} required className="sm:col-span-2">
            {(p) => <textarea {...p} rows={4} className={inputClass(errors.details)} value={values.details} onChange={(e) => update("details", e.target.value)} />}
          </Field>

          {/* Delivery (physical) */}
          {physical ? (
            <>
              <Field uid={uid} id="destinationCity" label="Delivery city or town" hint="Full street address is only needed once you order." error={errors.destinationCity} required>
                {(p) => <input {...p} autoComplete="shipping address-level2" className={inputClass(errors.destinationCity)} value={values.destinationCity} onChange={(e) => update("destinationCity", e.target.value)} />}
              </Field>
              <Field uid={uid} id="postalCode" label="Postal or ZIP code" error={errors.postalCode} required>
                {(p) => <input {...p} autoComplete="shipping postal-code" className={inputClass(errors.postalCode)} value={values.postalCode} onChange={(e) => update("postalCode", e.target.value)} />}
              </Field>
              <p className="text-sm text-ink-soft sm:col-span-2">
                Delivery country: <strong className="text-charcoal">{countryLabel(values)}</strong>.{" "}
                <button type="button" onClick={goBack} className="font-semibold text-blue underline-offset-2 hover:underline">
                  Change country
                </button>
              </p>
            </>
          ) : null}

          <FileList uid={uid} files={files} onAdd={addFiles} onRemove={removeFile} error={errors.artwork} disabled={busy} busy={busy} />

          {files.length ? (
            <label id={`${uid}-rights`} className="flex items-start gap-3 text-sm leading-6 sm:col-span-2">
              <input type="checkbox" name="rights" checked={values.rights} onChange={(e) => update("rights", e.target.checked)} className="mt-1 h-4 w-4 accent-blue" aria-invalid={errors.rights ? true : undefined} aria-describedby={errors.rights ? `${uid}-rights-error` : undefined} />
              <span>
                I confirm that I own or have permission to use any artwork or materials I submit. <span className="text-error" aria-hidden>*</span>
                <span className="sr-only"> (required)</span>
                {errors.rights ? (
                  <span id={`${uid}-rights-error`} className="block text-error">
                    <span className="sr-only">Error: </span>
                    {errors.rights}
                  </span>
                ) : null}
              </span>
            </label>
          ) : null}
          <label id={`${uid}-consent`} className="flex items-start gap-3 text-sm leading-6 sm:col-span-2">
            <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 h-4 w-4 accent-blue" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${uid}-consent-error` : undefined} />
            <span>
              Stitchcraft Studio may use these details and files to prepare my quote, as described in the{" "}
              <Link href="/privacy" className="font-semibold text-blue hover:underline">
                privacy policy
              </Link>
              . <span className="text-error" aria-hidden>*</span>
              <span className="sr-only"> (required)</span>
              {errors.consent ? (
                <span id={`${uid}-consent-error`} className="block text-error">
                  <span className="sr-only">Error: </span>
                  {errors.consent}
                </span>
              ) : null}
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2">
            <input type="checkbox" name="marketing" checked={values.marketing} onChange={(e) => update("marketing", e.target.checked)} className="mt-1 h-4 w-4 accent-blue" />
            <span>Optional: email me occasional studio updates. Separate from quote messages; unsubscribe any time.</span>
          </label>

          {config.spamCheck === "turnstile" && config.turnstileSiteKey ? <Turnstile siteKey={config.turnstileSiteKey} onToken={onToken} /> : null}

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={goBack} disabled={busy}>
              Back
            </Button>
            <Button type="submit" disabled={busy} aria-disabled={busy}>
              {status.type === "uploading" ? `Uploading ${status.index} of ${status.total}…` : status.type === "submitting" ? "Sending…" : "Send quote request"}
            </Button>
          </div>
          {status.type === "submitting" && files.length && config.uploadMode === "inline" ? (
            <div className="sm:col-span-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={status.progress} aria-label="Upload progress">
                <div className="h-full bg-blue" style={{ width: `${status.progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-stone">Uploading {status.progress}%</p>
            </div>
          ) : null}
        </div>
      )}
    </form>
  );
}

function safeOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

function countryLabel(values: QuotePayload) {
  return countryName(values.countryCode, values.countryName) || "not selected";
}
