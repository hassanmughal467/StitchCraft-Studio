import { services } from "@/lib/services";

/**
 * Public CTA wording. Kept in one place so service cards, pages and the quote
 * form stay grammatically consistent ("Request a…" / "Request an…").
 */
export const quoteCtaByService: Record<string, string> = {
  "embroidery-digitizing": "Get a digitizing quote",
  "vector-tracing": "Get a vector art quote",
  "custom-logo-design": "Request a logo design quote",
  "custom-patches": "Get a patch quote",
  "embroidered-apparel": "Get an embroidery quote",
  "screen-printing": "Get a screen printing quote",
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
