export type NavItem = {
  href: string;
  label: string;
};

export const primaryNav: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/embroidery-digitizing", label: "Digitizing" },
  { href: "/custom-patches", label: "Patches" },
  { href: "/portfolio", label: "Work" },
  { href: "/how-it-works", label: "Process" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export const footerServices: NavItem[] = [
  { href: "/embroidery-digitizing", label: "Embroidery digitizing" },
  { href: "/custom-patches", label: "Custom embroidered patches" },
  { href: "/services#logo-digitizing", label: "Logo digitizing" },
  { href: "/services#jacket-back", label: "Jacket-back patches" },
  { href: "/services#caps", label: "Hat and cap files" },
  { href: "/services#applique", label: "Appliqué digitizing" },
  { href: "/services#puff", label: "3D puff embroidery" },
  { href: "/services#chenille", label: "Chenille and woven patches" },
  { href: "/services#vector", label: "Vector artwork preparation" },
  { href: "/services#bulk", label: "Bulk order support" },
];

export const footerCompany: NavItem[] = [
  { href: "/about", label: "About the studio" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/industries", label: "Industries we serve" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Request a quote" },
];

export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
