"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { digitizingNav, primaryLinks, productsNav, studioNav, type NavGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-warm/95 backdrop-blur">
      <Container className="flex h-[4.25rem] items-center justify-between gap-4">
        <Link href="/" aria-label="Stitchcraft Studio home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          <DesktopGroup group={digitizingNav} pathname={pathname} />
          <DesktopGroup group={productsNav} pathname={pathname} />
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-2 py-2 text-[0.84rem] text-ink-soft hover:text-charcoal",
                pathname === item.href && "text-charcoal",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <DesktopGroup group={studioNav} pathname={pathname} />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/account" className="text-[0.86rem] text-ink-soft hover:text-charcoal">
            Account
          </Link>
          <ButtonLink href="/quote" className="min-h-10 px-4 text-[0.75rem]">
            Request a Quote
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-line bg-card lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="relative block h-3.5 w-5">
            <span className={cn("absolute left-0 h-px w-full bg-charcoal", open ? "top-1.5 rotate-45" : "top-0")} />
            <span className={cn("absolute left-0 top-1.5 h-px w-full bg-charcoal", open && "opacity-0")} />
            <span className={cn("absolute left-0 h-px w-full bg-charcoal", open ? "top-1.5 -rotate-45" : "top-3")} />
          </span>
        </button>
      </Container>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-warm lg:hidden">
        <Container className="flex max-h-[80vh] flex-col gap-1 overflow-y-auto py-4">
          <MobileGroup group={digitizingNav} />
          <MobileGroup group={productsNav} />
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="py-3 text-base">
              {item.label}
            </Link>
          ))}
          <MobileGroup group={studioNav} />
          <Link href="/account" className="py-3 text-base">
            Account
          </Link>
          <ButtonLink href="/quote" className="mt-2 w-full">
            Request a Quote
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}

function DesktopGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const active = pathname === group.href || group.children.some((item) => pathname === item.href);
  return (
    <details className="group relative">
      <summary className={cn("cursor-pointer list-none px-2.5 py-2 text-[0.86rem] text-ink-soft hover:text-charcoal", active && "text-charcoal")}>
        {group.label}
      </summary>
      <div className="absolute left-0 top-full z-30 mt-1 min-w-56 border border-line bg-card p-2 shadow-lg">
        <Link href={group.href} className="block px-3 py-2 text-sm font-medium text-blue">
          All {group.label}
        </Link>
        {group.children.map((item) => (
          <Link key={item.href} href={item.href} className="block px-3 py-2 text-sm text-ink-soft hover:bg-warm hover:text-charcoal">
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

function MobileGroup({ group }: { group: NavGroup }) {
  return (
    <details className="border-b border-line py-2">
      <summary className="cursor-pointer py-2 text-base font-medium">{group.label}</summary>
      <div className="flex flex-col pb-2 pl-3">
        <Link href={group.href} className="py-2 text-sm text-blue">
          Overview
        </Link>
        {group.children.map((item) => (
          <Link key={item.href} href={item.href} className="py-2 text-sm">
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
