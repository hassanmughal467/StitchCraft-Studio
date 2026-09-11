import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { processSteps } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How It Works",
  description:
    "Submit artwork, review and digitize, approve the proof, then receive production files or finished patches from StitchCraft Studio.",
  path: "/how-it-works",
});

const extras = [
  {
    title: "Revisions",
    body: "Changes that stay inside the original brief — a color swap, a small move, a density note — are part of the proof. A new size or a redesigned mark is a new file.",
  },
  {
    title: "Rush work",
    body: "Possible when the queue allows. Put the hard date on the form. We will say yes or no before you wait on a file that cannot meet it.",
  },
  {
    title: "Reorders",
    body: "Approved files are archived. Send the original reference and we can pull the same file or a new colorway without starting over.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="Submit artwork. Approve the proof. Receive the file or the patches."
        lede="The steps stay the same whether you need one left-chest logo or a patch run for a merch drop. Clear inputs mean a quote you can plan around."
      />
      <section className="border-b border-line py-16 sm:py-20">
        <Container>
          <ol className="space-y-12">
            {processSteps.map((step) => (
              <li key={step.n} className="grid gap-6 border-t border-line pt-8 md:grid-cols-12">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-copper md:col-span-2">
                  {step.n}
                </p>
                <div className="md:col-span-10">
                  <h2 className="font-display text-4xl tracking-[-0.02em]">{step.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container className="grid gap-8 md:grid-cols-3">
          {extras.map((item) => (
            <article key={item.title} className="bg-cream p-7">
              <h2 className="font-display text-2xl tracking-[-0.02em]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
