import { GuideLayout } from "@/components/sections/GuideLayout";
import { RasterVsVector } from "@/components/visuals/ServiceVisual";
import { pageMetadata } from "@/lib/seo";

const href = "/resources/vector-vs-digitizing";
const title = "Vector tracing vs embroidery digitizing";
const description = "The difference between a vector logo file and an embroidery file, why one does not replace the other, and which you need for your job.";

export const metadata = pageMetadata({ title, description, path: href, type: "article" });

export default function Page() {
  return (
    <GuideLayout
      href={href}
      title={title}
      description={description}
      intro="Both services turn a logo into a production file, but the files are for different machines. A vector file drives printers and cutters; an embroidery file drives a sewing machine. Most brands eventually need both."
      visual={<RasterVsVector />}
      ctaHref="/quote?service=vector-tracing"
      related={[
        { href: "/vector-tracing", label: "Vector tracing" },
        { href: "/embroidery-digitizing", label: "Embroidery digitizing" },
        { href: "/custom-logo-design", label: "Custom logo design" },
      ]}
      sections={[
        {
          heading: "What a vector file is",
          body: (
            <p>
              A vector file (AI, EPS, SVG, PDF) describes shapes mathematically as paths, so it scales from a business card to a banner without blurring. It is the master
              artwork for screen printing, vinyl cutting, signage, engraving and print. Vector tracing rebuilds a low-quality JPG or PNG logo into this form.
            </p>
          ),
        },
        {
          heading: "What an embroidery file is",
          body: (
            <p>
              An embroidery file (DST, PES, EXP, JEF, EMB and others) is a list of needle movements: where each stitch goes, in what order, with which thread. It is created by
              digitizing: an operator decides stitch types, directions, densities, underlay and pull compensation for a specific size and fabric. Software cannot simply
              &ldquo;convert&rdquo; a vector into a good embroidery file.
            </p>
          ),
        },
        {
          heading: "Why a vector still needs digitizing",
          body: (
            <>
              <p>
                A clean vector is the best starting point for digitizing because the shapes are exact. But the embroidery file still has to be built by hand for the placement:
                a left-chest logo at 3.5 in, a cap front at 2.25 in and a jacket back at 11 in are three different files, even from the same vector.
              </p>
              <p>Likewise, an embroidery file is useless for printing. If you only have a DST of your logo, you will need a vector redraw before it can be screen printed.</p>
            </>
          ),
        },
        {
          heading: "Which do you need?",
          body: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Printing shirts, signs, stickers or stationery: vector tracing</li>
              <li>Embroidering caps, polos, jackets or making embroidered patches: embroidery digitizing</li>
              <li>Both, from a low-quality logo: vector tracing first, then digitizing from the clean vector</li>
              <li>No logo yet: custom logo design, delivered as vector and ready to digitize</li>
            </ul>
          ),
        },
        {
          heading: "Ordering both together",
          body: <p>When you need both, request them on one quote. We redraw the vector, get your approval, then digitize from the approved artwork so the two match exactly.</p>,
        },
      ]}
    />
  );
}
