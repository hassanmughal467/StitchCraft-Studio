import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms of use for the StitchCraft Studio website and quote requests.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Legal"
        title="Terms"
        lede="These terms cover use of the website and quote requests. Have them reviewed before taking paid work through this site."
      />
      <section className="py-16">
        <Container className="prose-site max-w-2xl text-base leading-7 text-ink-soft">
          <p>
            Quotes are estimates based on the artwork and details you provide. Production does not start
            until you approve a proof and confirm the order in writing.
          </p>
          <p>
            You confirm that you have the right to use the artwork you upload. {site.name} is not
            responsible for marks submitted without permission.
          </p>
          <p>
            Digitizing files are licensed for the placements described in the job. Sharing a file with a
            third-party shop for that same job is expected. Reselling the file as a stock design is not.
          </p>
          <p>
            This website may show placeholder photography and contact details until launch assets are
            supplied. Those stand-ins are not samples of completed client work.
          </p>
        </Container>
      </section>
    </>
  );
}
