import { ClientBoard } from "@/components/portfolio/ClientBoard";
import { Container } from "@/components/ui/Container";

export function ClientPreview() {
  return (
    <section className="border-b border-line py-16">
      <Container>
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-copper">
            Client gallery
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
            Space for the brands we actually sew.
          </h2>
          <p className="mt-4 leading-7 text-ink-soft">
            This board is reserved for approved client marks and sew-outs. Nothing here is a fake logo
            or invented case study. When a client agrees to be shown, the slot is replaced with their work.
          </p>
        </div>
        <div className="mt-12">
          <ClientBoard limit={4} />
        </div>
      </Container>
    </section>
  );
}
