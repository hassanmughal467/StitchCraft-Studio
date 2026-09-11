import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <section className="py-24">
      <Container>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-stone">Loading</p>
        <div className="mt-6 h-12 w-2/3 max-w-md bg-paper" />
        <div className="mt-4 h-4 w-full max-w-xl bg-paper" />
        <div className="mt-2 h-4 w-5/6 max-w-lg bg-paper" />
      </Container>
    </section>
  );
}
