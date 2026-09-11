"use client";

import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function ErrorState({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-24">
      <Container className="max-w-2xl">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">Error</p>
        <h1 className="mt-4 font-display text-4xl tracking-[-0.02em]">
          This page could not be loaded.
        </h1>
        <p className="mt-4 text-base leading-7 text-ink-soft">
          Try again, or send the quote by email or WhatsApp if the form is unavailable.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/contact" variant="secondary">
            Contact
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
