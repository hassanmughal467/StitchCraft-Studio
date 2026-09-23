import { countLimits, dimensionLimits, fileLimits, isAcceptedExtension, quantityLimits, rowLimits } from "@/lib/config/limits";
import { OTHER_COUNTRY, isCountryCode } from "@/lib/countries";
import { services } from "@/lib/services";

/**
 * Quote request schema shared by the client form and the server intake.
 * All values travel as strings (multipart form data); booleans are "true"/"false";
 * repeatable rows travel as a JSON string and are parsed with `parseRows`.
 */

export const customerTypes = ["Business", "Individual"] as const;
export const contactMethods = ["Email", "WhatsApp", "Phone"] as const;
export const units = ["in", "mm"] as const;
export const deadlineModes = ["fixed", "preferred", "flexible"] as const;
export const quoteServiceIds = services.map((item) => item.id);

export type CustomerType = (typeof customerTypes)[number];
export type DeadlineMode = (typeof deadlineModes)[number];
export type Unit = (typeof units)[number];

export const deadlineLabels: Record<DeadlineMode, string> = {
  fixed: "Fixed date: I need it in hand by this date",
  preferred: "Preferred date: some flexibility",
  flexible: "Flexible: no fixed deadline",
};

export const digitalServices = ["embroidery-digitizing", "vector-tracing", "custom-logo-design"];
export const physicalServices = ["custom-patches", "embroidered-apparel", "screen-printing", "custom-hats"];

export const notSure = "Not sure, please advise";

/** Option lists per service. Kept here so client and server validate the same values. */
export const serviceOptions = {
  "embroidery-digitizing": {
    embroideryStyle: ["Flat embroidery", "3D puff", notSure],
    formats: ["DST", "PES", "EXP", "JEF", "EMB", "OFM", "PXF", "Other or not sure"],
  },
  "vector-tracing": {
    intendedUse: ["Screen printing", "Embroidery preparation", "Signage or vinyl cutting", "Engraving", "Web or documents", "Several uses"],
    formats: ["AI", "EPS", "SVG", "PDF", "Other or not sure"],
    fontsEditable: ["Yes, keep fonts editable", "No, outlined text is fine", notSure],
    reproductionMode: ["Exact reproduction of the original", "Cleaned-up redraw (fix rough edges and spacing)", notSure],
  },
  "custom-logo-design": {
    styleDirection: ["Wordmark (typography-led)", "Badge or crest", "Icon with name", "Open to suggestions"],
    deliverables: ["Vector files (AI, EPS, SVG, PDF)", "PNG for web and documents", "Embroidery file", "Print-ready version", "color and clear-space notes"],
  },
  "custom-patches": {
    productType: ["Embroidered", "Woven", "PVC", "Chenille", "Printed or sublimated", "Leather", notSure],
    backing: ["Sew-on", "Iron-on", "Hook-and-loop", "Adhesive", "No backing", notSure],
    border: ["Merrowed", "Hot cut", "Laser cut", notSure],
  },
  "custom-hats": {
    productType: ["Structured 6-panel", "Unstructured or dad hat", "Trucker", "5-panel or flat peak", "Beanie", notSure],
    decoration: ["Flat embroidery", "3D puff", "Applied patch", notSure],
    placements: ["Front center", "Front offset", "Left side", "Right side", "Rear", "Multiple locations"],
    supplyMode: ["Brandstitch Works supplies the caps", "I will supply the caps", notSure],
  },
  "embroidered-apparel": {
    productType: ["Polos", "T-shirts", "Hoodies or sweatshirts", "Jackets or softshells", "Workwear or hi-vis", "Aprons", "Mixed order"],
    placements: ["Left chest", "Right chest", "Sleeve", "Full back", "Nape", "Multiple locations"],
    supplyMode: ["Brandstitch Works supplies the garments", "I will supply the garments", notSure],
  },
  "screen-printing": {
    productType: ["T-shirts", "Hoodies or sweatshirts", "Long sleeves", "Tote bags", "Mixed order"],
    placements: ["Full front", "Left chest", "Full back", "Sleeve", "Nape", "Multiple locations"],
    supplyMode: ["Brandstitch Works supplies the garments", "I will supply the garments", notSure],
    inkColors: ["1 color", "2 colors", "3 colors", "4 or more", notSure],
  },
} as const;

export type QuoteRow = { label: string; color: string; quantity: string };

export type QuotePayload = {
  submissionId: string;
  customerType: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  /** ISO 3166-1 alpha-2 or "OTHER". */
  countryCode: string;
  /** Free text, required when countryCode is "OTHER". */
  countryName: string;
  contactMethod: string;
  service: string;
  previousReference: string;
  portfolioRef: string;
  portfolioTitle: string;
  details: string;
  deadlineMode: string;
  deadlineDate: string;
  budget: string;
  rights: boolean;
  consent: boolean;
  marketing: boolean;
  // finished size (digital + physical decoration size)
  width: string;
  height: string;
  unit: string;
  sizeUndecided: boolean;
  // embroidery digitizing
  placement: string;
  fabric: string;
  embroideryStyle: string;
  formatNeeded: string;
  designCount: string;
  rush: string;
  // vector tracing
  intendedUse: string;
  colorCount: string;
  fontsEditable: string;
  reproductionMode: string;
  // logo design
  wording: string;
  industry: string;
  audience: string;
  requiredUses: string;
  styleDirection: string;
  colors: string;
  styleReferences: string;
  /** "|"-joined selections. */
  deliverables: string;
  // physical products
  productType: string;
  quantity: string;
  /** JSON array of QuoteRow (size breakdown or patch variants). */
  rows: string;
  garmentColors: string;
  inkColors: string;
  supplyMode: string;
  /** "|"-joined decoration locations. */
  placements: string;
  decoration: string;
  backing: string;
  border: string;
  shape: string;
  destinationCity: string;
  postalCode: string;
  // attribution (no personal data)
  sourcePath: string;
  referrer: string;
  // spam controls
  website: string;
  turnstileToken: string;
};

export type QuoteFieldErrors = Partial<Record<keyof QuotePayload | "artwork" | "form", string>>;

export const booleanFields: Array<keyof QuotePayload> = ["rights", "consent", "marketing", "sizeUndecided"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const referencePattern = /^[A-Za-z0-9][A-Za-z0-9 \-_/#.]{1,39}$/;

export function isDigital(service: string) {
  return digitalServices.includes(service);
}
export function isPhysical(service: string) {
  return physicalServices.includes(service);
}
export function isLogoDesign(service: string) {
  return service === "custom-logo-design";
}
export function isDigitizing(service: string) {
  return service === "embroidery-digitizing";
}
export function isVector(service: string) {
  return service === "vector-tracing";
}
export function isApparel(service: string) {
  return service === "embroidered-apparel" || service === "screen-printing";
}
export function isScreenPrint(service: string) {
  return service === "screen-printing";
}

const limits: Partial<Record<keyof QuotePayload, number>> = {
  name: 120,
  company: 160,
  email: 200,
  phone: 40,
  countryName: 80,
  previousReference: 40,
  portfolioRef: 80,
  portfolioTitle: 160,
  details: 4000,
  budget: 80,
  width: 12,
  height: 12,
  placement: 200,
  fabric: 200,
  formatNeeded: 120,
  designCount: 6,
  intendedUse: 120,
  colorCount: 6,
  wording: 400,
  industry: 120,
  audience: 400,
  requiredUses: 400,
  colors: 300,
  styleReferences: 1500,
  deliverables: 400,
  productType: 80,
  quantity: 9,
  rows: 6000,
  garmentColors: 300,
  inkColors: 40,
  placements: 300,
  shape: 120,
  destinationCity: 120,
  postalCode: 20,
  sourcePath: 300,
  referrer: 500,
  turnstileToken: 3000,
};

export function parseRows(raw: string): QuoteRow[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, rowLimits.maxRows + 1).map((row) => ({
      label: String(row?.label ?? "").slice(0, rowLimits.labelLength),
      color: String(row?.color ?? "").slice(0, rowLimits.labelLength),
      quantity: String(row?.quantity ?? "").slice(0, 9),
    }));
  } catch {
    return [];
  }
}

/** Rows are kept while editing, even when blank, so a newly added row renders. */
export function stringifyRows(rows: QuoteRow[]) {
  return rows.length ? JSON.stringify(rows) : "";
}

export function isBlankRow(row: QuoteRow) {
  return !(row.label.trim() || row.color.trim() || row.quantity.trim());
}

/** Drops blank rows; used before submission and in summaries. */
export function compactRows(raw: string) {
  const kept = parseRows(raw).filter((row) => !isBlankRow(row));
  return kept.length ? JSON.stringify(kept) : "";
}

function isIntegerInRange(value: string, min: number, max: number) {
  return /^\d+$/.test(value.trim()) && Number(value) >= min && Number(value) <= max;
}

function isDimension(value: string, unit: string) {
  const v = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(v)) return false;
  const n = Number(v);
  const max = unit === "mm" ? dimensionLimits.max.mm : dimensionLimits.max.in;
  return n >= dimensionLimits.min && n <= max;
}

/** Today's date (UTC) as YYYY-MM-DD; deadlines before this are rejected. */
export function todayIso(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function includes<T extends readonly string[]>(list: T, value: string): value is T[number] {
  return (list as readonly string[]).includes(value);
}

export type ValidationContext = { fileCount: number; now?: Date };

export function validateQuote(data: QuotePayload, ctx: ValidationContext = { fileCount: 0 }): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};
  const today = todayIso(ctx.now);

  (Object.keys(limits) as Array<keyof QuotePayload>).forEach((key) => {
    const value = data[key];
    if (typeof value === "string" && value.length > (limits[key] as number)) {
      errors[key] = `Keep this under ${limits[key]} characters.`;
    }
  });

  if (!uuidPattern.test(data.submissionId)) errors.form = "The form session is invalid. Reload the page and try again.";
  if (data.website.trim()) errors.form = "Submission rejected.";

  // Step one
  if (!includes(customerTypes, data.customerType)) errors.customerType = "Choose business or individual.";
  if (!data.name.trim()) errors.name = "Enter your name.";
  if (data.customerType === "Business" && !data.company.trim()) errors.company = "Enter the business name.";
  if (!data.email.trim()) errors.email = "Enter an email address.";
  else if (!emailPattern.test(data.email.trim())) errors.email = "Enter a valid email address, for example name@company.com.";
  if (data.countryCode === OTHER_COUNTRY) {
    if (!data.countryName.trim()) errors.countryName = "Enter the country name.";
  } else if (!isCountryCode(data.countryCode)) {
    errors.countryCode = "Select your country.";
  }
  if (!includes(contactMethods, data.contactMethod)) errors.contactMethod = "Choose how we should reply.";
  if (data.contactMethod !== "Email" && !data.phone.trim()) errors.phone = "Add a phone number with country code so we can reply by WhatsApp or phone.";
  else if (data.phone.trim() && !/^[+\d][\d\s().-]{5,}$/.test(data.phone.trim())) errors.phone = "Enter the number with its country code, for example +1 212 555 0100.";
  if (!quoteServiceIds.includes(data.service)) errors.service = "Select a service.";
  if (data.previousReference.trim() && !referencePattern.test(data.previousReference.trim())) {
    errors.previousReference = "Use the reference as it appears on your quote or invoice (letters, numbers and dashes).";
  }

  // Step two: shared
  if (!data.details.trim()) errors.details = "Describe the project in a sentence or two.";
  if (!includes(deadlineModes, data.deadlineMode)) errors.deadlineMode = "Tell us how firm the timing is.";
  else if (data.deadlineMode !== "flexible") {
    if (!data.deadlineDate.trim()) errors.deadlineDate = data.deadlineMode === "fixed" ? "Enter the date you need this in hand." : "Enter your preferred date.";
    else if (!isoDatePattern.test(data.deadlineDate) || Number.isNaN(Date.parse(data.deadlineDate))) errors.deadlineDate = "Enter a valid date.";
    else if (data.deadlineDate < today) errors.deadlineDate = "The date has already passed. Choose a date from today onwards.";
  }
  if (!includes(units, data.unit)) errors.unit = "Choose inches or millimeters.";

  const needsSize = isDigitizing(data.service) || isPhysical(data.service);
  if (needsSize && !data.sizeUndecided) {
    if (!data.width.trim() || !data.height.trim()) errors.width = "Enter the finished width and height, or tick “Size not decided”.";
    else if (!isDimension(data.width, data.unit) || !isDimension(data.height, data.unit)) {
      const max = data.unit === "mm" ? `${dimensionLimits.max.mm} mm` : `${dimensionLimits.max.in} in`;
      errors.width = `Use numbers between ${dimensionLimits.min} and ${max}.`;
    }
  }
  if (isVector(data.service) && !data.sizeUndecided && (data.width.trim() || data.height.trim())) {
    if (!isDimension(data.width, data.unit) || !isDimension(data.height, data.unit)) errors.width = "Use numbers for width and height, or tick “Size not decided”.";
  }

  // Embroidery digitizing
  if (isDigitizing(data.service)) {
    const opts = serviceOptions["embroidery-digitizing"];
    if (!data.placement.trim()) errors.placement = "Tell us where the design will be sewn.";
    if (!data.fabric.trim()) errors.fabric = "Tell us the fabric or material.";
    if (!includes(opts.embroideryStyle, data.embroideryStyle)) errors.embroideryStyle = "Choose flat embroidery, 3D puff or not sure.";
    if (!includes(opts.formats, data.formatNeeded)) errors.formatNeeded = "Choose the machine format you need.";
    if (!isIntegerInRange(data.designCount, countLimits.min, countLimits.max)) errors.designCount = `Enter the number of designs (${countLimits.min}–${countLimits.max}).`;
  }

  // Vector tracing
  if (isVector(data.service)) {
    const opts = serviceOptions["vector-tracing"];
    if (!includes(opts.intendedUse, data.intendedUse)) errors.intendedUse = "Choose how the artwork will be used.";
    if (!includes(opts.formats, data.formatNeeded)) errors.formatNeeded = "Choose the file format you need.";
    if (data.colorCount.trim() && !isIntegerInRange(data.colorCount, countLimits.min, countLimits.max)) errors.colorCount = "Enter an approximate whole number of colors.";
    if (!includes(opts.fontsEditable, data.fontsEditable)) errors.fontsEditable = "Tell us whether fonts must stay editable.";
    if (!includes(opts.reproductionMode, data.reproductionMode)) errors.reproductionMode = "Choose exact reproduction or a cleaned-up redraw.";
  }

  // Logo design
  if (isLogoDesign(data.service)) {
    const opts = serviceOptions["custom-logo-design"];
    if (!data.wording.trim()) errors.wording = "Enter the exact wording for the logo.";
    if (!data.industry.trim()) errors.industry = "Tell us the industry or type of organisation.";
    if (!data.audience.trim()) errors.audience = "Tell us who the logo is for.";
    if (!data.requiredUses.trim()) errors.requiredUses = "Tell us where the logo will be used.";
    if (!includes(opts.styleDirection, data.styleDirection)) errors.styleDirection = "Choose a style direction.";
    const chosen = data.deliverables.split("|").filter(Boolean);
    if (!chosen.length || !chosen.every((d) => includes(opts.deliverables, d))) errors.deliverables = "Choose at least one deliverable.";
  }

  // Physical products
  if (isPhysical(data.service)) {
    const opts = serviceOptions[data.service as keyof typeof serviceOptions] as { productType: readonly string[]; placements?: readonly string[]; supplyMode?: readonly string[]; backing?: readonly string[]; border?: readonly string[]; decoration?: readonly string[] };
    if (!includes(opts.productType, data.productType)) errors.productType = data.service === "custom-hats" ? "Choose a cap style." : data.service === "custom-patches" ? "Choose a patch type." : "Choose a garment type.";
    if (!isIntegerInRange(data.quantity, quantityLimits.min, quantityLimits.max)) errors.quantity = `Enter a whole number between ${quantityLimits.min} and ${quantityLimits.max.toLocaleString("en-US")}.`;
    const rows = parseRows(data.rows);
    if (rows.length > rowLimits.maxRows) errors.rows = `Use up to ${rowLimits.maxRows} rows.`;
    else if (rows.some((r) => (r.label.trim() || r.color.trim() || r.quantity.trim()) && !isIntegerInRange(r.quantity, 1, quantityLimits.max))) {
      errors.rows = "Each row needs a whole-number quantity of at least 1.";
    } else if (rows.length && isIntegerInRange(data.quantity, 1, quantityLimits.max)) {
      const sum = rows.reduce((acc, r) => acc + Number(r.quantity || 0), 0);
      if (sum > Number(data.quantity)) errors.rows = `The rows add up to ${sum}, more than the total quantity of ${Number(data.quantity)}.`;
    }
    if (opts.placements) {
      const chosen = data.placements.split("|").filter(Boolean);
      if (!chosen.length || !chosen.every((p) => includes(opts.placements!, p))) errors.placements = "Choose at least one decoration location.";
    }
    if (opts.supplyMode && !includes(opts.supplyMode, data.supplyMode)) errors.supplyMode = data.service === "custom-hats" ? "Tell us who supplies the caps." : "Tell us who supplies the garments.";
    if (opts.backing && !includes(opts.backing, data.backing)) errors.backing = "Choose a backing type.";
    if (opts.border && !includes(opts.border, data.border)) errors.border = "Choose a border finish.";
    if (opts.decoration && !includes(opts.decoration, data.decoration)) errors.decoration = "Choose the decoration type.";
    if (isApparel(data.service) && !data.garmentColors.trim()) errors.garmentColors = "Tell us the garment color or colors.";
    if (isScreenPrint(data.service) && !includes(serviceOptions["screen-printing"].inkColors, data.inkColors)) {
      errors.inkColors = "Tell us the number of ink colors, or choose not sure.";
    }
    if (!data.destinationCity.trim()) errors.destinationCity = "Enter the delivery city or town.";
    if (!data.postalCode.trim()) errors.postalCode = "Enter the delivery postal or ZIP code.";
  }

  if (ctx.fileCount > 0 && !data.rights) errors.rights = "Confirm you own or have permission to use the artwork you are sending.";
  if (!data.consent) errors.consent = "Confirm we can use these details to prepare your quote.";
  return errors;
}

export type FileMeta = { name: string; size: number };

/** Client-side file screening: extension and size. Content is verified on the server. */
export function validateArtworkFiles(files: FileMeta[]): string | undefined {
  if (files.length > fileLimits.maxFiles) return `Attach up to ${fileLimits.maxFiles} files.`;
  let total = 0;
  for (const file of files) {
    if (!isAcceptedExtension(file.name)) return `“${truncateName(file.name)}” is not an accepted type. Use ${fileLimits.acceptLabel}`;
    if (file.size === 0) return `“${truncateName(file.name)}” is empty.`;
    if (file.size > fileLimits.maxSizeBytes) return `“${truncateName(file.name)}” is larger than ${fileLimits.maxSizeMb} MB.`;
    total += file.size;
  }
  if (total > fileLimits.maxTotalBytes) return `The files together exceed ${Math.round(fileLimits.maxTotalBytes / 1024 / 1024)} MB. Remove one or send it after we reply.`;
  return undefined;
}

export function truncateName(name: string, max = 40) {
  return name.length > max ? `${name.slice(0, max - 12)}…${name.slice(-9)}` : name;
}

export function emptyQuote(service = "", customerType = "Business"): QuotePayload {
  return {
    submissionId: "",
    customerType,
    name: "",
    company: "",
    email: "",
    phone: "",
    countryCode: "",
    countryName: "",
    contactMethod: "Email",
    service,
    previousReference: "",
    portfolioRef: "",
    portfolioTitle: "",
    details: "",
    deadlineMode: "",
    deadlineDate: "",
    budget: "",
    rights: false,
    consent: false,
    marketing: false,
    width: "",
    height: "",
    unit: "in",
    sizeUndecided: false,
    placement: "",
    fabric: "",
    embroideryStyle: "",
    formatNeeded: "",
    designCount: "1",
    rush: "No",
    intendedUse: "",
    colorCount: "",
    fontsEditable: "",
    reproductionMode: "",
    wording: "",
    industry: "",
    audience: "",
    requiredUses: "",
    styleDirection: "",
    colors: "",
    styleReferences: "",
    deliverables: "",
    productType: "",
    quantity: "",
    rows: "",
    garmentColors: "",
    inkColors: "",
    supplyMode: "",
    placements: "",
    decoration: "",
    backing: "",
    border: "",
    shape: "",
    destinationCity: "",
    postalCode: "",
    sourcePath: "",
    referrer: "",
    website: "",
    turnstileToken: "",
  };
}

export const stepOneFields: Array<keyof QuotePayload> = ["customerType", "name", "company", "email", "phone", "countryCode", "countryName", "contactMethod", "service", "previousReference"];

/** Fields that belong to step one; used to run step-one validation in isolation. */
export function stepOneErrors(data: QuotePayload): QuoteFieldErrors {
  const all = validateQuote(data, { fileCount: 0 });
  const out: QuoteFieldErrors = {};
  stepOneFields.forEach((key) => {
    if (all[key]) out[key] = all[key];
  });
  if (all.form) out.form = all.form;
  return out;
}

/** Service id from a URL parameter, or "" when unknown. */
export function resolveServiceParam(value: string | undefined | null) {
  return value && quoteServiceIds.includes(value) ? value : "";
}

/** Customer type from the `?customer=` parameter. Business is the default. */
export function resolveCustomerParam(value: string | undefined | null): CustomerType {
  return value?.toLowerCase() === "individual" ? "Individual" : "Business";
}

/** Human summary of the request for confirmations and staff notifications (no contact data). */
export type QuoteSummaryInput = Omit<QuotePayload, "website" | "turnstileToken">;

export function summarizeQuote(p: QuoteSummaryInput, countryLabel: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const add = (label: string, value?: string | null) => {
    if (value && value.trim()) out.push([label, value.trim()]);
  };
  const size = p.sizeUndecided ? "Not decided, advice requested" : p.width && p.height ? `${p.width} × ${p.height} ${p.unit}` : "";
  add("Customer type", p.customerType);
  add("Deadline", p.deadlineMode === "flexible" ? "Flexible, no fixed date" : p.deadlineMode === "fixed" ? `Fixed: ${p.deadlineDate}` : p.deadlineMode === "preferred" ? `Preferred: ${p.deadlineDate}` : "");
  add("Previous reference", p.previousReference);
  add("Portfolio project", p.portfolioTitle ? `${p.portfolioTitle} (${p.portfolioRef})` : p.portfolioRef);
  if (isDigitizing(p.service)) {
    add("Finished size", size);
    add("Placement", p.placement);
    add("Fabric or material", p.fabric);
    add("Embroidery type", p.embroideryStyle);
    add("Machine format", p.formatNeeded);
    add("Number of designs", p.designCount);
    add("Rush", p.rush !== "No" ? p.rush : "");
  } else if (isVector(p.service)) {
    add("Intended use", p.intendedUse);
    add("Formats", p.formatNeeded);
    add("Approximate colors", p.colorCount);
    add("Fonts editable", p.fontsEditable);
    add("Redraw type", p.reproductionMode);
    add("Finished size", size);
    add("Rush", p.rush !== "No" ? p.rush : "");
  } else if (isLogoDesign(p.service)) {
    add("Exact wording", p.wording);
    add("Industry", p.industry);
    add("Audience", p.audience);
    add("Intended uses", p.requiredUses);
    add("Style direction", p.styleDirection);
    add("color preferences", p.colors);
    add("Deliverables", p.deliverables.split("|").filter(Boolean).join(", "));
    add("References", p.styleReferences);
  } else if (isPhysical(p.service)) {
    add(p.service === "custom-hats" ? "Cap style" : p.service === "custom-patches" ? "Patch type" : "Garment", p.productType);
    add("Total quantity", p.quantity);
    const rows = parseRows(p.rows).filter((row) => !isBlankRow(row));
    if (rows.length) add(p.service === "custom-patches" ? "Variants" : "Size breakdown", rows.map((r) => [r.label, r.color, r.quantity ? `× ${r.quantity}` : ""].filter(Boolean).join(" ")).join("; "));
    add("Garment colors", p.garmentColors);
    add("Ink colors", p.inkColors);
    add("Design size", size);
    add("Shape", p.shape);
    add("Backing", p.backing);
    add("Border", p.border);
    add("Decoration", p.decoration);
    add("Locations", p.placements.split("|").filter(Boolean).join(", "));
    add("Supply", p.supplyMode);
    add("Delivery", [p.destinationCity, p.postalCode, countryLabel].filter(Boolean).join(", "));
  }
  add("Budget", p.budget);
  return out;
}
