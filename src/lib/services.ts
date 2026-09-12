export type ServiceRoute = "digitizing" | "products";

export type ServicePage = {
  id: string;
  href: string;
  route: ServiceRoute;
  title: string;
  outcome: string;
  buyer: string;
  heading: string;
  lede: string;
  deliverables: string[];
  inputs: string[];
  options: string[];
  limits: string[];
  process: string[];
  turnaround: string;
  pricing: string;
  revisions: string;
  faqs: { q: string; a: string }[];
  related: string[];
};

export const routes = [
  {
    id: "digitizing",
    href: "/digitizing-artwork",
    title: "Digitizing & Artwork",
    body: "Machine-ready embroidery files, production-ready vectors and original logo design.",
  },
  {
    id: "products",
    href: "/custom-products",
    title: "Custom Products",
    body: "Patches, embroidered apparel, screen printing and custom headwear.",
  },
] as const;

export const services: ServicePage[] = [
  {
    id: "embroidery-digitizing",
    href: "/embroidery-digitizing",
    route: "digitizing",
    title: "Embroidery Digitizing",
    outcome: "A shop-ready stitch file for the placement and machine you name.",
    buyer: "Embroidery shops, brands and apparel programs that need a file they can load and run.",
    heading: "Stitch files built for the garment, not only the preview.",
    lede: "We digitize logos and marks for left chest, cap, jacket back, patches and 3D puff. You tell us the size, fabric and format. We return a file and a stitch preview.",
    deliverables: [
      "Stitch file in the format you request (DST, PES, EXP, JEF, EMB or another shop format we support)",
      "Color sequence notes for the operator",
      "Stitch preview for approval",
      "Sew-out photograph when that step is included in the job",
    ],
    inputs: ["AI, EPS, PDF, SVG or a sharp PNG/JPG", "Sew size and units", "Garment or material", "Placement", "Machine format"],
    options: ["Left chest", "Cap / 3D puff", "Jacket back", "Patch file", "Appliqué sequence"],
    limits: [
      "Hairline detail may be rebuilt or dropped so it holds at sew size",
      "Final stitch count can change after production preparation",
      "One file is not stretched across cap, chest and jacket back",
    ],
    process: ["Brief and artwork", "Scope and price", "Digitize", "Preview approval", "File release"],
    turnaround: "Simple left-chest files are often quoted in one to two working days. Caps, jacket backs, appliqué and puff take longer. Rush is quoted only when the queue allows — we will say no if the date is not possible.",
    pricing: "Quoted from size, stitch type and placement. No public stitch-count estimator in this release.",
    revisions: "Proof changes inside the original brief are part of the job. A new size, garment type or redesigned mark is a new file.",
    faqs: [
      { q: "Which formats do you deliver?", a: "DST, PES, EXP, JEF, EMB and others on request. Name the machine." },
      { q: "Do you sew a sample?", a: "A stitch preview is standard. A sewn sample is arranged when the fabric or stitch type needs it, or when you ask before a bulk run." },
    ],
    related: ["vector-tracing", "custom-patches", "custom-hats"],
  },
  {
    id: "vector-tracing",
    href: "/vector-tracing",
    route: "digitizing",
    title: "Vector Tracing",
    outcome: "Clean vector artwork for print, cut, engraving or brand use.",
    buyer: "Print shops and brands working from a raster logo, scan or flattened PDF.",
    heading: "Redraw the mark so edges are real paths, not pixels.",
    lede: "Tracing rebuilds an existing logo. It is not a new identity. If you need original design, use Custom Logo Design.",
    deliverables: ["AI, EPS, SVG and/or PDF as requested", "Production PDF where needed", "Before/after preview"],
    inputs: ["Best available artwork", "Intended use (screen print, engraving, signage, web, general brand)", "Color notes if you already have them"],
    options: ["One-color rebuild", "Spot-color separation notes", "Simple cleanup vs full redraw"],
    limits: ["Complex crests from a blurry photo may need a better source or a redesign first", "We will not invent missing artwork the source does not contain"],
    process: ["Source file review", "Quote", "Trace or redraw", "Proof", "Final files"],
    turnaround: "Quoted from complexity. A simple wordmark is faster than a multi-color crest.",
    pricing: "Quoted from the source quality and the number of colors to rebuild.",
    revisions: "Corrections that match the original mark are included. Style changes are logo design, not tracing.",
    faqs: [
      { q: "Is this a new logo?", a: "No. Tracing follows the existing mark. Original design is a separate service." },
      { q: "What if the file is low quality?", a: "We can rebuild a simple mark. We will say so if the source is not enough." },
    ],
    related: ["custom-logo-design", "screen-printing", "embroidery-digitizing"],
  },
  {
    id: "custom-logo-design",
    href: "/custom-logo-design",
    route: "digitizing",
    title: "Custom Logo Design",
    outcome: "An original mark with agreed concepts, revisions and final files.",
    buyer: "New brands or teams that do not yet have artwork to digitize or print.",
    heading: "Original identity work, separate from a redraw.",
    lede: "We collect background, audience, style, colors, wording, references and intended uses, then design within the package you approve.",
    deliverables: ["Agreed number of concepts", "Revision rounds stated on the quote", "Final files and usage notes", "Ownership terms as written on the package"],
    inputs: ["Brand background", "Audience", "Style references", "Colors and wording", "Where the mark will be embroidered or printed"],
    options: ["Wordmark", "Badge / crest", "Simple icon + type"],
    limits: ["Concept count and revisions are those on the approved quote", "Trademark search is not included unless separately agreed"],
    process: ["Brief", "Concepts", "Revisions", "Final files", "Optional digitizing or print prep"],
    turnaround: "Quoted after the brief. Design is not a same-day file service.",
    pricing: "Package pricing is pending owner approval. Until then every job is quoted.",
    revisions: "Rounds are those on the quote. Extra rounds are billed before work continues.",
    faqs: [
      { q: "Can you also digitize the logo?", a: "Yes, as a related job after the mark is approved." },
      { q: "Who owns the files?", a: "Ownership follows the approved package. We will write it on the quote." },
    ],
    related: ["vector-tracing", "embroidery-digitizing", "custom-patches"],
  },
  {
    id: "custom-patches",
    href: "/custom-patches",
    route: "products",
    title: "Custom Patches",
    outcome: "Quoted patches with a specified type, backing, border and destination.",
    buyer: "Brands, teams, shops and individuals ordering badges in a real quantity.",
    heading: "Patches specified for the edge, the backing and the garment.",
    lede: "Embroidered, woven, PVC, chenille, printed or leather where we can supply them. Production and shipping are quoted separately when that is how the job will run.",
    deliverables: ["Quoted patch type and quantity", "Proof before production", "Backing and border as specified", "Packed for the destination you name"],
    inputs: ["Artwork", "Shape and dimensions", "Quantity", "Backing", "Border", "Thread or print colors", "Destination"],
    options: ["Embroidered", "Woven", "PVC", "Chenille", "Printed", "Leather — where available", "Iron-on, sew-on, hook-and-loop"],
    limits: ["Fine points need enough border or they fray", "Not every material is stocked for every destination", "Minimum quantities are pending owner catalog approval"],
    process: ["Brief", "Quote (production + shipping)", "Proof", "Production", "Dispatch"],
    turnaround: "Depends on type, quantity and destination. Dates are given on the quote, not as a site-wide promise.",
    pricing: "Quoted from size, type, quantity and destination. No one-price list until the catalog is approved.",
    revisions: "Proof changes inside the brief are included. A new shape or size after approval can affect cost and date.",
    faqs: [
      { q: "Do you ship to the US, UK and Australia?", a: "Those are the first markets. Charges and windows are pending owner confirmation and will appear on the quote." },
      { q: "Can I order one patch?", a: "Possible, but unit cost is usually higher. We quote the quantity you send." },
    ],
    related: ["embroidery-digitizing", "custom-hats", "embroidered-apparel"],
  },
  {
    id: "embroidered-apparel",
    href: "/embroidered-apparel",
    route: "products",
    title: "Embroidered Apparel",
    outcome: "Decorated garments with an approved placement and proof.",
    buyer: "Teams, workwear buyers and small groups who need shirts or uniforms branded.",
    heading: "Garments, placement and stitch size agreed before we sew.",
    lede: "Tell us garment type, brand/style if you have one, colors, sizes, quantity, placement and decoration size. Customer-supplied garments are accepted only if the studio has approved that service for the job.",
    deliverables: ["Quoted garment and decoration", "Proof", "Sample stage when the quote includes it", "Packed order"],
    inputs: ["Garment type", "Colors and sizes", "Quantity", "Placement", "Decoration size", "Artwork"],
    options: ["Polos and shirts", "Workwear", "Jackets", "Customer-supplied garments — only if approved"],
    limits: ["We do not promise stock brands until the catalog is confirmed", "A sew-out on a different fabric can look different on the final garment"],
    process: ["Brief", "Quote", "Proof / sample if quoted", "Production", "Dispatch"],
    turnaround: "Quoted from garment supply and quantity.",
    pricing: "Garment + decoration + shipping, itemized on the quote.",
    revisions: "Decoration changes after proof approval can require a new file and a new date.",
    faqs: [
      { q: "Can I send my own shirts?", a: "Only if we accept that on the quote. Damage risk on customer-supplied goods will be written there." },
    ],
    related: ["embroidery-digitizing", "screen-printing", "custom-hats"],
  },
  {
    id: "screen-printing",
    href: "/screen-printing",
    route: "products",
    title: "Screen Printing",
    outcome: "Printed garments with agreed colors, locations and quantities.",
    buyer: "Events, clubs and shops that need a print run, not a stitch file.",
    heading: "Print locations and ink colors agreed before screens are made.",
    lede: "We collect product, garment colors, sizes, quantities, print locations, number of artwork colors, print dimensions and destination.",
    deliverables: ["Quoted print job", "Placement/color proof", "Packed order"],
    inputs: ["Artwork or vector", "Garment colors", "Sizes and qty", "Locations", "Number of print colors", "Destination"],
    options: ["Chest", "Full front / back", "Sleeve", "Event and club runs"],
    limits: ["Halftones and fine type have print-size limits", "Garment color changes the visible ink"],
    process: ["Brief", "Quote", "Proof", "Print", "Dispatch"],
    turnaround: "Quoted from color count and quantity.",
    pricing: "Quoted from colors, locations, quantity and destination.",
    revisions: "Art changes after screens are made are a new cost.",
    faqs: [
      { q: "Do you print one shirt?", a: "Small runs are quoted. Setup usually favors a batch, not a single piece." },
    ],
    related: ["vector-tracing", "embroidered-apparel", "custom-hats"],
  },
  {
    id: "custom-hats",
    href: "/custom-hats",
    route: "products",
    title: "Custom Hats & Caps",
    outcome: "Caps with a specified style, decoration and quantity.",
    buyer: "Teams, shops and individuals ordering branded headwear.",
    heading: "Cap style and decoration planned for a curved field.",
    lede: "Style, structure, closure, colors, quantity, placement and decoration type (flat embroidery, 3D puff or a patch) are collected before we quote.",
    deliverables: ["Quoted cap and decoration", "Proof", "Packed order"],
    inputs: ["Cap style", "Colors", "Quantity", "Placement", "Decoration type", "Artwork"],
    options: ["Flat embroidery", "3D puff", "Patch application — where available"],
    limits: ["Cap windows are short; fine script often has to be simplified", "Structured vs unstructured crowns sew differently"],
    process: ["Brief", "Quote", "Proof", "Production", "Dispatch"],
    turnaround: "Quoted from style, decoration and destination.",
    pricing: "Cap + decoration + shipping on the quote.",
    revisions: "Placement or puff/flat changes after approval can need a new file.",
    faqs: [
      { q: "Can you digitize and sew the cap?", a: "Yes. The file and the decorated cap can be one job or two line items." },
    ],
    related: ["embroidery-digitizing", "custom-patches", "embroidered-apparel"],
  },
];

export function getService(id: string) {
  return services.find((item) => item.id === id);
}

export function getServiceByHref(href: string) {
  return services.find((item) => item.href === href);
}

export const processSteps = [
  { n: "01", title: "Send the brief and artwork", body: "Tell us the service, size, quantity and date. Upload the mark you have the right to use." },
  { n: "02", title: "Receive scope, price and timing", body: "We reply with what is included, what is not, the price and a realistic date — not a site-wide promise." },
  { n: "03", title: "Approve the artwork or proof", body: "Nothing is produced until you approve the exact proof version we send." },
  { n: "04", title: "Production begins", body: "After the required approval and, for products, the required payment state." },
  { n: "05", title: "Receive files or track delivery", body: "Digital jobs are released as files. Physical jobs ship with tracking once dispatch details are confirmed." },
] as const;

export const trustItems = [
  { title: "Proof and revision process", body: "You see a preview and can request changes before we lock the job." },
  { title: "Secure artwork handling", body: "Uploads are for quoting and production only. We do not publish a mark without permission." },
  { title: "Saved job specifications", body: "Approved files and notes are kept so a reorder does not start from a blank brief." },
  { title: "Production checks", body: "Size, fabric and placement are reviewed before the file or product is released." },
  { title: "Human support", body: "Questions go to the studio, not an automated estimator." },
] as const;

export const guides = [
  {
    href: "/resources/choosing-a-patch-type",
    title: "Choosing a patch type",
    body: "When embroidered, woven, PVC or chenille is the better fit.",
  },
  {
    href: "/resources/embroidery-proofs",
    title: "Understanding embroidery proofs",
    body: "What a stitch preview shows — and what it cannot show — before you approve.",
  },
  {
    href: "/resources/artwork-for-printing",
    title: "Preparing artwork for printing",
    body: "File types, color counts and sizes that keep a print job on schedule.",
  },
] as const;
