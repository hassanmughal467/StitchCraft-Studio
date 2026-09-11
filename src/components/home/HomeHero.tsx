import { StudioImage } from "@/components/media/StudioImage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-line bg-cream">
      <Container className="grid items-end gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-copper">
            {site.tagline}
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]">
            Artwork Into Production-Ready Embroidery.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
            StitchCraft Studio builds clean, accurate digitizing files and custom patches for clothing
            brands, teams, uniforms, and merchandise businesses. The work is planned for the garment,
            the machine, and the run — not just for a screen preview.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Request a Quote</ButtonLink>
            <ButtonLink href="/portfolio" variant="secondary">
              View Our Work
            </ButtonLink>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {[
              ["Files", "DST, EMB, PES, EXP"],
              ["Work", "Logos to jacket backs"],
              ["Support", "Shops and brands"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-stone">{label}</dt>
                <dd className="mt-2 text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <StudioImage
            src={media.heroThread.src}
            alt={media.heroThread.alt}
            credit={media.heroThread.credit}
            priority
            className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
            sizes="(min-width: 1024px) 42vw, 100vw"
            caption="Production floor · placeholder photo"
          />
          <div className="absolute -left-3 bottom-8 hidden w-52 border border-line bg-ivory p-4 shadow-sm sm:block lg:-left-10">
            <StudioImage
              src={media.heroPatch.src}
              alt={media.heroPatch.alt}
              credit={media.heroPatch.credit}
              className="aspect-square"
              sizes="220px"
            />
            <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-stone">
              Stitch detail
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
