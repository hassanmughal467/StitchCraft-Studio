import { describe, expect, it } from "vitest";
import { errorCategory, sanitize } from "@/lib/analytics";

describe("analytics sanitization", () => {
  it("keeps allowed keys and drops long or personal-looking strings", () => {
    const clean = sanitize({ name: "quote_submitted", service: "custom-patches", customerType: "Business", fileCount: 2, duplicate: false });
    expect(clean).toEqual({ event: "quote_submitted", service: "custom-patches", customerType: "Business", fileCount: 2, duplicate: false });
    const dirty = sanitize({ name: "service_selected", service: "buyer@company.com" });
    expect(dirty.service).toBeUndefined();
  });

  it("maps field keys to coarse error categories", () => {
    expect(errorCategory(["email", "name"])).toBe("contact");
    expect(errorCategory(["artwork"])).toBe("files");
    expect(errorCategory(["deadlineDate"])).toBe("deadline");
    expect(errorCategory(["consent"])).toBe("consent");
    expect(errorCategory(["width"])).toBe("specification");
  });
});
