"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { track } from "@/lib/analytics";
import { activeOffers } from "@/lib/config/offers";

const storageKey = (campaign: string) => `sc_offer_dismissed:${campaign}`;

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function dismissedSnapshot() {
  try {
    return Object.keys(window.localStorage)
      .filter((key) => key.startsWith("sc_offer_dismissed:"))
      .join("|");
  } catch {
    return "";
  }
}

function dismissedServerSnapshot() {
  return "";
}

function isDismissed(campaign: string, snapshot: string) {
  return snapshot.split("|").includes(storageKey(campaign));
}

export function AnnouncementBanner() {
  const pathname = usePathname() || "/";
  const dismissed = useSyncExternalStore(subscribe, dismissedSnapshot, dismissedServerSnapshot);
  const [sessionHidden, setSessionHidden] = useState<string | null>(null);
  const candidates = useMemo(() => activeOffers(pathname), [pathname]);
  const offer = candidates.find((item) => item.campaign !== sessionHidden && !(item.dismissible && isDismissed(item.campaign, dismissed))) ?? null;

  useEffect(() => {
    if (offer) track({ name: "offer_banner_viewed", campaign: offer.campaign });
  }, [offer]);

  const dismiss = useCallback(() => {
    if (!offer) return;
    try {
      window.localStorage.setItem(storageKey(offer.campaign), "1");
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey(offer.campaign) }));
    } catch {
      setSessionHidden(offer.campaign);
    }
    track({ name: "offer_banner_dismissed", campaign: offer.campaign });
    setSessionHidden(offer.campaign);
  }, [offer]);

  if (!offer) return null;

  const link =
    offer.href && offer.linkLabel ? (
      <Link
        href={offer.href}
        className="font-semibold text-copper-soft underline-offset-2 hover:underline"
        onClick={() => track({ name: "offer_banner_clicked", campaign: offer.campaign })}
      >
        {offer.linkLabel}
      </Link>
    ) : null;

  return (
    <div className="border-b border-blue-dark bg-blue text-card" role="region" aria-label="Studio announcement">
      <Container className="flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-sm leading-5 sm:min-h-11">
        <p className="min-w-0 flex-1">
          {offer.message}
          {link ? <span> {link}</span> : null}
        </p>
        {offer.dismissible ? (
          <button type="button" onClick={dismiss} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-card hover:bg-card/10" aria-label="Dismiss announcement">
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        ) : null}
      </Container>
    </div>
  );
}
