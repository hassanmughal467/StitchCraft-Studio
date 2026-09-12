import type { NextConfig } from "next";

const productionConfirmed =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
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
