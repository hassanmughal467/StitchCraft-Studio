import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description: "Stitchcraft Studio is a Pakistan-based embroidery digitizing and custom products studio working with print shops, brands and teams in the US, UK and Australia.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A digitizing and custom products studio built for shops, brands and teams."
        lede={site.location}
      />
      <section className="border-b border-line py-14 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-semibold">What we do</h2>
            <div className="prose-site mt-4 leading-7 text-ink-soft">
              <p>
                Stitchcraft Studio does two kinds of work. The first is artwork: turning a logo into an embroidery file that sews cleanly, redrawing a low-quality
                logo as vector paths, or designing a new mark. The second is finished products: custom patches, embroidered apparel, screen-printed shirts and caps,
                produced to an approved proof and shipped to you.
              </p>
              <p>
                Most of our customers are embroidery shops, screen printers, promotional merchandise sellers and brands who need reliable overflow capacity and
                files that run without rework. We also take direct orders from teams, clubs, small businesses and individuals.
              </p>
            </div>
            <h2 className="mt-10 text-2xl font-semibold">How we work</h2>
            <div className="prose-site mt-4 leading-7 text-ink-soft">
              <p>
                Every job starts with a written quote that lists what is included, the price and the timing. Nothing is produced until you approve a stitch
                preview or placement proof. Digital work is delivered as files; products are made after approval and payment, then shipped with tracking.
              </p>
              <p>
                Your artwork is used only to prepare and produce your job. We do not publish customer work without written permission, and we do not contact a
                trade customer&apos;s clients.
              </p>
            </div>
            <h2 className="mt-10 text-2xl font-semibold">Where we are</h2>
            <p className="mt-4 leading-7 text-ink-soft">
              The studio is in {site.address.country}. We work in English with customers in the United States, the United Kingdom, Australia and elsewhere, and we
              quote shipping to your postal code for every product order. We do not operate offices or warehouses outside {site.address.country}.
            </p>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-sm border border-line bg-card p-6">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper-dark">Two ways to buy</p>
              <ul className="mt-4 space-y-5">
                {routes.map((route) => (
                  <li key={route.id}>
                    <Link href={route.href} className="text-lg font-semibold text-charcoal hover:text-blue">
                      {route.title}
                    </Link>
                    <p className="mt-1 text-sm leading-6 text-ink-soft">{route.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
      <ProcessStrip />
      <CtaBand />
    </>
  );
}
