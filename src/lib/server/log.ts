/**
 * Minimal structured logger for server code.
 *
 * Only whitelisted, non-personal fields may be logged: references, submission
 * ids, status codes, provider names, error classes and messages produced by
 * our own code. Never pass form payloads, emails, phone numbers, addresses,
 * filenames or file contents. `redactError` strips anything that looks like an
 * email address or long digit string from third-party error messages.
 */
type Level = "info" | "warn" | "error";

export type LogFields = Record<string, string | number | boolean | null | undefined>;

const emailLike = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const longDigits = /\+?\d[\d\s().-]{6,}\d/g;

export function redactError(error: unknown): { errorName: string; errorMessage: string } {
  if (error instanceof Error) {
    return { errorName: error.name, errorMessage: error.message.replace(emailLike, "[email]").replace(longDigits, "[number]").slice(0, 300) };
  }
  return { errorName: "UnknownError", errorMessage: String(error).replace(emailLike, "[email]").replace(longDigits, "[number]").slice(0, 300) };
}

function emit(level: Level, event: string, fields: LogFields = {}) {
  if (process.env.NODE_ENV === "test" && !process.env.LOG_IN_TESTS) return;
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else if (process.env.NODE_ENV !== "production" || process.env.LOG_LEVEL === "info") console.info(line);
}

export const log = {
  info: (event: string, fields?: LogFields) => emit("info", event, fields),
  warn: (event: string, fields?: LogFields) => emit("warn", event, fields),
  error: (event: string, error?: unknown, fields?: LogFields) => emit("error", event, { ...(error !== undefined ? redactError(error) : {}), ...fields }),
};
