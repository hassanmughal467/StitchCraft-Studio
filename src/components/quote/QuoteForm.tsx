"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  contactMethods,
  countries,
  customerTypes,
  emptyQuote,
  isDigital,
  isPhysical,
  validateArtworkFile,
  validateQuote,
  type QuoteFieldErrors,
  type QuotePayload,
} from "@/lib/quote";
import { services } from "@/lib/services";
import { fileUpload } from "@/lib/site";
import { formatFileSize } from "@/lib/utils";

type Status =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function QuoteForm({ initialService = "" }: { initialService?: string }) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<QuotePayload>(emptyQuote(initialService));
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function goNext() {
    const next = validateQuote({ ...values, details: values.details || " ", deadline: values.deadline || "2099-01-01", rights: true, consent: true });
    const stepErrors: QuoteFieldErrors = {};
    if (step === 1) {
      ["customerType", "name", "company", "email", "country", "service"].forEach((key) => {
        const k = key as keyof QuotePayload;
        if (next[k]) stepErrors[k] = next[k];
      });
      if (values.customerType !== "Business") delete stepErrors.company;
    }
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      setStatus({ type: "error", message: "Please correct the highlighted fields." });
      return;
    }
    setStatus({ type: "idle" });
    setStep(2);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateQuote(values);
    const fileError = validateArtworkFile(file);
    if (fileError) nextErrors.artwork = fileError;
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus({ type: "error", message: "Please correct the highlighted fields." });
      return;
    }
    setStatus({ type: "submitting" });
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => body.append(key, String(value)));
    if (file) body.append("artwork", file);
    try {
      const response = await fetch("/api/quote", { method: "POST", body });
      const data = (await response.json()) as { ok: boolean; message: string; errors?: QuoteFieldErrors };
      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setStatus({ type: "error", message: data.message || "The request could not be sent." });
        return;
      }
      setValues(emptyQuote(initialService));
      setFile(null);
      setStep(1);
      setErrors({});
      setStatus({ type: "success", message: data.message });
    } catch {
      setStatus({ type: "error", message: "The request could not be sent. Check your connection and try again." });
    }
  }

  return (
    <form id="quote-form" onSubmit={onSubmit} noValidate className="bg-card p-6 sm:p-8">
      <p className="text-sm text-stone">Step {step} of 2 — files stay attached if a field needs a correction.</p>
      {step === 1 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium">Customer type</legend>
            <div className="mt-2 flex gap-4">
              {customerTypes.map((type) => (
                <label key={type} className="inline-flex items-center gap-2 text-sm">
                  <input type="radio" name="customerType" checked={values.customerType === type} onChange={() => update("customerType", type)} className="accent-blue" />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>
          <Field id="name" label="Full name" error={errors.name} required>
            <input id="name" className={inputClass(errors.name)} value={values.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          {values.customerType === "Business" ? (
            <Field id="company" label="Business name" error={errors.company} required>
              <input id="company" className={inputClass(errors.company)} value={values.company} onChange={(e) => update("company", e.target.value)} />
            </Field>
          ) : (
            <div />
          )}
          <Field id="email" label="Email" error={errors.email} required>
            <input id="email" type="email" className={inputClass(errors.email)} value={values.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field id="phone" label="Phone / WhatsApp (optional)" error={errors.phone}>
            <input id="phone" type="tel" className={inputClass(errors.phone)} value={values.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
          <Field id="country" label="Country" error={errors.country} required>
            <select id="country" className={inputClass(errors.country)} value={values.country} onChange={(e) => update("country", e.target.value)}>
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field id="service" label="Service" error={errors.service} required>
            <select id="service" className={inputClass(errors.service)} value={values.service} onChange={(e) => update("service", e.target.value)}>
              <option value="">Select a service</option>
              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {isDigital(values.service) ? (
            <>
              <Field id="width" label="Width" error={errors.width} required>
                <input id="width" className={inputClass(errors.width)} value={values.width} onChange={(e) => update("width", e.target.value)} placeholder="e.g. 3.5 in" />
              </Field>
              <Field id="height" label="Height" error={errors.height} required>
                <input id="height" className={inputClass(errors.height)} value={values.height} onChange={(e) => update("height", e.target.value)} />
              </Field>
              <Field id="formatNeeded" label="File format needed" error={errors.formatNeeded} required>
                <input id="formatNeeded" className={inputClass(errors.formatNeeded)} value={values.formatNeeded} onChange={(e) => update("formatNeeded", e.target.value)} placeholder="DST, PES, AI…" />
              </Field>
              <Field id="placement" label="Placement / use" error={errors.placement}>
                <input id="placement" className={inputClass(errors.placement)} value={values.placement} onChange={(e) => update("placement", e.target.value)} />
              </Field>
              <Field id="colors" label="Number of colors" error={errors.colors}>
                <input id="colors" className={inputClass(errors.colors)} value={values.colors} onChange={(e) => update("colors", e.target.value)} />
              </Field>
              <Field id="rush" label="Rush request" error={errors.rush}>
                <select id="rush" className={inputClass(errors.rush)} value={values.rush} onChange={(e) => update("rush", e.target.value)}>
                  <option>No</option>
                  <option>Yes — date is firm</option>
                </select>
              </Field>
            </>
          ) : null}
          {isPhysical(values.service) ? (
            <>
              <Field id="quantity" label="Quantity" error={errors.quantity} required>
                <input id="quantity" className={inputClass(errors.quantity)} value={values.quantity} onChange={(e) => update("quantity", e.target.value)} />
              </Field>
              <Field id="sizes" label="Sizes / qty per size" error={errors.sizes}>
                <input id="sizes" className={inputClass(errors.sizes)} value={values.sizes} onChange={(e) => update("sizes", e.target.value)} />
              </Field>
              <Field id="placement" label="Decoration location" error={errors.placement}>
                <input id="placement" className={inputClass(errors.placement)} value={values.placement} onChange={(e) => update("placement", e.target.value)} />
              </Field>
              <Field id="destination" label="Delivery address or postal code" error={errors.destination} required>
                <input id="destination" className={inputClass(errors.destination)} value={values.destination} onChange={(e) => update("destination", e.target.value)} />
              </Field>
            </>
          ) : null}
          <Field id="deadline" label="Required date" error={errors.deadline} required>
            <input id="deadline" type="date" className={inputClass(errors.deadline)} value={values.deadline} onChange={(e) => update("deadline", e.target.value)} />
          </Field>
          <Field id="budget" label="Budget range (optional)" error={errors.budget}>
            <input id="budget" className={inputClass(errors.budget)} value={values.budget} onChange={(e) => update("budget", e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="details" label="Project description" error={errors.details} required>
              <textarea id="details" rows={4} className={inputClass(errors.details)} value={values.details} onChange={(e) => update("details", e.target.value)} />
            </Field>
          </div>
          <Field id="intendedUse" label="Intended use" error={errors.intendedUse}>
            <input id="intendedUse" className={inputClass(errors.intendedUse)} value={values.intendedUse} onChange={(e) => update("intendedUse", e.target.value)} />
          </Field>
          <fieldset>
            <legend className="text-sm font-medium">Preferred contact</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {contactMethods.map((method) => (
                <label key={method} className="inline-flex items-center gap-2 text-sm">
                  <input type="radio" checked={values.contactMethod === method} onChange={() => update("contactMethod", method)} className="accent-blue" />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="sm:col-span-2">
            <Field id="artwork" label="Artwork upload" error={errors.artwork} hint={fileUpload.acceptLabel}>
              <input
                id="artwork"
                type="file"
                accept={fileUpload.accept.join(",")}
                onChange={(e) => {
                  const next = e.target.files?.[0] ?? null;
                  setFile(next);
                  setErrors((current) => ({ ...current, artwork: validateArtworkFile(next) }));
                }}
              />
              {file ? (
                <p className="mt-2 text-xs text-stone">
                  {file.name} · {formatFileSize(file.size)}
                </p>
              ) : null}
            </Field>
          </div>
          <label className="sm:col-span-2 flex items-start gap-3 text-sm leading-6">
            <input type="checkbox" checked={values.rights} onChange={(e) => update("rights", e.target.checked)} className="mt-1 accent-blue" />
            I own this artwork or have permission to use it.
          </label>
          {errors.rights ? <p className="sm:col-span-2 text-sm text-error">{errors.rights}</p> : null}
          <label className="sm:col-span-2 flex items-start gap-3 text-sm leading-6">
            <input type="checkbox" checked={values.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 accent-blue" />
            I agree Stitchcraft Studio can use these details and uploads to prepare a quote. See the privacy policy.
          </label>
          {errors.consent ? <p className="sm:col-span-2 text-sm text-error">{errors.consent}</p> : null}
          <label className="sm:col-span-2 flex items-start gap-3 text-sm leading-6">
            <input type="checkbox" checked={values.marketing} onChange={(e) => update("marketing", e.target.checked)} className="mt-1 accent-blue" />
            Optional: send me occasional studio updates. This is separate from quote messages.
          </label>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" disabled={status.type === "submitting"}>
              {status.type === "submitting" ? "Sending…" : "Send quote request"}
            </Button>
          </div>
        </div>
      )}
      <div aria-live="polite" className="mt-5 min-h-12">
        {status.type === "success" ? <p className="border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{status.message}</p> : null}
        {status.type === "error" ? <p className="border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{status.message}</p> : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-xs text-stone">{hint}</p> : null}
      {error ? (
        <p className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(error?: string) {
  return ["w-full border bg-warm px-3 py-3 text-sm", error ? "border-error" : "border-line"].join(" ");
}
