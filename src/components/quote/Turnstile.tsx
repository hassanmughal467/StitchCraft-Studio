"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void; "error-callback"?: () => void; theme?: "light" | "dark" | "auto"; size?: "normal" | "compact" | "flexible" }) => string;
      remove: (id: string) => void;
    };
    __scTurnstileLoaded?: () => void;
  }
}

/**
 * Cloudflare Turnstile widget. Rendered only when NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * is set and the server has the matching secret. Loads the script on demand so
 * pages without the form never download it.
 */
export function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = () => {
      if (!window.turnstile || idRef.current) return;
      idRef.current = window.turnstile.render(el, { sitekey: siteKey, callback: onToken, "expired-callback": () => onToken(""), "error-callback": () => onToken(""), theme: "light", size: "flexible" });
    };
    if (window.turnstile) render();
    else {
      window.__scTurnstileLoaded = render;
      if (!document.querySelector('script[data-turnstile="1"]')) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__scTurnstileLoaded";
        script.async = true;
        script.defer = true;
        script.dataset.turnstile = "1";
        document.head.appendChild(script);
      }
    }
    return () => {
      if (idRef.current && window.turnstile) window.turnstile.remove(idRef.current);
      idRef.current = null;
    };
  }, [siteKey, onToken]);

  return <div ref={ref} className="min-h-16 sm:col-span-2" aria-label="Spam check" />;
}
