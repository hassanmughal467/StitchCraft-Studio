import Image from "next/image";
import { StudioImage } from "@/components/media/StudioImage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-night text-ivory">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={media.heroThread.src}
          alt={media.heroThread.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 grayscale contrast-125"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night via-night/90 to-night/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-night to-transparent" />

      <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="rise lg:col-span-7">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-copper-soft">
            {site.tagline}
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[5.1rem]">
            Artwork Into <em>Production-Ready</em> Embroidery.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/74">
            StitchCraft Studio builds clean, accurate digitizing files and custom patches for clothing
            brands, teams, uniforms, and merchandise businesses. Planned for the garment, the machine,
            and the run.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Request a Quote</ButtonLink>
            <ButtonLink href="/portfolio" variant="invertGhost">
              View Portfolio
            </ButtonLink>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-ivory/12 pt-8 sm:grid-cols-3">
            {[
              ["Files", "DST, EMB, PES, EXP"],
              ["Work", "Logos to jacket backs"],
              ["Clients", "Reserved gallery ready"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold">{label}</dt>
                <dd className="mt-2 text-sm text-ivory/88">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <StudioImage
            src={media.heroPatch.src}
            alt={media.heroPatch.alt}
            credit={media.heroPatch.credit}
            className="aspect-[4/5] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            sizes="(min-width: 1024px) 38vw, 100vw"
            caption="Stitch detail · placeholder"
          />
          <div className="absolute left-4 bottom-8 hidden max-w-[13.5rem] border border-ivory/15 bg-ivory p-4 text-ink shadow-xl sm:block">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-copper">
              Production board
            </p>
            <p className="mt-2 font-display text-2xl leading-none">Caps, chests, patches, puff.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
