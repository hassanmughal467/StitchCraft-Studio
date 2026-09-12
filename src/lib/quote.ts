import { services } from "@/lib/services";
import { fileUpload } from "@/lib/site";

export const customerTypes = ["Business", "Individual"] as const;
export const contactMethods = ["Email", "WhatsApp", "Phone"] as const;
export const countries = ["United States", "United Kingdom", "Australia", "Canada", "New Zealand", "Other"] as const;
export const units = ["in", "mm"] as const;
export const quoteServiceIds = services.map((item) => item.id);

export const digitalServices = ["embroidery-digitizing", "vector-tracing", "custom-logo-design"];
export const physicalServices = ["custom-patches", "embroidered-apparel", "screen-printing", "custom-hats"];

/** Product/type choices shown per physical service (drives the "Product" select). */
export const productTypes: Record<string, string[]> = {
  "custom-patches": ["Embroidered", "Woven", "PVC", "Chenille", "Printed / sublimated", "Leather", "Not sure, please recommend"],
  "embroidered-apparel": ["Polos", "T-shirts", "Hoodies / sweatshirts", "Jackets / softshells", "Workwear / hi-vis", "Aprons", "Mixed order"],
  "screen-printing": ["T-shirts", "Hoodies / sweatshirts", "Long sleeves", "Tote bags", "Mixed order"],
  "custom-hats": ["Structured 6-panel", "Unstructured / dad hat", "Trucker", "5-panel / flat peak", "Beanie", "Not sure, please recommend"],
};

export const materialOptions: Record<string, string[]> = {
  "custom-patches": ["Iron-on backing", "Sew-on backing", "Hook-and-loop backing", "Adhesive backing", "Merrowed border", "Hot-cut / laser-cut border"],
  "custom-hats": ["Flat embroidery", "3D puff", "Applied patch", "Side embroidery", "Back embroidery"],
  "embroidered-apparel": ["Left chest", "Right chest / name", "Sleeve", "Full back", "Nape"],
  "screen-printing": ["Full front", "Left chest", "Full back", "Sleeve", "Nape"],
};

export type QuotePayload = {
  submissionId: string;
  customerType: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  contactMethod: string;
  service: string;
  details: string;
  intendedUse: string;
  deadline: string;
  budget: string;
  rights: boolean;
  consent: boolean;
  marketing: boolean;
  // digital
  width: string;
  height: string;
  unit: string;
  formatNeeded: string;
  placement: string;
  colors: string;
  rush: string;
  // logo design
  audience: string;
  wording: string;
  styleReferences: string;
  requiredUses: string;
  // physical
  productType: string;
  quantity: string;
  sizes: string;
  decorationSize: string;
  materials: string;
  destination: string;
  postalCode: string;
  // attribution (no personal data)
  sourcePath: string;
  referrer: string;
  // honeypot
  website: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export type QuoteFieldErrors = Partial<Record<keyof QuotePayload | "artwork" | "form", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isDigital(service: string) {
  return digitalServices.includes(service);
}

export function isPhysical(service: string) {
  return physicalServices.includes(service);
}

export function isLogoDesign(service: string) {
  return service === "custom-logo-design";
}

const limits: Partial<Record<keyof QuotePayload, number>> = {
  name: 120,
  company: 160,
  email: 200,
  phone: 40,
  details: 4000,
  intendedUse: 300,
  budget: 80,
  width: 20,
  height: 20,
  formatNeeded: 120,
  placement: 200,
  colors: 60,
  audience: 400,
  wording: 400,
  styleReferences: 800,
  requiredUses: 400,
  productType: 80,
  quantity: 30,
  sizes: 600,
  decorationSize: 120,
  materials: 400,
  destination: 200,
  postalCode: 20,
  sourcePath: 300,
  referrer: 500,
};

export function validateQuote(data: QuotePayload): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};

  (Object.keys(limits) as Array<keyof QuotePayload>).forEach((key) => {
    const value = data[key];
    if (typeof value === "string" && value.length > (limits[key] as number)) {
      errors[key] = `Keep this under ${limits[key]} characters.`;
    }
  });

  if (!uuidPattern.test(data.submissionId)) errors.form = "The form session is invalid. Reload the page and try again.";
  if (!customerTypes.includes(data.customerType as (typeof customerTypes)[number])) errors.customerType = "Choose business or individual.";
  if (!data.name.trim()) errors.name = "Enter your name.";
  if (data.customerType === "Business" && !data.company.trim()) errors.company = "Enter the business name.";
  if (!data.email.trim()) errors.email = "Enter an email address.";
  else if (!emailPattern.test(data.email)) errors.email = "Enter a valid email address.";
  if (!countries.includes(data.country as (typeof countries)[number])) errors.country = "Select a country.";
  if (!contactMethods.includes(data.contactMethod as (typeof contactMethods)[number])) errors.contactMethod = "Choose how we should reply.";
  if (data.contactMethod !== "Email" && !data.phone.trim()) errors.phone = "Add a phone number for WhatsApp or phone replies.";
  if (!quoteServiceIds.includes(data.service)) errors.service = "Select a service.";
  if (!data.details.trim()) errors.details = "Describe the project.";
  if (!data.deadline.trim()) errors.deadline = "Enter the date you need this.";
  else if (Number.isNaN(Date.parse(data.deadline))) errors.deadline = "Enter a valid date.";

  if (isLogoDesign(data.service)) {
    if (!data.wording.trim()) errors.wording = "Enter the exact wording for the logo.";
    if (!data.audience.trim()) errors.audience = "Tell us who the logo is for.";
    if (!data.requiredUses.trim()) errors.requiredUses = "Tell us where the logo will be used.";
  } else if (isDigital(data.service)) {
    if (!data.width.trim() || !data.height.trim()) errors.width = "Enter the finished width and height.";
    else if (!/^\d+(\.\d+)?$/.test(data.width.trim()) || !/^\d+(\.\d+)?$/.test(data.height.trim())) errors.width = "Use numbers only for width and height.";
    if (!units.includes(data.unit as (typeof units)[number])) errors.unit = "Choose inches or millimetres.";
    if (!data.formatNeeded.trim()) errors.formatNeeded = "Enter the file format you need.";
    if (!data.placement.trim()) errors.placement = "Tell us the placement or material.";
  }

  if (isPhysical(data.service)) {
    if (!data.productType.trim()) errors.productType = "Choose a product or type.";
    if (!data.quantity.trim()) errors.quantity = "Enter a quantity.";
    else if (!/^\d+$/.test(data.quantity.trim()) || Number(data.quantity) < 1) errors.quantity = "Enter a whole number.";
    if (!data.destination.trim()) errors.destination = "Enter the delivery city or address.";
    if (!data.postalCode.trim()) errors.postalCode = "Enter the delivery postal code.";
  }

  if (!data.rights) errors.rights = "Confirm you can use this artwork.";
  if (!data.consent) errors.consent = "Confirm we can use these details to reply.";
  if (data.website.trim()) errors.form = "Submission rejected.";
  return errors;
}

export function validateArtworkFile(file: { name: string; size: number } | null): string | undefined {
  if (!file) return undefined;
  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (!fileUpload.accept.includes(ext as (typeof fileUpload.accept)[number])) {
    return `That file type is not accepted. Use ${fileUpload.acceptLabel}.`;
  }
  if (file.size === 0) return "That file is empty.";
  if (file.size > fileUpload.maxSizeMb * 1024 * 1024) {
    return `Files must be ${fileUpload.maxSizeMb} MB or smaller.`;
  }
  return undefined;
}

export function emptyQuote(service = "", customerType = "Business"): QuotePayload {
  return {
    submissionId: "",
    customerType,
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "United States",
    contactMethod: "Email",
    service,
    details: "",
    intendedUse: "",
    deadline: "",
    budget: "",
    rights: false,
    consent: false,
    marketing: false,
    width: "",
    height: "",
    unit: "in",
    formatNeeded: "",
    placement: "",
    colors: "",
    rush: "No",
    audience: "",
    wording: "",
    styleReferences: "",
    requiredUses: "",
    productType: "",
    quantity: "",
    sizes: "",
    decorationSize: "",
    materials: "",
    destination: "",
    postalCode: "",
    sourcePath: "",
    referrer: "",
    website: "",
  };
}

export const stepOneFields: Array<keyof QuotePayload> = ["customerType", "name", "company", "email", "phone", "country", "contactMethod", "service"];
