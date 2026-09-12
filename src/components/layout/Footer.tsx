import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerCompany, footerHelp, footerServices, legalNav } from "@/lib/nav";
import { mailtoHref, site, telHref, whatsappHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-charcoal text-card">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo invert />
            <p className="mt-5 max-w-sm text-sm leading-6 text-card/70">
              {site.base}. Priority markets: {site.priorityMarkets.join(", ")}.
            </p>
            <dl className="mt-6 space-y-2 text-sm text-card/80">
              <dd>
                <a href={mailtoHref()}>{site.email}</a>
              </dd>
              <dd>
                <a href={telHref()}>{site.phoneDisplay}</a>
              </dd>
              <dd>{site.hours}</dd>
            </dl>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            <List title="Services" items={footerServices} />
            <List title="Help" items={footerHelp} />
            <div>
              <List title="Studio" items={footerCompany} />
              <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-card/45">Connect</p>
              <ul className="mt-3 space-y-2 text-sm text-card/75">
                <li>
                  <a href={whatsappHref()} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={site.social.instagram}>Instagram</a>
                </li>
                <li>
                  <a href={site.social.linkedin}>LinkedIn</a>
                </li>
                <li>
                  <a href={site.social.facebook}>Facebook</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <form className="mt-12 max-w-md border-t border-card/10 pt-8" action="/contact" method="get">
          <p className="text-sm text-card/70">
            Newsletter sign-up is optional. We only email if you consent. No artwork is sent to this list.
          </p>
          <label htmlFor="newsletter-email" className="mt-3 block text-sm">
            Email for updates
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              className="min-h-11 flex-1 border border-card/20 bg-charcoal px-3 text-sm"
              placeholder="you@company.com"
            />
            <Link href="/contact" className="inline-flex min-h-11 items-center bg-card px-4 text-sm font-semibold text-charcoal">
              Contact
            </Link>
          </div>
        </form>
        <div className="mt-10 flex flex-col gap-4 border-t border-card/10 pt-6 text-xs text-card/45 sm:flex-row sm:justify-between">
          <p>© {site.copyrightYear} {site.name}. {site.address.country}.</p>
          <div className="flex flex-wrap gap-4">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-card">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function List({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-card/45">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-card/75">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-card">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
