import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Choosing a patch type",
  description: "When embroidered, woven, PVC or chenille is the better fit.",
  path: "/resources/choosing-a-patch-type",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Guide" title="Choosing a patch type" />
      <section className="py-16">
        <Container className="prose-site max-w-2xl text-ink-soft">
          <p>Embroidered patches suit badges with a merrowed or cut edge. Woven patches hold finer type. PVC suits outdoor or simple shapes. Chenille suits varsity letters. Printed or leather options are quoted only where we can supply them.</p>
          <p>Send the size, quantity, backing and destination. We will say if a type is a poor fit for the artwork.</p>
        </Container>
      </section>
    </>
  );
}
