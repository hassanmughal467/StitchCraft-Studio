import { describe, expect, it } from "vitest";
import { quoteCta, quoteCtaByService } from "@/lib/copy";
import { quoteServiceIds } from "@/lib/quote";

describe("quote CTAs", () => {
  it("covers every service with Request a/an wording", () => {
    for (const id of quoteServiceIds) {
      expect(quoteCtaByService[id]).toMatch(/^Request an? /);
      expect(quoteCta(id)).not.toMatch(/^Get a /);
    }
    expect(quoteCta()).toBe("Request a quote");
  });
});
