"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { contactMethods, garmentTypes, quoteServices } from "@/lib/content";
import { emptyQuote, validateArtworkFile, validateQuote, type QuoteFieldErrors, type QuotePayload } from "@/lib/quote";
import { fileUpload } from "@/lib/site";
import { formatFileSize } from "@/lib/utils";

type Status =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function QuoteForm() {
  const [values, setValues] = useState<QuotePayload>(emptyQuote());
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function update<K extends keyof QuotePayload>(key: K, value: QuotePayload[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
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
      setValues(emptyQuote());
      setFile(null);
      setErrors({});
      setStatus({ type: "success", message: data.message });
    } catch {
      setStatus({
        type: "error",
        message: "The request could not be sent. Check your connection and try again.",
      });
    }
  }

  return (
    <form id="quote-form" onSubmit={onSubmit} noValidate className="bg-cream p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" id="name" error={errors.name} required>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass(errors.name)}
          />
        </Field>
        <Field label="Company name" id="company" error={errors.company}>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            className={inputClass(errors.company)}
          />
        </Field>
        <Field label="Email" id="email" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass(errors.email)}
          />
        </Field>
        <Field label="WhatsApp or phone" id="phone" error={errors.phone} required>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass(errors.phone)}
          />
        </Field>
        <Field label="Service required" id="service" error={errors.service} required>
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={(e) => update("service", e.target.value)}
            className={inputClass(errors.service)}
          >
            <option value="">Select a service</option>
            {quoteServices.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Garment or patch type" id="garment" error={errors.garment} required>
          <select
            id="garment"
            name="garment"
            value={values.garment}
            onChange={(e) => update("garment", e.target.value)}
            className={inputClass(errors.garment)}
          >
            <option value="">Select a type</option>
            {garmentTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Quantity" id="quantity" error={errors.quantity} required>
          <input
            id="quantity"
            name="quantity"
            placeholder="e.g. 1 file, 200 patches"
            value={values.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className={inputClass(errors.quantity)}
          />
        </Field>
        <Field label="Required deadline" id="deadline" error={errors.deadline} required>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={values.deadline}
            onChange={(e) => update("deadline", e.target.value)}
            className={inputClass(errors.deadline)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Artwork upload" id="artwork" error={errors.artwork} hint={fileUpload.acceptLabel}>
            <input
              id="artwork"
              name="artwork"
              type="file"
              accept={fileUpload.accept.join(",")}
              onChange={(e) => {
                const next = e.target.files?.[0] ?? null;
                const fileError = validateArtworkFile(next);
                setFile(next);
                setErrors((current) => ({ ...current, artwork: fileError }));
              }}
              className="block w-full text-sm file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2.5 file:text-xs file:uppercase file:tracking-[0.12em] file:text-cream"
            />
            {file ? (
              <p className="mt-2 font-mono text-xs text-stone">
                {file.name} · {formatFileSize(file.size)}
              </p>
            ) : null}
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Additional project details" id="details" error={errors.details}>
            <textarea
              id="details"
              name="details"
              rows={5}
              value={values.details}
              onChange={(e) => update("details", e.target.value)}
              className={inputClass(errors.details) + " min-h-32 resize-y"}
              placeholder="Size, thread colors, machine type, backing, or anything the file must match."
            />
          </Field>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium text-ink">Preferred contact method</legend>
          <div className="mt-3 flex flex-wrap gap-4">
            {contactMethods.map((method) => (
              <label key={method} className="inline-flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="radio"
                  name="contactMethod"
                  value={method}
                  checked={values.contactMethod === method}
                  onChange={() => update("contactMethod", method)}
                  className="accent-copper"
                />
                {method}
              </label>
            ))}
          </div>
          {errors.contactMethod ? <p className="mt-2 text-sm text-copper-dark">{errors.contactMethod}</p> : null}
        </fieldset>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm leading-6 text-ink-soft">
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-1 accent-copper"
            />
            <span>
              I agree that StitchCraft Studio can use these details and any uploaded artwork to prepare a quote and reply
              to this request.
            </span>
          </label>
          {errors.consent ? <p className="mt-2 text-sm text-copper-dark">{errors.consent}</p> : null}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status.type === "submitting"}>
          {status.type === "submitting" ? "Sending…" : "Send quote request"}
        </Button>
        <p className="text-xs text-stone">We reply during studio hours. Rush jobs should include the deadline above.</p>
      </div>

      <div aria-live="polite" className="mt-5 min-h-12">
        {status.type === "success" ? (
          <p className="border border-steel/20 bg-steel/5 px-4 py-3 text-sm text-steel">{status.message}</p>
        ) : null}
        {status.type === "error" ? (
          <p className="border border-copper/30 bg-copper/8 px-4 py-3 text-sm text-copper-dark">{status.message}</p>
        ) : null}
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
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-copper"> *</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-xs text-stone">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-copper-dark" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(error?: string) {
  return [
    "w-full border bg-ivory px-3 py-3 text-sm text-ink placeholder:text-stone/70",
    error ? "border-copper" : "border-line focus:border-ink",
  ].join(" ");
}
