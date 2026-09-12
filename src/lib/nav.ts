import { hasPublishedPortfolio } from "@/lib/portfolio";

export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  href: string;
  label: string;
  children: NavItem[];
};

export const digitizingNav: NavGroup = {
  href: "/digitizing-artwork",
  label: "Digitizing & Artwork",
  children: [
    { href: "/embroidery-digitizing", label: "Embroidery Digitizing" },
    { href: "/vector-tracing", label: "Vector Tracing" },
    { href: "/custom-logo-design", label: "Custom Logo Design" },
  ],
};

export const productsNav: NavGroup = {
  href: "/custom-products",
  label: "Custom Products",
  children: [
    { href: "/custom-patches", label: "Custom Patches" },
    { href: "/embroidered-apparel", label: "Embroidered Apparel" },
    { href: "/screen-printing", label: "Screen Printing" },
    { href: "/custom-hats", label: "Custom Hats & Caps" },
  ],
};

export const studioNav: NavGroup = {
  href: "/about",
  label: "Studio",
  children: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
    { href: "/resources", label: "Guides" },
    { href: "/faq", label: "FAQ" },
  ],
};

/** Portfolio appears in navigation only once published work exists. */
export const primaryLinks: NavItem[] = [
  ...(hasPublishedPortfolio() ? [{ href: "/portfolio", label: "Portfolio" }] : []),
  { href: "/trade", label: "For Trade" },
  { href: "/contact", label: "Contact" },
];

export const footerServices: NavItem[] = [...digitizingNav.children, ...productsNav.children];

export const footerHelp: NavItem[] = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping & delivery" },
  { href: "/artwork-guidelines", label: "Artwork guidelines" },
  { href: "/file-formats", label: "File format guide" },
  { href: "/quote", label: "Request a quote" },
];

export const footerCompany: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/trade", label: "For trade" },
  ...(hasPublishedPortfolio() ? [{ href: "/portfolio", label: "Portfolio" }] : []),
  { href: "/resources", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund & remake" },
  { href: "/cookies", label: "Cookies" },
  { href: "/accessibility", label: "Accessibility" },
];
