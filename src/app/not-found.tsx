import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-2xl">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">404</p>
        <h1 className="mt-4 font-display text-5xl tracking-[-0.03em] sm:text-6xl">
          That page is not on the pattern.
        </h1>
        <p className="mt-5 text-base leading-7 text-ink-soft">
          The address may have changed, or the page does not exist. Use the links below to get back to
          the work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Request a Quote
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
