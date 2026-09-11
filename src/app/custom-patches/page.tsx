import { StudioImage } from "@/components/media/StudioImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Custom Patches",
  description:
    "Custom embroidered, chenille, and woven patches for brands, teams, and merchandise programs. Backing and edge finishes specified for how the patch will be applied.",
  path: "/custom-patches",
});

export default function PatchesPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom patches"
        title="Patches specified for the edge, the backing, and the garment."
        lede="We produce embroidered, chenille, and woven patches from your artwork. The quote depends on size, quantity, border, and how the patch will be attached."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Request a Quote</ButtonLink>
          <ButtonLink href="/portfolio" variant="secondary">
            View patch samples
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <StudioImage
            src={media.patchesTable.src}
            alt={media.patchesTable.alt}
            credit={media.patchesTable.credit}
            className="aspect-[5/4]"
            caption="Patch production reference · placeholder"
          />
          <div>
            <h2 className="font-display text-4xl tracking-[-0.02em]">What to decide before you order</h2>
            <dl className="mt-8 space-y-6">
              {[
                ["Shape and edge", "Merrowed borders suit badges. Laser-cut or die-cut edges suit irregular shapes. Fine points need enough border width or they fray."],
                ["Backing", "Sew-on for permanent kit. Iron-on for simple apparel. Hook-and-loop when the patch has to move between garments."],
                ["Quantity", "Small runs are possible. Unit cost usually drops as the same die and thread setup is reused."],
                ["Artwork", "Vector files keep edges honest. We will rebuild a simple mark from a clear raster; complex crests may need a redraw first."],
              ].map(([title, body]) => (
                <div key={title} className="border-t border-line pt-5">
                  <dt className="font-display text-2xl tracking-[-0.02em]">{title}</dt>
                  <dd className="mt-2 text-sm leading-6 text-ink-soft">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-4xl tracking-[-0.02em]">Patch types</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Embroidered", "Filled or mixed-stitch badges for jackets, bags, and uniforms."],
              ["Chenille", "Raised varsity letters and mascots for team and campus jackets."],
              ["Woven", "Finer detail than embroidery can hold — useful for small wordmarks and labels."],
            ].map(([title, body]) => (
              <li key={title} className="bg-paper p-7">
                <h3 className="font-display text-2xl tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand title="Send size, quantity, and how the patch will be attached." />
    </>
  );
}
