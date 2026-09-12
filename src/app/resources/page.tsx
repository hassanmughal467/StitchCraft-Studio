import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { guides } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Guides: Patches, Proofs, Artwork & Digitizing",
  description: "Practical guides on choosing a patch type, reading embroidery proofs, preparing print artwork and the difference between vector and embroidery files.",
  path: "/resources",
});

const help = [
  { href: "/artwork-guidelines", label: "Artwork guidelines" },
  { href: "/file-formats", label: "File format guide" },
  { href: "/shipping", label: "Shipping & delivery" },
  { href: "/faq", label: "FAQ" },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Guides" title="Short, practical reading before you order" lede="Written from production experience to help you specify the right product and send artwork that works first time." dark={false} />
      <section className="border-b border-line bg-card py-14 sm:py-16">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.href} className="rounded-sm border border-line bg-warm p-6">
                <h2 className="text-xl font-semibold">
                  <Link href={guide.href} className="hover:text-blue">
                    {guide.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{guide.body}</p>
                <Link href={guide.href} className="mt-4 inline-block text-sm font-semibold text-blue hover:underline">
                  Read the guide
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="mt-14 text-lg font-semibold">Reference pages</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {help.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center rounded-full border border-line bg-warm px-4 text-sm font-medium hover:border-blue hover:text-blue">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
