import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteEnv } from "@/lib/env";
import { organizationJsonLd, robotsFor } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  ...(siteEnv.productionUrl ? { metadataBase: new URL(siteEnv.productionUrl) } : {}),
  title: {
    default: `Embroidery Digitizing & Custom Patches | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  robots: robotsFor(),
  openGraph: {
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#20252B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={cn(sans.variable, "font-sans antialiased")}>
        <JsonLd data={organizationJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-blue focus:px-4 focus:py-2 focus:text-card"
        >
          Skip to content
        </a>
        <AnnouncementBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
