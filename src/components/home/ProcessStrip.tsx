import { Container } from "@/components/ui/Container";
import { processSteps } from "@/lib/content";

export function ProcessStrip() {
  return (
    <section className="border-b border-line bg-paper/60 py-16 sm:py-24">
      <Container>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">How it works</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl tracking-[-0.02em] sm:text-5xl">
          Four steps from artwork to a file or finished patch.
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.n} className="border-t border-line-strong pt-5">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-copper">{step.n}</p>
              <h3 className="mt-3 font-display text-2xl tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
