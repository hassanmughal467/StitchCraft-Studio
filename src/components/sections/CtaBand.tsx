import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CtaBand({
  title = "Send the artwork. We will tell you what the file or patch needs.",
  body = "Include size, garment or patch type, quantity, and your deadline. You will get a clear quote — not a follow-up asking for the same details twice.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-steel text-ivory">
      <Container className="flex flex-col items-start justify-between gap-8 py-16 sm:py-20 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ivory/55">
            Request a quote
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.12] tracking-[-0.02em] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-7 text-ivory/72">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact" variant="invert">
            Request a Quote
          </ButtonLink>
          <ButtonLink href="/contact#quote-form" variant="invertGhost">
            Upload artwork
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
