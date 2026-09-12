import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/services", destination: "/digitizing-artwork", permanent: false },
      { source: "/industries", destination: "/trade", permanent: false },
    ];
  },
};

export default nextConfig;
