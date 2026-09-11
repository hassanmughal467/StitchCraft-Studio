import { Container } from "@/components/ui/Container";

const items = [
  {
    title: "Clean stitch paths",
    body: "Travel, trims, and lock stitches are planned so the machine is not fighting the file. Fewer stops, fewer thread breaks.",
  },
  {
    title: "Sensible stitch counts",
    body: "Density is set for the fabric and size you named. Over-digitized fills cost time and distort garments.",
  },
  {
    title: "Proofs before release",
    body: "You see a stitch preview and can request changes. Files and patch jobs do not move until you approve.",
  },
  {
    title: "Shop-ready formats",
    body: "We deliver the format your machine runs, with color notes you can hand to the operator.",
  },
];

export function TrustHighlights() {
  return (
    <section className="border-b border-line bg-ivory py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">
              Why shops come back
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.02em]">
              Built for the run, not the mockup.
            </h2>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
            {items.map((item) => (
              <li key={item.title} className="border-t border-line pt-5">
                <h3 className="font-display text-2xl tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
