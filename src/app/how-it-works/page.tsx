import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { processSteps } from "@/lib/services";

export const metadata = pageMetadata({
  title: "How It Works",
  description: "Send a brief, approve a proof, then receive files or track delivery.",
  path: "/how-it-works",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="Five steps from brief to file or delivery."
        lede="Production does not start until the required proof is approved. Product jobs also wait for the required payment state once checkout is connected."
      />
      <section className="py-16">
        <Container>
          <ol className="space-y-8">
            {processSteps.map((step) => (
              <li key={step.n} className="grid gap-4 border-t border-line pt-6 md:grid-cols-12">
                <p className="text-sm font-semibold text-copper md:col-span-2">{step.n}</p>
                <div className="md:col-span-10">
                  <h2 className="text-3xl font-semibold">{step.title}</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
