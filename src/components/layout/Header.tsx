"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryNav } from "@/lib/nav";
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
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur-md">
      <Container className="flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/" aria-label="StitchCraft Studio home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[0.78rem] tracking-[0.04em] text-ink-soft transition-colors hover:text-ink",
                  active && "text-ink",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/contact" className="min-h-11 px-5 text-[0.72rem]">
            Request a Quote
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="relative block h-3.5 w-5">
            <span
              className={cn(
                "absolute left-0 h-px w-full bg-ink transition-transform",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 h-px w-full bg-ink transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 h-px w-full bg-ink transition-transform",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </Container>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-ivory lg:hidden"
      >
        <Container className="flex flex-col gap-1 py-5">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-base text-ink"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/contact" className="mt-3 w-full">
            Request a Quote
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
