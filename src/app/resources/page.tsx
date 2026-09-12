import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { guides } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Resources",
  description: "Guides for patch types, embroidery proofs and print-ready artwork.",
  path: "/resources",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Short guides before you send a file." />
      <section className="py-16">
        <Container className="grid gap-4 md:grid-cols-3">
          {guides.map((guide) => (
            <article key={guide.href} className="border border-line bg-card p-6">
              <h2 className="text-xl font-semibold">
                <Link href={guide.href}>{guide.title}</Link>
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{guide.body}</p>
            </article>
          ))}
        </Container>
      </section>
    </>
  );
}
