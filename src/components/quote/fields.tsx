"use client";

import { OTHER_COUNTRY, countryOptions } from "@/lib/countries";
import { rowLimits } from "@/lib/config/limits";
import type { QuoteRow } from "@/lib/quote";
import { cn } from "@/lib/utils";

/** Attributes every control receives so labels, hints and errors are programmatically connected. */
export type ControlProps = {
  id: string;
  name: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  required?: boolean;
};

export function controlProps(uid: string, id: string, opts: { error?: string; hint?: string; required?: boolean }): ControlProps {
  const described = [opts.hint ? `${uid}-${id}-hint` : null, opts.error ? `${uid}-${id}-error` : null].filter(Boolean).join(" ");
  return {
    id: `${uid}-${id}`,
    name: id,
    ...(described ? { "aria-describedby": described } : {}),
    ...(opts.error ? { "aria-invalid": true } : {}),
    ...(opts.required ? { "aria-required": true } : {}),
  };
}

export function inputClass(error?: string, extra?: string) {
  return cn(
    "w-full min-h-11 rounded-sm border bg-warm px-3 py-2.5 text-base text-charcoal placeholder:text-stone/70 sm:text-sm",
    error ? "border-error ring-1 ring-error/40" : "border-line",
    extra,
  );
}

export function Field({
  uid,
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  uid: string;
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: ControlProps) => React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`${uid}-${id}`} className="block text-sm font-medium text-charcoal">
        {label}
        {required ? (
          <>
            <span className="text-error" aria-hidden>
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="font-normal text-stone"> (optional)</span>
        )}
      </label>
      {hint ? (
        <p id={`${uid}-${id}-hint`} className="mt-1 text-xs leading-5 text-stone">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children(controlProps(uid, id, { error, hint, required }))}</div>
      {error ? <FieldError id={`${uid}-${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm text-error">
      <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v4M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  );
}

/**
 * Radio or checkbox group rendered as chips. Uses a fieldset/legend so the
 * group name is announced; each option is a native input.
 */
export function ChoiceGroup({
  uid,
  id,
  legend,
  options,
  value,
  onChange,
  multiple,
  error,
  hint,
  required,
  className,
}: {
  uid: string;
  id: string;
  legend: string;
  options: readonly string[];
  /** Radio: the selected value. Checkbox: "|"-joined selections. */
  value: string;
  onChange: (next: string) => void;
  multiple?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  const selected = multiple ? value.split("|").filter(Boolean) : [value];
  const described = [hint ? `${uid}-${id}-hint` : null, error ? `${uid}-${id}-error` : null].filter(Boolean).join(" ");
  return (
    <fieldset id={`${uid}-${id}`} className={cn("min-w-0", className)} aria-describedby={described || undefined} aria-invalid={error ? true : undefined} aria-required={required || undefined}>
      <legend className="text-sm font-medium text-charcoal">
        {legend}
        {required ? (
          <>
            <span className="text-error" aria-hidden>
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="font-normal text-stone"> (optional)</span>
        )}
      </legend>
      {hint ? (
        <p id={`${uid}-${id}-hint`} className="mt-1 text-xs leading-5 text-stone">
          {hint}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={cn(
                "inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm leading-5",
                checked ? "border-blue bg-blue/5 text-charcoal" : "border-line bg-card text-ink-soft hover:border-charcoal/40",
                error && "border-error/60",
              )}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={id}
                value={option}
                checked={checked}
                onChange={(e) => {
                  if (!multiple) onChange(option);
                  else onChange((e.target.checked ? [...selected, option] : selected.filter((s) => s !== option)).join("|"));
                }}
                className="h-4 w-4 shrink-0 accent-blue"
              />
              <span className="min-w-0 break-words">{option}</span>
            </label>
          );
        })}
      </div>
      {error ? <FieldError id={`${uid}-${id}-error`}>{error}</FieldError> : null}
    </fieldset>
  );
}

export function CountrySelect({ uid, code, otherName, onCode, onOtherName, errorCode, errorName, hint }: { uid: string; code: string; otherName: string; onCode: (v: string) => void; onOtherName: (v: string) => void; errorCode?: string; errorName?: string; hint?: string }) {
  const options = countryOptions();
  return (
    <>
      <Field uid={uid} id="countryCode" label="Country" error={errorCode} hint={hint} required>
        {(props) => (
          <select {...props} autoComplete="country" className={inputClass(errorCode)} value={code} onChange={(e) => onCode(e.target.value)}>
            <option value="">Select a country</option>
            {options.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
            <option value={OTHER_COUNTRY}>Other (not listed)</option>
          </select>
        )}
      </Field>
      {code === OTHER_COUNTRY ? (
        <Field uid={uid} id="countryName" label="Country name" error={errorName} required>
          {(props) => <input {...props} autoComplete="country-name" className={inputClass(errorName)} value={otherName} onChange={(e) => onOtherName(e.target.value)} />}
        </Field>
      ) : null}
    </>
  );
}

/**
 * Repeatable rows for size breakdowns or product variants. Each row is a small
 * group with its own labelled inputs; the whole editor is a fieldset.
 */
export function RowsEditor({
  uid,
  id,
  legend,
  hint,
  labels,
  rows,
  onChange,
  error,
  addLabel,
}: {
  uid: string;
  id: string;
  legend: string;
  hint?: string;
  labels: { label: string; color: string; quantity: string };
  rows: QuoteRow[];
  onChange: (rows: QuoteRow[]) => void;
  error?: string;
  addLabel: string;
}) {
  const update = (index: number, key: keyof QuoteRow, value: string) => onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const described = [hint ? `${uid}-${id}-hint` : null, error ? `${uid}-${id}-error` : null].filter(Boolean).join(" ");
  return (
    <fieldset id={`${uid}-${id}`} className="min-w-0 sm:col-span-2" aria-describedby={described || undefined} aria-invalid={error ? true : undefined}>
      <legend className="text-sm font-medium text-charcoal">
        {legend} <span className="font-normal text-stone">(optional)</span>
      </legend>
      {hint ? (
        <p id={`${uid}-${id}-hint`} className="mt-1 text-xs leading-5 text-stone">
          {hint}
        </p>
      ) : null}
      {rows.length ? (
        <ol className="mt-3 space-y-3">
          {rows.map((row, index) => (
            <li key={index} className="grid gap-2 rounded-sm border border-line bg-card p-3 sm:grid-cols-[1fr_1fr_6rem_auto] sm:items-end">
              <div>
                <label htmlFor={`${uid}-${id}-${index}-label`} className="block text-xs font-medium text-ink-soft">
                  {labels.label}
                </label>
                <input id={`${uid}-${id}-${index}-label`} className={inputClass(undefined, "mt-1 min-h-10")} value={row.label} maxLength={rowLimits.labelLength} onChange={(e) => update(index, "label", e.target.value)} />
              </div>
              <div>
                <label htmlFor={`${uid}-${id}-${index}-color`} className="block text-xs font-medium text-ink-soft">
                  {labels.color}
                </label>
                <input id={`${uid}-${id}-${index}-color`} className={inputClass(undefined, "mt-1 min-h-10")} value={row.color} maxLength={rowLimits.labelLength} onChange={(e) => update(index, "color", e.target.value)} />
              </div>
              <div>
                <label htmlFor={`${uid}-${id}-${index}-quantity`} className="block text-xs font-medium text-ink-soft">
                  {labels.quantity}
                </label>
                <input id={`${uid}-${id}-${index}-quantity`} type="number" inputMode="numeric" min={1} step={1} className={inputClass(undefined, "mt-1 min-h-10")} value={row.quantity} onChange={(e) => update(index, "quantity", e.target.value)} />
              </div>
              <button type="button" onClick={() => onChange(rows.filter((_, i) => i !== index))} className="inline-flex min-h-10 items-center justify-center rounded-sm border border-line px-3 text-sm font-semibold text-charcoal hover:border-charcoal">
                Remove<span className="sr-only"> row {index + 1}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      {rows.length < rowLimits.maxRows ? (
        <button type="button" onClick={() => onChange([...rows, { label: "", color: "", quantity: "" }])} className="mt-3 inline-flex min-h-10 items-center rounded-sm border border-dashed border-charcoal/30 px-3 text-sm font-semibold text-blue hover:border-blue">
          + {addLabel}
        </button>
      ) : null}
      {error ? <FieldError id={`${uid}-${id}-error`}>{error}</FieldError> : null}
    </fieldset>
  );
}
