import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Expiring, HMAC-signed links to private artwork for the staff notification.
 * Requires QUOTE_ARTWORK_LINK_SECRET (32+ random characters). Without it no
 * links are generated and staff open files from the store directly.
 */
export type ArtworkLinkInput = { reference: string; storedName: string; expiresAt: number };

function secret(env: NodeJS.ProcessEnv) {
  const value = env.QUOTE_ARTWORK_LINK_SECRET?.trim();
  return value && value.length >= 32 ? value : null;
}

export function artworkLinksEnabled(env: NodeJS.ProcessEnv = process.env) {
  return secret(env) !== null;
}

export function linkTtlMs(env: NodeJS.ProcessEnv = process.env) {
  const hours = Number(env.QUOTE_ARTWORK_LINK_TTL_HOURS ?? 72);
  return (Number.isFinite(hours) && hours > 0 ? hours : 72) * 60 * 60 * 1000;
}

function sign(input: ArtworkLinkInput, key: string) {
  return createHmac("sha256", key).update(`${input.reference}\n${input.storedName}\n${input.expiresAt}`).digest("base64url");
}

export function signArtworkLink(input: ArtworkLinkInput, baseUrl: string, env: NodeJS.ProcessEnv = process.env): string | null {
  const key = secret(env);
  if (!key) return null;
  const params = new URLSearchParams({ ref: input.reference, file: input.storedName, exp: String(input.expiresAt), sig: sign(input, key) });
  return `${baseUrl.replace(/\/$/, "")}/api/quote/artwork?${params.toString()}`;
}

export type LinkCheck = { ok: true; reference: string; storedName: string } | { ok: false; status: 401 | 410 | 503 };

export function verifyArtworkLink(params: URLSearchParams, now = Date.now(), env: NodeJS.ProcessEnv = process.env): LinkCheck {
  const key = secret(env);
  if (!key) return { ok: false, status: 503 };
  const reference = params.get("ref") ?? "";
  const storedName = params.get("file") ?? "";
  const exp = Number(params.get("exp"));
  const sig = params.get("sig") ?? "";
  if (!/^[A-Z0-9-]{6,40}$/.test(reference) || !/^[a-z0-9][a-z0-9.-]{0,120}$/.test(storedName) || !Number.isFinite(exp) || !sig) return { ok: false, status: 401 };
  const expected = Buffer.from(sign({ reference, storedName, expiresAt: exp }, key));
  const provided = Buffer.from(sig);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return { ok: false, status: 401 };
  if (exp < now) return { ok: false, status: 410 };
  return { ok: true, reference, storedName };
}
