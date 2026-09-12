/**
 * Fixed-window in-memory rate limiter. Sufficient for a single server
 * process or a low-traffic serverless function; state is per instance.
 * For multi-instance production traffic, back this with the durable store.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  return {
    check(key: string, now = Date.now()) {
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
      }
      if (bucket.count >= limit) {
        return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
      }
      bucket.count += 1;
      return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
    },
    reset() {
      buckets.clear();
    },
  };
}

export function clientKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
  return ip;
}
