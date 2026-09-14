import type { NextConfig } from "next";

const productionConfirmed =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          isDev
            ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com"
            : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self'",
          isDev
            ? "connect-src 'self' ws: wss: http://127.0.0.1:* http://localhost:* https://*.blob.vercel-storage.com https://challenges.cloudflare.com"
            : "connect-src 'self' https://*.blob.vercel-storage.com https://challenges.cloudflare.com",
          "frame-src https://challenges.cloudflare.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
    ];
    if (productionConfirmed) {
      securityHeaders.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" });
    }
    // Preview deployments: crawlers receive the directive on every response,
    // which robots.txt Disallow alone does not guarantee.
    const previewHeaders = productionConfirmed ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];
    return [{ source: "/:path*", headers: [...securityHeaders, ...previewHeaders] }];
  },
  async redirects() {
    return [
      { source: "/services", destination: "/digitizing-artwork", permanent: true },
      { source: "/industries", destination: "/trade", permanent: true },
    ];
  },
};

export default nextConfig;
