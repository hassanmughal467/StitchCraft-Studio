import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getService, type ServicePage as Service } from "@/lib/services";

export function ServiceView({ service }: { service: Service }) {
  const related = service.related.map((id) => getService(id)).filter(Boolean);

  return (
    <>
      <PageHero eyebrow={service.title} title={service.heading} lede={service.lede}>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/quote?service=${service.id}`} variant="invert">
            Request a Quote
          </ButtonLink>
          <ButtonLink href="/portfolio" variant="invertGhost">
            View examples
          </ButtonLink>
        </div>
      </PageHero>
      <section className="border-b border-line py-14">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Who this is for</h2>
            <p className="mt-3 leading-7 text-ink-soft">{service.buyer}</p>
            <p className="mt-4 leading-7 text-ink-soft">{service.outcome}</p>
            <p className="mt-4 text-sm leading-6 text-stone">
              Studio examples for this service are reserved on the{" "}
              <Link href="/portfolio" className="font-semibold text-blue">
                portfolio
              </Link>
              . Placeholder photography is labeled until real sew-outs replace it.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Deliverables</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <section className="border-b border-line bg-card py-14">
        <Container className="grid gap-10 md:grid-cols-2">
          <Block title="Accepted input" items={service.inputs} />
          <Block title="Options" items={service.options} />
          <Block title="Limits" items={service.limits} />
          <Block title="Process" items={service.process} />
        </Container>
      </section>
      <section className="border-b border-line py-14">
        <Container className="grid gap-8 lg:grid-cols-3">
          <article>
            <h2 className="text-xl font-semibold">Timing</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{service.turnaround}</p>
          </article>
          <article>
            <h2 className="text-xl font-semibold">How we price</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{service.pricing}</p>
          </article>
          <article>
            <h2 className="text-xl font-semibold">Revisions</h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{service.revisions}</p>
          </article>
        </Container>
      </section>
      <section className="border-b border-line py-14">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-semibold">Questions</h2>
          {service.faqs.map((item) => (
            <details key={item.q} className="border-b border-line py-4">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </Container>
      </section>
      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-semibold">Related services</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) =>
              item ? (
                <li key={item.id} className="border border-line bg-card p-5">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{item.outcome}</p>
                  <ButtonLink href={item.href} variant="ghost" className="mt-4 min-h-10 px-0">
                    View {item.title}
                  </ButtonLink>
                </li>
              ) : null,
            )}
          </ul>
          <div className="mt-10">
            <ButtonLink href={`/quote?service=${service.id}`}>Start a quote for {service.title}</ButtonLink>
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-soft">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
