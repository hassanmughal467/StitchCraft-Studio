"use client";

import { track } from "@/lib/analytics";

/** Anchor for mailto/tel/WhatsApp links that records the chosen method (no contact data). */
export function ContactLink({ href, method, external, className, children, ...rest }: { href: string; method: "email" | "whatsapp" | "phone"; external?: boolean; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  return (
    <a href={href} className={className} onClick={() => track({ name: "contact_method_selected", method })} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}
