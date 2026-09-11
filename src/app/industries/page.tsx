import { StudioImage } from "@/components/media/StudioImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { industries } from "@/lib/content";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries We Serve",
  description:
    "Embroidery digitizing and custom patches for clothing brands, fashion companies, workwear, sports teams, uniforms, promotional products, merchandise, and embroidery shops.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="We work with the people who have to deliver the garment."
        lede="Brands, program suppliers, and embroidery shops send work here when the mark has to sew the same way more than once. The industry changes the fabric and the deadline. The file still has to register."
      />
      <section className="border-b border-line py-16">
        <Container>
          <StudioImage
            src={media.workwear.src}
            alt={media.workwear.alt}
            credit={media.workwear.credit}
            className="aspect-[21/9]"
            sizes="100vw"
            caption="Industry work · placeholder photography"
          />
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          <ol className="grid gap-8 lg:grid-cols-2">
            {industries.map((industry, index) => (
              <li key={industry.title} className="border-t border-line pt-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-copper">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-[-0.02em]">{industry.title}</h2>
                <p className="mt-3 text-base leading-7 text-ink-soft">{industry.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <CtaBand title="Tell us the garment program. We will tell you what the file set should include." />
    </>
  );
}
