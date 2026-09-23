import { describe, expect, it } from "vitest";
import { quoteCta, quoteCtaByService } from "@/lib/copy";
import { quoteServiceIds } from "@/lib/quote";

describe("quote CTAs", () => {
  it("covers every service with a service-specific quote CTA", () => {
    for (const id of quoteServiceIds) {
      expect(quoteCtaByService[id]).toMatch(/^(Get an?|Request an?) /);
      expect(quoteCta(id).length).toBeGreaterThan(10);
    }
    expect(quoteCta()).toBe("Request a quote");
  });
});
