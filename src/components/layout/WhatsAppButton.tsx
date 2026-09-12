import { whatsappHref } from "@/lib/site";

/** Rendered only when a WhatsApp number is configured. Kept clear of form controls on mobile. */
export function WhatsAppButton() {
  const href = whatsappHref();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-blue px-4 text-card shadow-lg transition-transform hover:-translate-y-0.5 sm:bottom-5 sm:right-5"
      aria-label="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.4-1.4a10.1 10.1 0 0 0 4.64 1.13h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.85 14.12c-.25.7-1.44 1.28-2.01 1.36-.51.07-1.16.1-1.87-.12-.43-.13-.98-.32-1.7-.63-2.99-1.29-4.93-4.3-5.08-4.5-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37h.57c.18 0 .42-.07.66.5.25.6.85 2.07.92 2.22.08.15.12.32.02.52-.1.2-.14.32-.28.5-.14.17-.3.39-.42.52-.14.15-.29.31-.12.6.16.3.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.44.12.6-.07.17-.2.7-.81.88-1.09.19-.27.37-.23.63-.14.25.1 1.6.75 1.88.89.27.14.45.2.52.32.06.12.06.7-.18 1.4Z" />
      </svg>
      <span className="text-sm font-semibold">WhatsApp</span>
    </a>
  );
}
