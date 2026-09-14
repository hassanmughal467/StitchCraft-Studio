import { services } from "@/lib/services";

/**
 * Public CTA wording. Kept in one place so service cards, pages and the quote
 * form stay grammatically consistent ("Request a…" / "Request an…").
 */
export const quoteCtaByService: Record<string, string> = {
  "embroidery-digitizing": "Request an embroidery digitizing quote",
  "vector-tracing": "Request a vector tracing quote",
  "custom-logo-design": "Request a logo design quote",
  "custom-patches": "Request a custom patch quote",
  "embroidered-apparel": "Request an embroidered apparel quote",
  "screen-printing": "Request a screen-printing quote",
  "custom-hats": "Request a custom hat quote",
};

export function quoteCta(serviceId?: string) {
  if (serviceId && quoteCtaByService[serviceId]) return quoteCtaByService[serviceId];
  return "Request a quote";
}

export function similarProjectCta(serviceId?: string) {
  const service = serviceId ? services.find((item) => item.id === serviceId) : undefined;
  return service ? `Quote a similar ${service.title.toLowerCase()} project` : "Quote a similar project";
}
