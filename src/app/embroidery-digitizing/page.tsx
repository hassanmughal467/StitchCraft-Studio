import { StudioImage } from "@/components/media/StudioImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Embroidery Digitizing",
  description:
    "Production-ready embroidery digitizing for logos, caps, jackets, uniforms, and shop overflow. Clean stitch paths, sensible density, and proofs before release.",
  path: "/embroidery-digitizing",
});

const points = [
  {
    title: "What digitizing is",
    body: "Digitizing turns artwork into a machine instruction file: where the needle enters, which stitch type to use, how dense the fill is, and when to trim. It is not the same as sending a PNG to an embroidery machine.",
  },
  {
    title: "What we need",
    body: "Artwork (vector preferred), the sew size, the garment or fabric, thread colors if you already have them, and the machine format. If any of that is missing we will ask before quoting a rush date.",
  },
  {
    title: "What you receive",
    body: "An approved stitch file in the format you named, a color sequence, and notes the operator can follow. Related placements — chest, cap, jacket — are separate files when the scale changes.",
  },
];

export default function DigitizingPage() {
  return (
    <>
      <PageHero
        eyebrow="Embroidery digitizing"
        title="Files built for registration, not just a pretty preview."
        lede="We digitize logos and marks so they sew cleanly at the size you specified. The goal is a file a shop can load, run, and repeat."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Request a Quote</ButtonLink>
          <ButtonLink href="/how-it-works" variant="secondary">
            See the process
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line py-16 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <StudioImage
            src={media.workshop.src}
            alt={media.workshop.alt}
            credit={media.workshop.credit}
            className="aspect-[5/4]"
            caption="Digitizing workstation · placeholder"
          />
          <div className="space-y-10">
            {points.map((point) => (
              <article key={point.title}>
                <h2 className="font-display text-3xl tracking-[-0.02em]">{point.title}</h2>
                <p className="mt-3 text-base leading-7 text-ink-soft">{point.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-4xl tracking-[-0.02em]">Typical file types we plan for</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Left-chest logos", "Small marks where counters and spacing decide whether the brand is readable."],
              ["Caps and hats", "Curved fields, limited height, and structured crowns."],
              ["Jacket backs", "Large coverage, split hooping, and density that will not warp the panel."],
              ["Appliqué", "Placement and cover stitches sequenced for a clean trim."],
              ["3D puff", "Raised columns planned around foam, not converted from a flat satin file."],
              ["Shop overflow", "When your own digitizer is booked and the job still has a date."],
            ].map(([title, body]) => (
              <li key={title} className="border border-line bg-cream p-6">
                <h3 className="font-display text-2xl tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand title="Send the logo and the sew size. We will tell you if it will hold." />
    </>
  );
}
