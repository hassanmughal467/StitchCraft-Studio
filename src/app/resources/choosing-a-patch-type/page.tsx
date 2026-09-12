import { GuideLayout } from "@/components/sections/GuideLayout";
import { PatchSwatches } from "@/components/visuals/HeroComposition";
import { pageMetadata } from "@/lib/seo";

const href = "/resources/choosing-a-patch-type";
const title = "Choosing a patch type";
const description = "How embroidered, woven, PVC, chenille, printed and leather patches differ, and which suits your artwork, garment and use.";

export const metadata = pageMetadata({ title, description, path: href, type: "article" });

export default function Page() {
  return (
    <GuideLayout
      href={href}
      title={title}
      description={description}
      intro="The right patch type depends on three things: how detailed the artwork is, what the patch will be attached to, and how it will be used. This guide compares the common constructions so you can specify with confidence."
      visual={<PatchSwatches id="guide-patch" />}
      ctaHref="/quote?service=custom-patches"
      related={[
        { href: "/custom-patches", label: "Custom patches" },
        { href: "/custom-hats", label: "Patch caps" },
        { href: "/embroidery-digitizing", label: "Embroidery digitizing" },
      ]}
      sections={[
        {
          heading: "Embroidered patches",
          body: (
            <>
              <p>
                Thread stitched onto a twill base. This is the classic patch with visible texture and a raised feel. It suits bold shapes, solid lettering and designs with a
                limited number of colors. Coverage can be partial (twill showing as a background color) or 100% embroidered.
              </p>
              <p>
                Limits: text below roughly 6 mm high and very thin lines lose definition. If your logo relies on fine detail, consider woven or printed instead, or let us simplify
                the artwork on the proof.
              </p>
            </>
          ),
        },
        {
          heading: "Woven patches",
          body: (
            <>
              <p>
                Made by weaving fine threads rather than stitching on top of a base. The surface is flat and smooth, and detail is much finer than embroidery, so small text,
                thin outlines and intricate crests reproduce well.
              </p>
              <p>Woven patches feel less textured than embroidered ones. Choose woven for detailed logos, name labels and slim designs.</p>
            </>
          ),
        },
        {
          heading: "PVC (rubber) patches",
          body: (
            <>
              <p>
                Moulded soft PVC in layers. Colors are solid and bright, edges are crisp, and the patch is waterproof and hard-wearing. PVC suits outdoor gear, bags, tactical
                use and any design with flat color areas. 2D PVC is flat with layered colors; 3D PVC adds sculpted height.
              </p>
              <p>Limits: PVC cannot reproduce gradients or photographic detail, and it is usually paired with a hook-and-loop backing rather than sewn directly.</p>
            </>
          ),
        },
        {
          heading: "Chenille patches",
          body: (
            <p>
              Loops of yarn give the fuzzy, raised varsity-jacket look. Chenille works for large letters, numbers and simple shapes, often with an embroidered or felt border.
              It does not hold small detail and is best at sizes from around 75 mm upward.
            </p>
          ),
        },
        {
          heading: "Printed and leather patches",
          body: (
            <>
              <p>
                Printed (dye-sublimated) patches reproduce photographs, gradients and very fine detail on a fabric base, usually finished with an embroidered border. They are
                the answer when the artwork simply cannot be stitched.
              </p>
              <p>Leather patches are debossed or laser-marked genuine or faux leather, common on caps, denim and premium apparel where a single-tone mark is wanted.</p>
            </>
          ),
        },
        {
          heading: "Backing, border and size",
          body: (
            <>
              <p>
                Backing determines how the patch attaches: iron-on (heat-seal) for pressing onto cotton and polycotton, sew-on for permanent attachment or stretch fabrics,
                hook-and-loop for removable use, and adhesive for short-term use.
              </p>
              <p>
                Borders: a merrowed edge wraps the perimeter with thread and suits regular shapes such as circles, shields and rectangles. A hot-cut or laser-cut edge follows
                custom shapes cleanly.
              </p>
              <p>
                Size is measured across the longest dimension. Keep at least 2–3 mm between important detail and the border so nothing is lost in the edge finish.
              </p>
            </>
          ),
        },
        {
          heading: "Quick recommendation",
          body: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Bold logo, classic look: embroidered</li>
              <li>Small text or intricate crest: woven</li>
              <li>Outdoor, bags, gear: PVC with hook-and-loop</li>
              <li>Varsity letters: chenille</li>
              <li>Photo or gradient artwork: printed</li>
              <li>Single-tone premium mark on caps or denim: leather</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
