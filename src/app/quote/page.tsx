import { QuoteForm } from "@/components/quote/QuoteForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { quoteServiceIds } from "@/lib/quote";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description: "Request a quote for digitizing, vector work, patches, apparel, print or caps.",
  path: "/quote",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const initialService = quoteServiceIds.includes(params.service ?? "") ? params.service : "";

  return (
    <>
      <PageHero
        eyebrow="Quote"
        title="Request a quote. Upload the artwork if you have it."
        lede="Step one is who you are and which service. Step two is only the fields that service needs. Uploaded files stay attached if a field needs a correction."
      />
      <section className="py-16">
        <Container className="max-w-3xl border border-line">
          <QuoteForm initialService={initialService} />
        </Container>
      </section>
    </>
  );
}
