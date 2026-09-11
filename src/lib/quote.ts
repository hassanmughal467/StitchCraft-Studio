import { contactMethods, garmentTypes, quoteServices } from "@/lib/content";
import { fileUpload } from "@/lib/site";

export type QuotePayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  garment: string;
  quantity: string;
  deadline: string;
  details: string;
  contactMethod: string;
  consent: boolean;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export type QuoteFieldErrors = Partial<Record<keyof QuotePayload | "artwork", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuote(data: QuotePayload): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};

  if (!data.name.trim()) errors.name = "Enter your name.";
  if (!data.email.trim()) errors.email = "Enter a work email.";
  else if (!emailPattern.test(data.email)) errors.email = "Enter a valid email address.";
  if (!data.phone.trim()) errors.phone = "Enter a WhatsApp or phone number.";
  if (!quoteServices.includes(data.service as (typeof quoteServices)[number])) {
    errors.service = "Select the service you need.";
  }
  if (!garmentTypes.includes(data.garment as (typeof garmentTypes)[number])) {
    errors.garment = "Select a garment or patch type.";
  }
  if (!data.quantity.trim()) errors.quantity = "Enter a quantity or “1 file”.";
  if (!data.deadline.trim()) errors.deadline = "Enter the date you need this.";
  if (!contactMethods.includes(data.contactMethod as (typeof contactMethods)[number])) {
    errors.contactMethod = "Choose how we should reply.";
  }
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

export function emptyQuote(): QuotePayload {
  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    garment: "",
    quantity: "",
    deadline: "",
    details: "",
    contactMethod: "Email",
    consent: false,
  };
}
