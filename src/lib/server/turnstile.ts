/**
 * Optional Cloudflare Turnstile verification. Inactive unless both
 * TURNSTILE_SECRET_KEY (server) and NEXT_PUBLIC_TURNSTILE_SITE_KEY (client) are set.
 * The honeypot and rate limit remain the default spam controls.
 */
export async function verifyTurnstile(token: string, remoteIp: string, env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;
  try {
    const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: remoteIp === "unknown" ? undefined : remoteIp }),
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}
