import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { services } from "@/lib/content";

export function ServiceGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <section className="border-b border-line py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-copper">Services</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.02em] sm:text-5xl">
              Digitizing, patches, and the files shops actually run.
            </h2>
          </div>
          {limit ? (
            <Link href="/services" className="text-sm text-ink underline-offset-4 hover:underline">
              All services
            </Link>
          ) : null}
        </div>
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {list.map((service, index) => (
            <li key={service.id} className="bg-ivory p-7">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-stone">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-2xl tracking-[-0.02em]">
                <Link href={service.href} className="hover:text-copper">
                  {service.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{service.summary}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
