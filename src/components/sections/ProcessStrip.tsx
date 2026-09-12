import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/services";

export function ProcessStrip({ dark = false }: { dark?: boolean }) {
  return (
    <section className={dark ? "border-b border-charcoal bg-charcoal py-16 text-card sm:py-20" : "border-b border-line py-16 sm:py-20"}>
      <Container>
        <SectionHeading
          eyebrow="How ordering works"
          title="Four steps from artwork to files or finished products"
          lede="Payment terms depend on the service and are written on your quote: digital files are released on payment; product orders start production after proof approval and payment."
          invert={dark}
        />
        <ol className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.n} className={dark ? "bg-charcoal p-6" : "bg-card p-6"}>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-copper-dark text-[0.72rem] font-bold text-card">{step.n}</span>
                <span className="h-px flex-1 bg-line" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className={dark ? "mt-2 text-sm leading-6 text-card/70" : "mt-2 text-sm leading-6 text-ink-soft"}>{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
