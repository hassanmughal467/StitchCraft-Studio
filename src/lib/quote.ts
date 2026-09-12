import { services } from "@/lib/services";
import { fileUpload } from "@/lib/site";

export const customerTypes = ["Business", "Individual"] as const;
export const contactMethods = ["Email", "WhatsApp", "Phone"] as const;
export const countries = ["United States", "United Kingdom", "Australia", "Canada", "New Zealand", "Other"] as const;
export const quoteServiceIds = services.map((item) => item.id);

export const digitalServices = ["embroidery-digitizing", "vector-tracing", "custom-logo-design"];
export const physicalServices = ["custom-patches", "embroidered-apparel", "screen-printing", "custom-hats"];

export type QuotePayload = {
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
  width: string;
  height: string;
  formatNeeded: string;
  placement: string;
  colors: string;
  rush: string;
  quantity: string;
  sizes: string;
  destination: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export type QuoteFieldErrors = Partial<Record<keyof QuotePayload | "artwork", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isDigital(service: string) {
  return digitalServices.includes(service);
}

export function isPhysical(service: string) {
  return physicalServices.includes(service);
}

export function validateQuote(data: QuotePayload): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};
  if (!customerTypes.includes(data.customerType as (typeof customerTypes)[number])) {
    errors.customerType = "Choose business or individual.";
  }
  if (!data.name.trim()) errors.name = "Enter your name.";
  if (data.customerType === "Business" && !data.company.trim()) errors.company = "Enter the business name.";
  if (!data.email.trim()) errors.email = "Enter an email.";
  else if (!emailPattern.test(data.email)) errors.email = "Enter a valid email address.";
  if (!countries.includes(data.country as (typeof countries)[number])) errors.country = "Select a country.";
  if (!contactMethods.includes(data.contactMethod as (typeof contactMethods)[number])) {
    errors.contactMethod = "Choose how we should reply.";
  }
  if (!quoteServiceIds.includes(data.service)) errors.service = "Select a service.";
  if (!data.details.trim()) errors.details = "Describe the project.";
  if (!data.deadline.trim()) errors.deadline = "Enter the date you need this.";
  if (isDigital(data.service)) {
    if (!data.width.trim() || !data.height.trim()) errors.width = "Enter width and height.";
    if (!data.formatNeeded.trim()) errors.formatNeeded = "Enter the file format you need.";
  }
  if (isPhysical(data.service)) {
    if (!data.quantity.trim()) errors.quantity = "Enter a quantity.";
    if (!data.destination.trim()) errors.destination = "Enter a destination or postal code.";
  }
  if (!data.rights) errors.rights = "Confirm you can use this artwork.";
  if (!data.consent) errors.consent = "Please confirm we can use these details to reply.";
  return errors;
}

export function validateArtworkFile(file: File | null): string | undefined {
  if (!file) return undefined;
  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (!fileUpload.accept.includes(ext as (typeof fileUpload.accept)[number])) {
    return `That file type is not accepted. Use ${fileUpload.acceptLabel}.`;
  }
  if (file.size > fileUpload.maxSizeMb * 1024 * 1024) {
    return `Files must be ${fileUpload.maxSizeMb} MB or smaller.`;
  }
  return undefined;
}

export function emptyQuote(service = ""): QuotePayload {
  return {
    customerType: "Business",
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
    formatNeeded: "",
    placement: "",
    colors: "",
    rush: "No",
    quantity: "",
    sizes: "",
    destination: "",
  };
}
