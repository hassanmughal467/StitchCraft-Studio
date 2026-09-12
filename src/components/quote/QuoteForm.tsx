"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import {
  contactMethods,
  countries,
  customerTypes,
  emptyQuote,
  isDigital,
  isLogoDesign,
  isPhysical,
  materialOptions,
  productTypes,
  stepOneFields,
  units,
  validateArtworkFile,
  validateQuote,
  type QuoteFieldErrors,
  type QuotePayload,
} from "@/lib/quote";
import { services } from "@/lib/services";
import { fileUpload } from "@/lib/site";
import { cn, formatFileSize } from "@/lib/utils";

type Status =
  | { type: "idle" }
  | { type: "submitting"; progress: number }
  | { type: "success"; reference: string; message: string; notified: boolean; duplicate: boolean }
  | { type: "error"; message: string };

type Props = {
  initialService?: string;
  initialCustomerType?: string;
  /** Whether the server has a persistent store configured. */
  available: boolean;
};

const labels: Partial<Record<keyof QuoteFieldErrors, string>> = {
  name: "Full name",
  company: "Business name",
  email: "Email",
  phone: "Phone",
  country: "Country",
  contactMethod: "Preferred contact",
  service: "Service",
  width: "Finished size",
  unit: "Unit",
  formatNeeded: "File format",
  placement: "Placement / material",
  wording: "Exact wording",
  audience: "Audience",
  requiredUses: "Where it will be used",
  productType: "Product",
  quantity: "Quantity",
  destination: "Delivery address",
  postalCode: "Postal code",
  deadline: "Required date",
  details: "Project description",
  artwork: "Artwork upload",
  rights: "Artwork rights",
  consent: "Consent",
  form: "Form",
};

export function QuoteForm({ initialService = "", initialCustomerType = "Business", available }: Props) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<QuotePayload>(() => emptyQuote(initialService, initialCustomerType));
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const uid = useId();

  // Session id for server-side idempotency. Created lazily on the client so one form session = one saved quote.
  const sessionRef = useRef("");
  const session = () => (sessionRef.current ||= crypto.randomUUID());

  useEffect(() => {
    track({ name: "quote_start", service: initialService || undefined, customerType: initialCustomerType });
    if (!available) track({ name: "quote_unavailable" });
  }, [initialService, initialCustomerType, available]);

  function withSession(current: QuotePayload): QuotePayload {
    return {
      ...current,
      submissionId: session(),
      sourcePath: typeof window === "undefined" ? "" : window.location.pathname + window.location.search,
      referrer: typeof document === "undefined" || !document.referrer ? "" : new URL(document.referrer).origin,
    };
  }

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function focusSummary() {
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  function goNext() {
    const all = validateQuote({ ...withSession(values), details: "x", deadline: "2099-01-01", rights: true, consent: true, width: "1", height: "1", formatNeeded: "x", placement: "x", productType: "x", quantity: "1", destination: "x", postalCode: "x", wording: "x", audience: "x", requiredUses: "x" });
    const stepErrors: QuoteFieldErrors = {};
    stepOneFields.forEach((key) => {
      if (all[key]) stepErrors[key] = all[key];
    });
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      setStatus({ type: "error", message: "Please correct the highlighted fields." });
      track({ name: "quote_error", code: "step1_validation" });
      focusSummary();
      return;
    }
    setErrors({});
    setStatus({ type: "idle" });
    setStep(2);
    track({ name: "quote_step", step: 2, service: values.service });
    requestAnimationFrame(() => document.getElementById(`${uid}-step2`)?.focus());
  }

  function onFileChange(next: File | null) {
    setFile(next);
    const error = validateArtworkFile(next ? { name: next.name, size: next.size } : null);
    setErrors((current) => {
      const copy = { ...current };
      if (error) copy.artwork = error;
      else delete copy.artwork;
      return copy;
    });
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors((current) => {
      const copy = { ...current };
      delete copy.artwork;
      return copy;
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || status.type === "submitting") return;
    const submission = withSession(values);
    const nextErrors = validateQuote(submission);
    const fileError = validateArtworkFile(file ? { name: file.name, size: file.size } : null);
    if (fileError) nextErrors.artwork = fileError;
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus({ type: "error", message: "Please correct the highlighted fields." });
      track({ name: "quote_error", code: "step2_validation" });
      focusSummary();
      return;
    }
    setStatus({ type: "submitting", progress: 0 });
    const body = new FormData();
    Object.entries(submission).forEach(([key, value]) => body.append(key, String(value)));
    if (file) body.append("artwork", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", "/api/quote");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setStatus({ type: "submitting", progress: Math.round((e.loaded / e.total) * 100) });
    };
    xhr.onerror = () => {
      setStatus({ type: "error", message: "The request could not be sent. Check your connection and try again; your details are still in the form." });
      track({ name: "quote_error", code: "network" });
      focusSummary();
    };
    xhr.onload = () => {
      const data = (xhr.response ?? {}) as { ok?: boolean; message?: string; errors?: QuoteFieldErrors; reference?: string; notified?: boolean; duplicate?: boolean };
      if (xhr.status >= 200 && xhr.status < 300 && data.ok && data.reference) {
        setStatus({ type: "success", reference: data.reference, message: data.message ?? "", notified: Boolean(data.notified), duplicate: Boolean(data.duplicate) });
        track({ name: "quote_submitted", service: values.service, reference: data.reference, duplicate: Boolean(data.duplicate) });
        // Fresh session id so a second, different request is not treated as a duplicate.
        sessionRef.current = "";
        setValues(emptyQuote(initialService, initialCustomerType));
        setFile(null);
        setErrors({});
        setStep(1);
        return;
      }
      if (xhr.status === 503) {
        setStatus({ type: "error", message: data.message ?? "Quote requests are temporarily unavailable." });
      } else {
        setErrors(data.errors ?? {});
        setStatus({ type: "error", message: data.message ?? "The request could not be sent." });
      }
      track({ name: "quote_error", code: String(xhr.status) });
      focusSummary();
    };
    xhr.send(body);
  }

  if (status.type === "success") {
    return (
      <div className="bg-card p-6 sm:p-8" role="status" aria-live="polite">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-success">Request received</p>
        <h2 className="mt-3 text-2xl font-semibold">Your reference is {status.reference}</h2>
        <p className="mt-3 leading-7 text-ink-soft">{status.message}</p>
        {!status.notified ? (
          <p className="mt-3 text-sm leading-6 text-ink-soft">Please note this reference; a confirmation email has not been sent.</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => setStatus({ type: "idle" })}>
            Send another request
          </Button>
          <Link href="/how-it-works" className="inline-flex min-h-12 items-center text-sm font-semibold text-blue hover:underline">
            What happens next
          </Link>
        </div>
      </div>
    );
  }

  const errorEntries = Object.entries(errors).filter(([, v]) => v) as [keyof QuoteFieldErrors, string][];
  const digital = isDigital(values.service) && !isLogoDesign(values.service);
  const logo = isLogoDesign(values.service);
  const physical = isPhysical(values.service);
  const serviceTitle = services.find((s) => s.id === values.service)?.title ?? "your service";

  return (
    <form id="quote-form" onSubmit={onSubmit} noValidate className="bg-card p-5 sm:p-8" aria-describedby={`${uid}-intro`}>
      {!available ? (
        <div className="mb-5 rounded-sm border border-copper/40 bg-copper/10 p-4 text-sm leading-6 text-charcoal" role="status">
          Online quote requests are temporarily unavailable while we finish setting up the intake system. Please check back shortly.
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-4">
        <p id={`${uid}-intro`} className="text-sm text-stone">
          Step {step} of 2 · {step === 1 ? "About you and the service" : `Details for ${serviceTitle}`}
        </p>
        <ol className="flex gap-1.5" aria-hidden>
          <li className={cn("h-1.5 w-8 rounded-full", step >= 1 ? "bg-blue" : "bg-line")} />
          <li className={cn("h-1.5 w-8 rounded-full", step >= 2 ? "bg-blue" : "bg-line")} />
        </ol>
      </div>

      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="mt-4 outline-none">
        {status.type === "error" ? (
          <div className="rounded-sm border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            <p className="font-semibold">{status.message}</p>
            {errorEntries.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errorEntries.map(([key, message]) => (
                  <li key={key}>
                    {key === "form" || key === "rights" || key === "consent" ? (
                      <span>
                        {labels[key]}: {message}
                      </span>
                    ) : (
                      <a href={`#${uid}-${key}`} className="underline underline-offset-2">
                        {labels[key] ?? key}: {message}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Honeypot: hidden from users and assistive tech */}
      <div className="hidden" aria-hidden>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      {step === 1 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium">I am ordering as</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {customerTypes.map((type) => (
                <label key={type} className={cn("inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border px-4 text-sm", values.customerType === type ? "border-blue bg-blue/5" : "border-line")}>
                  <input type="radio" name="customerType" value={type} checked={values.customerType === type} onChange={() => update("customerType", type)} className="accent-blue" />
                  {type === "Business" ? "A business or shop" : "An individual"}
                </label>
              ))}
            </div>
          </fieldset>
          <Field uid={uid} id="name" label="Full name" error={errors.name} required>
            <input id={`${uid}-name`} name="name" autoComplete="name" className={inputClass(errors.name)} value={values.name} onChange={(e) => update("name", e.target.value)} aria-invalid={Boolean(errors.name)} />
          </Field>
          {values.customerType === "Business" ? (
            <Field uid={uid} id="company" label="Business name" error={errors.company} required>
              <input id={`${uid}-company`} name="company" autoComplete="organization" className={inputClass(errors.company)} value={values.company} onChange={(e) => update("company", e.target.value)} aria-invalid={Boolean(errors.company)} />
            </Field>
          ) : (
            <div className="hidden sm:block" />
          )}
          <Field uid={uid} id="email" label="Email" error={errors.email} required>
            <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" className={inputClass(errors.email)} value={values.email} onChange={(e) => update("email", e.target.value)} aria-invalid={Boolean(errors.email)} />
          </Field>
          <Field uid={uid} id="phone" label="Phone / WhatsApp" hint="Include the country code." error={errors.phone} required={values.contactMethod !== "Email"}>
            <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass(errors.phone)} value={values.phone} onChange={(e) => update("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} />
          </Field>
          <Field uid={uid} id="country" label="Country" error={errors.country} required>
            <select id={`${uid}-country`} name="country" autoComplete="country-name" className={inputClass(errors.country)} value={values.country} onChange={(e) => update("country", e.target.value)}>
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field uid={uid} id="contactMethod" label="Reply by" error={errors.contactMethod} required>
            <select id={`${uid}-contactMethod`} name="contactMethod" className={inputClass(errors.contactMethod)} value={values.contactMethod} onChange={(e) => update("contactMethod", e.target.value)}>
              {contactMethods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field uid={uid} id="service" label="Service" error={errors.service} required>
              <select
                id={`${uid}-service`}
                name="service"
                className={inputClass(errors.service)}
                value={values.service}
                onChange={(e) => {
                  update("service", e.target.value);
                  update("productType", "");
                  update("materials", "");
                  if (e.target.value) track({ name: "service_selected", service: e.target.value });
                }}
                aria-invalid={Boolean(errors.service)}
              >
                <option value="">Select a service</option>
                <optgroup label="Digitizing & artwork (files)">
                  {services.filter((s) => s.route === "digitizing").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Custom products (shipped)">
                  {services.filter((s) => s.route === "products").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Button type="button" onClick={goNext} className="w-full sm:w-auto">
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <h2 id={`${uid}-step2`} tabIndex={-1} className="text-lg font-semibold outline-none sm:col-span-2">
            {serviceTitle} details
          </h2>

          {digital ? (
            <>
              <div className="grid grid-cols-[1fr_1fr_5rem] gap-2 sm:col-span-2 sm:max-w-md">
                <Field uid={uid} id="width" label="Width" error={errors.width} required>
                  <input id={`${uid}-width`} name="width" inputMode="decimal" className={inputClass(errors.width)} value={values.width} onChange={(e) => update("width", e.target.value)} placeholder="3.5" aria-invalid={Boolean(errors.width)} />
                </Field>
                <Field uid={uid} id="height" label="Height" required>
                  <input id={`${uid}-height`} name="height" inputMode="decimal" className={inputClass(errors.width)} value={values.height} onChange={(e) => update("height", e.target.value)} placeholder="2" />
                </Field>
                <Field uid={uid} id="unit" label="Unit" error={errors.unit}>
                  <select id={`${uid}-unit`} name="unit" className={inputClass(errors.unit)} value={values.unit} onChange={(e) => update("unit", e.target.value)}>
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field uid={uid} id="formatNeeded" label="File format needed" error={errors.formatNeeded} required hint={values.service === "embroidery-digitizing" ? "e.g. DST, PES, EXP, JEF, EMB" : "e.g. AI, EPS, SVG, PDF"}>
                <input id={`${uid}-formatNeeded`} name="formatNeeded" className={inputClass(errors.formatNeeded)} value={values.formatNeeded} onChange={(e) => update("formatNeeded", e.target.value)} aria-invalid={Boolean(errors.formatNeeded)} />
              </Field>
              <Field uid={uid} id="placement" label={values.service === "embroidery-digitizing" ? "Placement and fabric" : "Intended use"} error={errors.placement} required hint={values.service === "embroidery-digitizing" ? "e.g. left chest on pique polo, cap front, patch" : "e.g. screen print, signage, embroidery prep"}>
                <input id={`${uid}-placement`} name="placement" className={inputClass(errors.placement)} value={values.placement} onChange={(e) => update("placement", e.target.value)} aria-invalid={Boolean(errors.placement)} />
              </Field>
              <Field uid={uid} id="colors" label="Number of colors" error={errors.colors}>
                <input id={`${uid}-colors`} name="colors" inputMode="numeric" className={inputClass(errors.colors)} value={values.colors} onChange={(e) => update("colors", e.target.value)} />
              </Field>
              <Field uid={uid} id="rush" label="Rush request">
                <select id={`${uid}-rush`} name="rush" className={inputClass()} value={values.rush} onChange={(e) => update("rush", e.target.value)}>
                  <option>No</option>
                  <option>Yes, the date is firm</option>
                </select>
              </Field>
            </>
          ) : null}

          {logo ? (
            <>
              <Field uid={uid} id="wording" label="Exact wording" error={errors.wording} required hint="Name, tagline and any abbreviations, spelled as they should appear.">
                <input id={`${uid}-wording`} name="wording" className={inputClass(errors.wording)} value={values.wording} onChange={(e) => update("wording", e.target.value)} aria-invalid={Boolean(errors.wording)} />
              </Field>
              <Field uid={uid} id="audience" label="Who is it for?" error={errors.audience} required hint="Your customers, members or players.">
                <input id={`${uid}-audience`} name="audience" className={inputClass(errors.audience)} value={values.audience} onChange={(e) => update("audience", e.target.value)} aria-invalid={Boolean(errors.audience)} />
              </Field>
              <Field uid={uid} id="requiredUses" label="Where will it be used?" error={errors.requiredUses} required hint="e.g. caps, polos, patches, signage, website">
                <input id={`${uid}-requiredUses`} name="requiredUses" className={inputClass(errors.requiredUses)} value={values.requiredUses} onChange={(e) => update("requiredUses", e.target.value)} aria-invalid={Boolean(errors.requiredUses)} />
              </Field>
              <Field uid={uid} id="colors" label="Colors to keep or avoid" error={errors.colors}>
                <input id={`${uid}-colors`} name="colors" className={inputClass(errors.colors)} value={values.colors} onChange={(e) => update("colors", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field uid={uid} id="styleReferences" label="Style references" error={errors.styleReferences} hint="Describe logos you like or dislike, or paste links.">
                  <textarea id={`${uid}-styleReferences`} name="styleReferences" rows={3} className={inputClass(errors.styleReferences)} value={values.styleReferences} onChange={(e) => update("styleReferences", e.target.value)} />
                </Field>
              </div>
            </>
          ) : null}

          {physical ? (
            <>
              <Field uid={uid} id="productType" label={values.service === "custom-patches" ? "Patch type" : values.service === "custom-hats" ? "Cap style" : "Garment"} error={errors.productType} required>
                <select id={`${uid}-productType`} name="productType" className={inputClass(errors.productType)} value={values.productType} onChange={(e) => update("productType", e.target.value)} aria-invalid={Boolean(errors.productType)}>
                  <option value="">Select</option>
                  {(productTypes[values.service] ?? []).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field uid={uid} id="quantity" label="Total quantity" error={errors.quantity} required>
                <input id={`${uid}-quantity`} name="quantity" inputMode="numeric" className={inputClass(errors.quantity)} value={values.quantity} onChange={(e) => update("quantity", e.target.value)} aria-invalid={Boolean(errors.quantity)} />
              </Field>
              {values.service === "embroidered-apparel" || values.service === "screen-printing" ? (
                <div className="sm:col-span-2">
                  <Field uid={uid} id="sizes" label="Size breakdown" error={errors.sizes} hint="e.g. S 4, M 10, L 8, XL 3. Garment color per size if it varies.">
                    <input id={`${uid}-sizes`} name="sizes" className={inputClass(errors.sizes)} value={values.sizes} onChange={(e) => update("sizes", e.target.value)} />
                  </Field>
                </div>
              ) : null}
              <Field uid={uid} id="decorationSize" label={values.service === "custom-patches" ? "Patch size" : "Design size"} error={errors.decorationSize} hint="Width x height with units, e.g. 3 x 2 in">
                <input id={`${uid}-decorationSize`} name="decorationSize" className={inputClass(errors.decorationSize)} value={values.decorationSize} onChange={(e) => update("decorationSize", e.target.value)} />
              </Field>
              <Field uid={uid} id="placement" label={values.service === "custom-patches" ? "Shape" : "Decoration location"} error={errors.placement} hint={values.service === "custom-patches" ? "e.g. circle, shield, custom shape" : "e.g. left chest and full back"}>
                <input id={`${uid}-placement`} name="placement" className={inputClass(errors.placement)} value={values.placement} onChange={(e) => update("placement", e.target.value)} />
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-medium">{values.service === "custom-patches" ? "Backing and border" : values.service === "custom-hats" ? "Decoration" : "Placements"}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(materialOptions[values.service] ?? []).map((option) => {
                    const selected = values.materials.split("|").filter(Boolean);
                    const checked = selected.includes(option);
                    return (
                      <label key={option} className={cn("inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm", checked ? "border-blue bg-blue/5" : "border-line")}>
                        <input
                          type="checkbox"
                          className="accent-blue"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked ? [...selected, option] : selected.filter((s) => s !== option);
                            update("materials", next.join("|"));
                          }}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <Field uid={uid} id="destination" label="Delivery city or address" error={errors.destination} required>
                <input id={`${uid}-destination`} name="destination" autoComplete="shipping street-address" className={inputClass(errors.destination)} value={values.destination} onChange={(e) => update("destination", e.target.value)} aria-invalid={Boolean(errors.destination)} />
              </Field>
              <Field uid={uid} id="postalCode" label="Postal / ZIP code" error={errors.postalCode} required>
                <input id={`${uid}-postalCode`} name="postalCode" autoComplete="shipping postal-code" className={inputClass(errors.postalCode)} value={values.postalCode} onChange={(e) => update("postalCode", e.target.value)} aria-invalid={Boolean(errors.postalCode)} />
              </Field>
            </>
          ) : null}

          <Field uid={uid} id="deadline" label="Date you need this" error={errors.deadline} required>
            <input id={`${uid}-deadline`} name="deadline" type="date" className={inputClass(errors.deadline)} value={values.deadline} onChange={(e) => update("deadline", e.target.value)} aria-invalid={Boolean(errors.deadline)} />
          </Field>
          <Field uid={uid} id="budget" label="Budget range (optional)" error={errors.budget}>
            <input id={`${uid}-budget`} name="budget" className={inputClass(errors.budget)} value={values.budget} onChange={(e) => update("budget", e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field uid={uid} id="details" label="Project description" error={errors.details} required hint="Anything else we need: colors, fabric, reference numbers for reorders.">
              <textarea id={`${uid}-details`} name="details" rows={4} className={inputClass(errors.details)} value={values.details} onChange={(e) => update("details", e.target.value)} aria-invalid={Boolean(errors.details)} />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field uid={uid} id="artwork" label="Artwork upload (optional)" error={errors.artwork} hint={fileUpload.acceptLabel}>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  id={`${uid}-artwork`}
                  name="artwork"
                  type="file"
                  accept={fileUpload.accept.join(",")}
                  className="block max-w-full text-sm file:mr-3 file:min-h-10 file:cursor-pointer file:rounded-sm file:border file:border-line file:bg-warm file:px-3 file:text-sm file:font-medium"
                  onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                  aria-invalid={Boolean(errors.artwork)}
                />
              </div>
              {file ? (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
                  <span>
                    {file.name} · {formatFileSize(file.size)}
                  </span>
                  <button type="button" onClick={clearFile} className="font-semibold text-blue underline-offset-2 hover:underline">
                    Remove
                  </button>
                </div>
              ) : null}
              {status.type === "submitting" && file ? (
                <div className="mt-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={status.progress} aria-label="Upload progress">
                    <div className="h-full bg-blue transition-[width]" style={{ width: `${status.progress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-stone">Uploading {status.progress}%</p>
                </div>
              ) : null}
            </Field>
          </div>

          <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2">
            <input type="checkbox" name="rights" checked={values.rights} onChange={(e) => update("rights", e.target.checked)} className="mt-1 accent-blue" aria-invalid={Boolean(errors.rights)} />
            <span>
              I own this artwork or have permission to use it. <span className="text-error">*</span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2">
            <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 accent-blue" aria-invalid={Boolean(errors.consent)} />
            <span>
              Stitchcraft Studio may use these details and uploads to prepare my quote, as described in the{" "}
              <Link href="/privacy" className="font-semibold text-blue hover:underline">
                privacy policy
              </Link>
              . <span className="text-error">*</span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2">
            <input type="checkbox" name="marketing" checked={values.marketing} onChange={(e) => update("marketing", e.target.checked)} className="mt-1 accent-blue" />
            <span>Optional: email me occasional studio updates. Separate from quote messages; unsubscribe any time.</span>
          </label>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" disabled={!available || status.type === "submitting"}>
              {status.type === "submitting" ? "Sending…" : "Send quote request"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  uid,
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  uid: string;
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`${uid}-${id}`} className="block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-error" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p id={`${uid}-${id}-hint`} className="mt-1.5 text-xs text-stone">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${uid}-${id}-error`} className="mt-1.5 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(error?: string) {
  return cn("w-full min-h-11 rounded-sm border bg-warm px-3 py-2.5 text-base sm:text-sm", error ? "border-error" : "border-line");
}
