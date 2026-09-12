import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Cookies", description: "Which cookies the Stitchcraft Studio website uses.", path: "/cookies" });

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Policy" title="Cookies" lede="This website does not use advertising or tracking cookies." dark={false} />
      <section className="py-12 sm:py-14">
        <Container className="prose-site max-w-2xl leading-7 text-ink-soft">
          <p>
            The site sets only the cookies needed to operate, for example to remember a form session while you complete it. No analytics or advertising cookies are set. If
            analytics are introduced, they will be switched on only after you give consent, and this page will list the cookies involved.
          </p>
        </Container>
      </section>
    </>
  );
}
