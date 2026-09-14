import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CtaBand({
  title = "Tell us what you need",
  body = "Send the service, artwork, quantity and date. We reply with an itemized quote and timing.",
  href = "/quote",
  cta = "Request a quote",
}: {
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="bg-blue text-card">
      <Container className="flex flex-col items-start justify-between gap-8 py-14 sm:py-16 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper-soft">Next step</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-7 text-card/75">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={href} variant="invert">
            {cta}
          </ButtonLink>
          <ButtonLink href="/contact" variant="invertGhost">
            Contact Us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
