import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "File Format Guide",
  description: "Accepted artwork formats and the embroidery machine and vector formats Stitchcraft Studio delivers.",
  path: "/file-formats",
});

const groups = [
  {
    title: "Artwork we accept",
    rows: [
      ["AI, EPS, PDF, SVG", "Vector. Preferred for all services."],
      ["PNG, JPG, WEBP", "Raster. Send the largest, sharpest version."],
      ["DST, PES, EXP, JEF, EMB, OFM, PXF", "Existing embroidery files for correction or re-sizing."],
    ],
  },
  {
    title: "Embroidery files we deliver",
    rows: [
      ["DST", "Tajima and most commercial multi-head machines"],
      ["PES / PEC", "Brother and Babylock"],
      ["EXP", "Melco and Bernina"],
      ["JEF", "Janome"],
      ["EMB", "Wilcom native file, editable"],
      ["OFM, PXF, others", "On request; name the machine"],
    ],
  },
  {
    title: "Vector and logo files we deliver",
    rows: [
      ["AI, EPS", "Editable master files"],
      ["SVG", "Web and cutting"],
      ["PDF", "Print-ready, with spot colors where specified"],
      ["PNG", "Transparent previews for screen use"],
    ],
  },
];

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Help" title="File format guide" lede="Which files to send and which files you receive." dark={false} />
      <section className="py-12 sm:py-14">
        <Container className="max-w-3xl">
          {groups.map((group) => (
            <div key={group.title} className="mb-10">
              <h2 className="text-xl font-semibold">{group.title}</h2>
              <dl className="mt-4 divide-y divide-line rounded-sm border border-line bg-card">
                {group.rows.map(([format, note]) => (
                  <div key={format} className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium">{format}</dt>
                    <dd className="text-sm leading-6 text-ink-soft sm:col-span-2">{note}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
