import { Container } from "@/components/ui/Container";

export function QualityCompare() {
  return (
    <section className="bg-ink py-16 text-ivory sm:py-24">
      <Container>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">
          Production-ready vs. poor digitizing
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl tracking-[-0.02em] sm:text-5xl">
          A file can look finished and still fail on the garment.
        </h2>
        <div className="mt-12 grid gap-px bg-ivory/12 sm:grid-cols-2">
          <article className="bg-ink p-8 sm:p-10">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ivory/45">
              Common problems
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-ivory/75">
              <li>Auto-digitized fills with no underlay, so the design sinks and gaps on wash.</li>
              <li>Hairline detail that looks sharp on screen and disappears at sew size.</li>
              <li>One file stretched across cap, chest, and jacket back.</li>
              <li>Color changes and travels that force the operator to stop and trim by hand.</li>
            </ul>
          </article>
          <article className="bg-ink p-8 sm:p-10">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-copper">
              What we deliver
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-ivory/75">
              <li>Underlay and density chosen for the fabric you named, not a default preset.</li>
              <li>Detail reduced or rebuilt so it holds after the first wash cycle.</li>
              <li>Separate files when the placement changes the stitch type or scale.</li>
              <li>Pathing and trims a shop can run without rewriting the job on the machine.</li>
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
