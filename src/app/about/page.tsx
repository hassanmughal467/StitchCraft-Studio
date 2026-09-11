import { StudioImage } from "@/components/media/StudioImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "StitchCraft Studio is an independent embroidery digitizing and custom patch studio. Threadline Digitizing for brands, teams, uniforms, and shops.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`${site.name} is an independent digitizing and patch studio.`}
        lede={`${site.tagline} is the line of work: converting artwork into files and patches that production can trust. We are not a print marketplace and not a general freelance board.`}
      />
      <section className="border-b border-line py-16 sm:py-20">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <StudioImage
            src={media.threadSpools.src}
            alt={media.threadSpools.alt}
            credit={media.threadSpools.credit}
            className="aspect-[4/5]"
            caption="Studio materials · placeholder"
          />
          <div className="prose-site">
            <h2 className="text-4xl">How we work</h2>
            <p className="mt-5 text-base leading-7 text-ink-soft">
              The studio is set up for clothing brands, fashion companies, workwear suppliers, sports
              teams, uniform programs, promotional-product businesses, merchandise labels, and embroidery
              shops that need overflow help. The common need is the same: a mark that sews cleanly and
              can be repeated.
            </p>
            <p className="text-base leading-7 text-ink-soft">
              We stay close to the technical decisions — stitch type, underlay, density, backing, and
              edge finish — and we explain them in plain language. If a design will not hold at the size
              you want, we say so before you pay for a file that will fail on the first run.
            </p>
            <h2 className="mt-12 text-4xl">What we will not do</h2>
            <p className="mt-5 text-base leading-7 text-ink-soft">
              We do not publish invented reviews, client logos, or production statistics. This site uses
              placeholder photography until real sew-outs are photographed. Contact details are marked
              for replacement before launch.
            </p>
          </div>
        </Container>
      </section>
      <CtaBand title="If the job is a file or a patch run, send it." />
    </>
  );
}
