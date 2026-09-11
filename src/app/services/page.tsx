import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { services } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Embroidery digitizing, custom patches, cap files, jacket backs, appliqué, 3D puff, chenille, woven patches, and vector preparation.",
  path: "/services",
});

const details: Record<string, string[]> = {
  digitizing: [
    "Underlay, density, and pathing set for the fabric and size you name.",
    "Formats matched to the machines your shop or factory runs.",
  ],
  patches: [
    "Merrowed, die-cut, and shaped patches with sew-on, iron-on, or hook-and-loop backing.",
    "Quoted from size, quantity, and finish — not a one-price list.",
  ],
  "logo-digitizing": [
    "Chest, sleeve, and cap versions treated as related files, not one stretched design.",
    "Small text reviewed for stitch height before we commit to a sew size.",
  ],
  "jacket-back": [
    "Large designs sequenced for stable hooping and even coverage.",
    "Density reduced on heavy panels so the jacket does not warp.",
  ],
  caps: [
    "Front, side, and rear placements planned for crown height and curvature.",
    "Puff and flat files kept as separate jobs when both are required.",
  ],
  applique: [
    "Placement, tack-down, and cover stitches in the right order for a clean trim.",
    "Fabric type confirmed so felt, twill, and performance knits are not treated the same.",
  ],
  puff: [
    "Wide columns and simple shapes that can hold foam height.",
    "We will say when a mark is too fine for puff and should stay flat.",
  ],
  chenille: [
    "Varsity letters and mascots specified with pile, felt color, and border.",
    "Woven labels quoted separately when a fine mark will not survive embroidery.",
  ],
  vector: [
    "Cleanup of scans and low-resolution logos so stitch paths follow real edges.",
    "Useful when the only source file is a photo or a flattened PDF.",
  ],
  bulk: [
    "Colorways and size sets archived so reorders do not start from scratch.",
    "Useful for shops and brands running the same mark across many SKUs.",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="The work we take on, and how it is specified."
        lede="Every job starts with artwork, placement, and the garment or patch it has to survive. Below is what we produce and what we need from you to quote it."
      >
        <div className="mt-8">
          <ButtonLink href="/contact">Request a Quote</ButtonLink>
        </div>
      </PageHero>
      <section className="py-16 sm:py-20">
        <Container className="space-y-16">
          {services.map((service, index) => (
            <article
              key={service.id}
              id={service.id}
              className="scroll-mt-28 grid gap-8 border-t border-line pt-10 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-copper">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-[-0.02em]">{service.title}</h2>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-7 text-ink-soft">{service.summary}</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-ink-soft">
                  {(details[service.id] ?? []).map((line) => (
                    <li key={line} className="pl-4" style={{ boxShadow: "inset 2px 0 0 #c4622d" }}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
