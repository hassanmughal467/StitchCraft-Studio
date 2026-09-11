import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerCompany, footerServices, legalNav } from "@/lib/nav";
import { site, mailtoHref, telHref, whatsappHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo invert />
            <p className="mt-6 max-w-sm text-sm leading-6 text-ivory/68">
              {site.tagline}. Clean stitch files and custom patches for brands,
              teams, uniforms, and embroidery shops.
            </p>
            <dl className="mt-8 space-y-2 text-sm text-ivory/80">
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  <a className="hover:text-ivory" href={mailtoHref()}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>
                  <a className="hover:text-ivory" href={telHref()}>
                    {site.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Hours</dt>
                <dd>{site.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <FooterList title="Services" items={footerServices} />
            <FooterList title="Studio" items={footerCompany} />
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ivory/45">
                Connect
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ivory/78">
                <li>
                  <a href={whatsappHref()} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={site.social.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={site.social.facebook} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory/12 pt-6 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-5">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-ivory">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterList({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ivory/45">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-sm text-ivory/78">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link href={item.href} className="hover:text-ivory">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
