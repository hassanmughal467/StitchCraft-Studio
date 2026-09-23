import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What information Brandstitch Works collects through quote requests, how artwork is stored, and how to ask for deletion.",
  path: "/privacy",
});

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="Policy" title="Privacy" lede="We collect only what is needed to quote and produce your job. This page explains what that is and how it is handled." dark={false} />
      <section className="py-12 sm:py-14">
        <Container className="prose-site max-w-2xl leading-7 text-ink-soft">
          <h2 className="text-xl font-semibold text-charcoal">What we collect</h2>
          <p>
            When you request a quote we collect your name, business name (if any), email, phone number (if given), country, delivery details for product orders, the job
            specification and any artwork you upload. We also record the page the request came from and a hashed network address for abuse prevention.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">How it is used</h2>
          <p>
            To reply to you, prepare the quote, produce the job, ship it and handle corrections. We do not sell or share your details for marketing. Studio updates are sent
            only if you tick the optional box, and you can unsubscribe at any time.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Artwork</h2>
          <p>
            Uploaded files are stored privately for quoting and production and are never made public. We do not publish customer work without written permission. Files are
            kept so repeat orders can reuse the approved version; email us with your reference to have them deleted.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Service providers</h2>
          <p>
            The website is hosted on Vercel. Quote confirmations and staff notifications are sent through a transactional email provider. These providers process data on our
            behalf under their own terms.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Cookies and analytics</h2>
          <p>Only cookies essential to running the site are set. Any analytics added in future will run only with your consent and will never receive artwork or contact details.</p>
          <h2 className="mt-8 text-xl font-semibold text-charcoal">Your rights and contact</h2>
          <p>
            You can ask for a copy of the information we hold about you, corrections, or deletion. {site.email ? `Contact ${site.email}.` : "Use the contact page to reach us."}
          </p>
        </Container>
      </section>
    </>
  );
}
