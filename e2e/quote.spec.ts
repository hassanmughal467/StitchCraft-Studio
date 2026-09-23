import { expect, test, type Page } from "@playwright/test";

const services = [
  { id: "embroidery-digitizing", article: "an", title: "Embroidery Digitizing" },
  { id: "vector-tracing", article: "a", title: "Vector Artwork" },
  { id: "custom-logo-design", article: "a", title: "Custom Logo Design" },
  { id: "custom-patches", article: "a", title: "Custom Patches" },
  { id: "embroidered-apparel", article: "a", title: "Custom Embroidery" },
  { id: "screen-printing", article: "a", title: "Screen Printing" },
  { id: "custom-hats", article: "a", title: "Custom Hats & Caps" },
] as const;

async function fillStepOne(page: Page, service: string, customer: "Business" | "Individual" = "Business") {
  await page.getByRole("radio", { name: customer === "Business" ? /A business/ : /An individual/ }).check();
  await page.getByLabel("Full name").fill("E2E Customer");
  if (customer === "Business") await page.getByLabel("Business name").fill("E2E Shop");
  await page.getByLabel("Email").fill("e2e@example.test");
  await page.getByLabel("Country").selectOption("US");
  await page.getByLabel("Reply by").selectOption("Email");
  const serviceSelect = page.getByLabel("Service");
  if (await serviceSelect.count()) await serviceSelect.selectOption(service);
  await page.getByRole("button", { name: "Continue to project details" }).click();
}

test.describe("quote form", () => {
  for (const service of services) {
    test(`preselects ${service.id} and reaches step two`, async ({ page }) => {
      await page.goto(`/quote?service=${service.id}`);
      await expect(page.getByLabel("Service")).toHaveValue(service.id);
      await fillStepOne(page, service.id);
      await expect(page.getByRole("heading", { name: /project details/i })).toBeVisible();
    });
  }

  test("trade customer preselection", async ({ page }) => {
    await page.goto("/quote?customer=business");
    await expect(page.getByRole("radio", { name: /A business/ })).toBeChecked();
  });

  test("step-one validation focuses the error summary", async ({ page }) => {
    await page.goto("/quote");
    await page.getByRole("button", { name: "Continue to project details" }).click();
    const summary = page.locator("#quote-form [role='alert']");
    await expect(summary).toBeVisible();
    await expect(page.locator("#quote-form [tabindex='-1']").first()).toBeFocused();
  });

  test("back navigation keeps entered data", async ({ page }) => {
    await page.goto("/quote?service=embroidery-digitizing");
    await fillStepOne(page, "embroidery-digitizing");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Full name")).toHaveValue("E2E Customer");
    await expect(page.getByLabel("Business name")).toHaveValue("E2E Shop");
  });

  test("successful digitizing submission returns a reference", async ({ page }) => {
    await page.goto("/quote?service=embroidery-digitizing");
    await fillStepOne(page, "embroidery-digitizing");
    await page.getByLabel("Placement").fill("Left chest");
    await page.getByLabel("Fabric or material").fill("Piqué polo");
    await page.getByRole("radio", { name: "Flat embroidery" }).check();
    await page.getByLabel("Machine format").selectOption("DST");
    await page.getByLabel("Width").fill("3.5");
    await page.getByLabel("Height").fill("2");
    await page.getByRole("radio", { name: /Flexible/ }).check();
    await page.getByLabel("Project description").fill("Left chest shop logo, one color.");
    await page.getByLabel(/Brandstitch Works may use these details/).check();
    await page.getByRole("button", { name: "Send quote request" }).click();
    await expect(page.getByRole("heading", { name: /your reference is SC-\d{6}-[A-Z2-9]{4}/i })).toBeVisible({ timeout: 20_000 });
  });

  test("double-click does not create two references", async ({ page }) => {
    await page.goto("/quote?service=vector-tracing");
    await fillStepOne(page, "vector-tracing");
    await page.getByLabel("Intended use").selectOption("Screen printing");
    await page.getByLabel("Format needed").selectOption("AI");
    await page.getByRole("radio", { name: /outlined text/i }).check();
    await page.getByRole("radio", { name: /Exact reproduction/ }).check();
    await page.getByRole("radio", { name: /Flexible/ }).check();
    await page.getByLabel("Project description").fill("Trace the supplied mark.");
    await page.getByLabel(/Brandstitch Works may use these details/).check();
    await page.getByRole("button", { name: "Send quote request" }).dblclick();
    await expect(page.getByRole("heading", { name: /your reference is SC-\d{6}-[A-Z2-9]{4}/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("heading", { name: /your reference is/i })).toHaveCount(1);
  });
});

test.describe("site chrome", () => {
  test("404 returns not-found content", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-sc");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("mobile menu closes after navigation and Escape returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    await page.locator("#mobile-nav").getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator("#mobile-nav")).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("portfolio-to-quote query is accepted", async ({ page }) => {
    await page.goto("/quote?service=custom-patches&project=example-patch");
    await expect(page.getByLabel("Service")).toHaveValue("custom-patches");
  });
});
