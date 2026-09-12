import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How quote requests and artwork are handled.",
  path: "/privacy",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Legal" title="Privacy" lede="Draft until counsel reviews it. Quote details and artwork are used to reply and produce the job." />
      <section className="py-12">
        <Container className="prose-site max-w-2xl text-ink-soft">
          <p>We do not publish a customer mark without permission. If Formspree or Resend is connected, their terms also apply. Questions: {site.email}.</p>
        </Container>
      </section>
    </>
  );
}
