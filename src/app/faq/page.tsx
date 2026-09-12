import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Artwork, formats, proofs, shipping and quotes.",
  path: "/faq",
});

const faqs = [
  { q: "What artwork should I send?", a: "Vector files are preferred. A sharp PNG or JPG works if the edges are clear. Include size, service and date." },
  { q: "Do you ship to the US, UK and Australia?", a: "Those are the first markets. Charges and windows appear on the quote once the owner confirms partners." },
  { q: "When does production start?", a: "After you approve the exact proof. Product jobs also wait for the required payment state once checkout is live." },
  { q: "Can I reorder?", a: "Yes. Send the previous reference. We confirm any change before running it." },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Practical answers before you send a file." />
      <section className="py-16">
        <Container className="max-w-3xl">
          {faqs.map((item) => (
            <details key={item.q} className="border-b border-line py-5">
              <summary className="cursor-pointer text-xl font-semibold">{item.q}</summary>
              <p className="mt-3 leading-7 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
