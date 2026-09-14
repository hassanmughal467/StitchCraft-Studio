import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { footerCompany, footerHelp, footerServices, legalNav } from "@/lib/nav";
import { site, socialLinks } from "@/lib/site";

export function Footer() {
  const addressParts = [site.address.line1, site.address.city, site.address.country].filter(Boolean);

  return (
    <footer className="bg-charcoal text-card">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo invert />
            <p className="mt-5 max-w-sm text-sm leading-6 text-card/70">{site.location}</p>
            <div className="mt-6 max-w-sm">
              <ContactChannels compact invert message="Hello Stitchcraft Studio, I have a question." />
            </div>
            <p className="mt-4 text-sm text-card/60">{addressParts.join(", ")}</p>
            {socialLinks.length ? (
              <ul className="mt-5 flex flex-wrap gap-4 text-sm text-card/75">
                {socialLinks.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noreferrer" className="hover:text-card">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            <List title="Services" items={footerServices} />
            <List title="Help" items={footerHelp} />
            <List title="Studio" items={footerCompany} />
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-card/10 pt-6 text-xs text-card/50 sm:flex-row sm:justify-between">
          <p>
            © {site.copyrightYear} {site.legalName ?? site.name}. {site.address.country}.
          </p>
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
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-card/50">{title}</p>
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
