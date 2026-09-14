"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { digitizingNav, primaryLinks, productsNav, studioNav, type NavGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  // The menu is "open" only for the path it was opened on, so navigation closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (next: boolean | ((v: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(open) : next;
    setOpenPath(value ? pathname : null);
  };
  const navRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close desktop dropdowns on Escape or when focus/click leaves them.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const closeAll = (except?: HTMLDetailsElement) => {
      nav.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((d) => {
        if (d !== except) d.open = false;
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const openEl = nav.querySelector<HTMLDetailsElement>("details[open]");
        if (openEl) {
          openEl.open = false;
          openEl.querySelector<HTMLElement>("summary")?.focus();
        }
        if (openRef.current) {
          setOpen(false);
          menuTriggerRef.current?.focus();
        }
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!nav.contains(e.target as Node)) closeAll();
    };
    const onFocus = (e: FocusEvent) => {
      if (!nav.contains(e.target as Node)) closeAll();
    };
    const onToggle = (e: Event) => {
      const target = e.target as HTMLDetailsElement;
      if (target.open) closeAll(target);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocus);
    nav.addEventListener("toggle", onToggle, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocus);
      nav.removeEventListener("toggle", onToggle, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-warm/95 backdrop-blur">
      <Container className="flex h-[4.25rem] items-center justify-between gap-4">
        <Link href="/" className="shrink-0 rounded-sm">
          <Logo />
        </Link>

        <nav ref={navRef} className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          <DesktopGroup group={digitizingNav} pathname={pathname} />
          <DesktopGroup group={productsNav} pathname={pathname} />
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-sm px-2.5 py-2 text-[0.86rem] text-ink-soft hover:text-charcoal",
                pathname === item.href && "font-semibold text-charcoal",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <DesktopGroup group={studioNav} pathname={pathname} />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/quote" className="min-h-10 px-4 text-[0.78rem]">
            Request a Quote
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ButtonLink href="/quote" className="min-h-10 px-3 text-[0.72rem]">
            Quote
          </ButtonLink>
          <button
            ref={menuTriggerRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-line bg-card"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-3.5 w-5">
              <span className={cn("absolute left-0 h-px w-full bg-charcoal transition-transform", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 top-1.5 h-px w-full bg-charcoal", open && "opacity-0")} />
              <span className={cn("absolute left-0 h-px w-full bg-charcoal transition-transform", open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </Container>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-warm lg:hidden">
        <Container as="nav" className="flex max-h-[calc(100vh-4.25rem)] flex-col gap-1 overflow-y-auto py-4">
          <MobileGroup group={digitizingNav} />
          <MobileGroup group={productsNav} />
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className="border-b border-line py-3 text-base font-medium">
              {item.label}
            </Link>
          ))}
          <MobileGroup group={studioNav} />
          <ButtonLink href="/quote" className="mt-3 w-full">
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
    <details className="relative">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-1 rounded-sm px-2.5 py-2 text-[0.86rem] text-ink-soft hover:text-charcoal",
          active && "font-semibold text-charcoal",
        )}
      >
        {group.label}
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className="absolute left-0 top-full z-30 mt-1 min-w-60 rounded-sm border border-line bg-card p-2 shadow-lg">
        <Link href={group.href} className="block rounded-sm px-3 py-2 text-sm font-semibold text-blue hover:bg-warm">
          All {group.label}
        </Link>
        {group.children.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-warm hover:text-charcoal"
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

function MobileGroup({ group }: { group: NavGroup }) {
  return (
    <details className="border-b border-line py-1">
      <summary className="flex cursor-pointer items-center justify-between py-2.5 text-base font-medium">
        {group.label}
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className="flex flex-col pb-2 pl-3">
        <Link href={group.href} className="py-2 text-sm font-semibold text-blue">
          All {group.label}
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
