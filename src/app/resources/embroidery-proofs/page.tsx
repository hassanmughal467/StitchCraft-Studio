import { GuideLayout } from "@/components/sections/GuideLayout";
import { ArtworkToStitch } from "@/components/visuals/HeroComposition";
import { pageMetadata } from "@/lib/seo";

const href = "/resources/embroidery-proofs";
const title = "Understanding embroidery proofs";
const description = "What an embroidery stitch preview shows, what it cannot show, and a checklist for approving a proof before production.";

export const metadata = pageMetadata({ title, description, path: href, type: "article" });

export default function Page() {
  return (
    <GuideLayout
      href={href}
      title={title}
      description={description}
      intro="Before we sew or release a file, you receive a stitch preview. Approving it locks the design for production, so it pays to know what you are looking at and what to check."
      visual={<ArtworkToStitch id="guide-proof" />}
      ctaHref="/quote?service=embroidery-digitizing"
      related={[
        { href: "/embroidery-digitizing", label: "Embroidery digitizing" },
        { href: "/embroidered-apparel", label: "Embroidered apparel" },
        { href: "/custom-hats", label: "Custom hats & caps" },
      ]}
      sections={[
        {
          heading: "What a stitch preview is",
          body: (
            <p>
              A stitch preview is a rendering generated from the digitized file. It shows every stitch the machine will make: fill areas, satin columns, outlines, the order in
              which colors sew, and the total stitch count. It is usually delivered as a PDF or image alongside the thread color list.
            </p>
          ),
        },
        {
          heading: "What it shows accurately",
          body: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Overall shape, proportions and finished size</li>
              <li>Which details were simplified, thickened or removed to sew cleanly</li>
              <li>Stitch direction and how areas are filled</li>
              <li>Color sequence and the number of thread changes</li>
              <li>Stitch count, which drives production time and, for products, part of the price</li>
            </ul>
          ),
        },
        {
          heading: "What it cannot show",
          body: (
            <>
              <p>
                A rendering is not fabric. It cannot show how a knit stretches, how a fleece pile swallows thin lines, how buckram in a cap resists the needle, or how the
                exact thread shade looks against your garment color. Slight differences in coverage and edge crispness between preview and sew-out are normal.
              </p>
              <p>If the fabric is unusual or the run is large, ask for a physical sew-out photo before bulk production. We will tell you if we think one is needed.</p>
            </>
          ),
        },
        {
          heading: "Approval checklist",
          body: (
            <ol className="list-decimal space-y-1 pl-5">
              <li>Spelling and wording, including capitalization</li>
              <li>Finished size in the unit you specified</li>
              <li>Thread colors against your references</li>
              <li>Placement and orientation on the garment or cap</li>
              <li>Any simplified detail you are happy to accept</li>
              <li>The file format named for your machine</li>
            </ol>
          ),
        },
        {
          heading: "Changes and re-approval",
          body: (
            <p>
              Ask for changes before approving. Adjustments within the same artwork, size and placement are part of the job. Once you approve, that exact version goes to
              production; a later change requires a revised proof and a fresh approval, and may change the production date.
            </p>
          ),
        },
      ]}
    />
  );
}
