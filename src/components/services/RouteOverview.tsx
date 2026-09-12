import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/seo";
import { routes, services, type ServiceRoute } from "@/lib/services";

export function RouteOverview({ route, lede, points }: { route: ServiceRoute; lede: string; points: string[] }) {
  const info = routes.find((r) => r.id === route)!;
  const list = services.filter((s) => s.route === route);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: info.title, path: info.href }])} />
      <section className="border-b border-line bg-warm">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <Eyebrow>{route === "digitizing" ? "Files delivered by download" : "Products made to order and shipped"}</Eyebrow>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">{info.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">{lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/quote?service=${list[0].id}`}>Request a Quote</ButtonLink>
            </div>
          </div>
          <ul className="grid gap-3 self-center lg:col-span-5">
            {points.map((point) => (
              <li key={point} className="flex gap-3 rounded-sm border border-line bg-card p-4 text-sm leading-6 text-ink-soft">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="border-b border-line bg-card py-14 sm:py-16">
        <Container>
          <ul className={`grid gap-5 sm:grid-cols-2 ${list.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {list.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ul>
        </Container>
      </section>
      <ProcessStrip />
      <CtaBand />
    </>
  );
}
