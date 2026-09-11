import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How StitchCraft Studio handles quote requests, artwork files, and contact details.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Legal"
        title="Privacy"
        lede="This page describes how quote requests and uploaded artwork are handled. Replace this text with counsel-reviewed policy before launch."
      />
      <section className="py-16">
        <Container className="prose-site max-w-2xl text-base leading-7 text-ink-soft">
          <p>
            When you submit the quote form, we collect the name, company, email, phone number, project
            details, and any artwork you attach. That information is used only to reply, prepare a quote,
            and produce the files or patches you order.
          </p>
          <p>
            Artwork is treated as confidential. We do not publish client marks as testimonials or logos
            unless you give written permission.
          </p>
          <p>
            If a third-party form or email provider is connected (Formspree or Resend), their processing
            terms also apply. Until those credentials are added, submissions stay on this server as a
            test confirmation and are not forwarded.
          </p>
          <p>
            Questions: <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </Container>
      </section>
    </>
  );
}
