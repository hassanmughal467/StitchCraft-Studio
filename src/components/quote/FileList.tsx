"use client";

import { useRef } from "react";
import { FieldError } from "@/components/quote/fields";
import { acceptAttribute, fileLimits } from "@/lib/config/limits";
import { truncateName } from "@/lib/quote";
import { cn, formatFileSize } from "@/lib/utils";

export type QueuedFile = {
  /** Stable key for React and for progress tracking. */
  key: string;
  file: File;
  /** 0–100 while uploading; null when idle. */
  progress: number | null;
  /** Set once a direct upload completed; used so retries do not re-upload. */
  location?: string;
  error?: string;
};

export function FileList({
  uid,
  files,
  onAdd,
  onRemove,
  error,
  disabled,
  busy,
  required,
}: {
  uid: string;
  files: QueuedFile[];
  onAdd: (files: File[]) => void;
  onRemove: (key: string) => void;
  error?: string;
  disabled?: boolean;
  busy?: boolean;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const remaining = fileLimits.maxFiles - files.length;
  const described = [`${uid}-artwork-hint`, error ? `${uid}-artwork-error` : null].filter(Boolean).join(" ");

  return (
    <div className="sm:col-span-2">
      <label htmlFor={`${uid}-artwork`} className="block text-sm font-medium text-charcoal">
        Artwork files
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
      <p id={`${uid}-artwork-hint`} className="mt-1 text-xs leading-5 text-stone">
        {fileLimits.acceptLabel} Files are private and used only to prepare your quote.
      </p>
      <div className="mt-2">
        <input
          ref={inputRef}
          id={`${uid}-artwork`}
          name="artwork"
          type="file"
          multiple
          accept={acceptAttribute()}
          disabled={disabled || remaining <= 0}
          aria-describedby={described}
          aria-invalid={error ? true : undefined}
          className={cn(
            "block w-full max-w-full rounded-sm border bg-warm text-sm text-ink-soft file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-sm file:border-0 file:border-r file:border-line file:bg-card file:px-4 file:text-sm file:font-semibold file:text-charcoal disabled:cursor-not-allowed disabled:opacity-60",
            error ? "border-error" : "border-line",
          )}
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []);
            if (picked.length) onAdd(picked);
            // Reset so the same file can be re-selected after removal.
            e.target.value = "";
          }}
        />
        {remaining <= 0 ? <p className="mt-1 text-xs text-stone">You have attached the maximum of {fileLimits.maxFiles} files. Remove one to add another.</p> : null}
      </div>
      {error ? <FieldError id={`${uid}-artwork-error`}>{error}</FieldError> : null}
      {files.length ? (
        <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-card" aria-label="Attached files">
          {files.map((item, index) => (
            <li key={item.key} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2.5 text-sm">
              <span className="min-w-0 flex-1 basis-40 break-all text-charcoal" title={item.file.name}>
                {truncateName(item.file.name, 48)}
              </span>
              <span className="shrink-0 text-xs text-stone">{formatFileSize(item.file.size)}</span>
              {item.location ? (
                <span className="shrink-0 text-xs font-medium text-success">Uploaded</span>
              ) : item.progress !== null ? (
                <span className="flex min-w-32 flex-1 items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.progress} aria-label={`Uploading ${truncateName(item.file.name, 30)}`}>
                    <span className="block h-full bg-blue" style={{ width: `${item.progress}%` }} />
                  </span>
                  <span className="w-9 text-right text-xs tabular-nums text-stone">{item.progress}%</span>
                </span>
              ) : null}
              {item.error ? <span className="basis-full text-xs text-error">{item.error}</span> : null}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  onRemove(item.key);
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                className="inline-flex min-h-9 shrink-0 items-center rounded-sm px-2 text-sm font-semibold text-blue underline-offset-2 hover:underline disabled:opacity-50"
              >
                Remove<span className="sr-only"> {truncateName(item.file.name, 30)}, file {index + 1} of {files.length}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
