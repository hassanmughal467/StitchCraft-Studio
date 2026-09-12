import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Cookies", description: "Cookie and analytics preferences.", path: "/cookies" });

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Legal" title="Cookie preferences" lede="Analytics, if added, will be consent-aware and will not send artwork or emails to analytics tools." />
      <section className="py-12">
        <Container className="max-w-2xl text-ink-soft">
          <p>Essential cookies for the site to run do not require a marketing opt-in. A preference banner will ship with the analytics configuration.</p>
        </Container>
      </section>
    </>
  );
}
