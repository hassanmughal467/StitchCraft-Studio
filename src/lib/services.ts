export type ServiceRoute = "digitizing" | "products";
export type ServiceKind = "digital" | "physical";
export type ServiceVisual = "digitizing" | "vector" | "logo" | "patches" | "apparel" | "printing" | "caps";

export type SpecGroup = {
  title: string;
  items: { name: string; note: string }[];
};

export type ServicePage = {
  id: string;
  href: string;
  route: ServiceRoute;
  kind: ServiceKind;
  visual: ServiceVisual;
  title: string;
  /** Short label used in navigation cards. */
  short: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  buyers: string[];
  deliverables: string[];
  inputs: string[];
  specs: SpecGroup[];
  priceFactors: string[];
  process: string[];
  turnaround: string;
  revisions: string;
  faqs: { q: string; a: string }[];
  related: string[];
};

export const routes = [
  {
    id: "digitizing",
    href: "/digitizing-artwork",
    title: "Digitizing & Artwork",
    body: "You receive files: embroidery files for your machine, clean vector artwork, or an original logo.",
    items: ["Embroidery digitizing", "Vector tracing", "Custom logo design"],
  },
  {
    id: "products",
    href: "/custom-products",
    title: "Custom Products",
    body: "You receive finished goods: patches, embroidered apparel, printed shirts and caps, shipped to you.",
    items: ["Custom patches", "Embroidered apparel", "Screen printing", "Hats & caps"],
  },
] as const;

export const services: ServicePage[] = [
  {
    id: "embroidery-digitizing",
    href: "/embroidery-digitizing",
    route: "digitizing",
    kind: "digital",
    visual: "digitizing",
    title: "Embroidery Digitizing",
    short: "Machine-ready stitch files for caps, apparel and patches.",
    h1: "Embroidery Digitizing for Caps, Apparel & Patches",
    metaTitle: "Embroidery Digitizing Service for Caps, Apparel & Patches",
    metaDescription:
      "Custom embroidery digitizing for left chest, caps, jacket backs, patches and 3D puff. Files delivered in DST, PES, EXP, JEF, EMB and other machine formats with a stitch preview.",
    intro:
      "Send your logo, the sew size and the garment. We build a stitch file for that placement and machine, check it as a preview, and deliver the format your shop runs.",
    buyers: ["Embroidery shops and decorators", "Brands and apparel programs", "Teams and clubs ordering embroidered kit", "Anyone with a logo that needs to become a stitch file"],
    deliverables: [
      "Stitch file in the format you request",
      "Stitch preview (PDF or image) with color sequence",
      "Thread color list for the operator",
      "Production correction if the file needs adjusting on your machine",
    ],
    inputs: ["Artwork: AI, EPS, PDF, SVG, or a sharp PNG/JPG", "Finished size in inches or millimetres", "Fabric and garment or patch type", "Placement (left chest, cap front, back, sleeve, patch)", "Machine format"],
    specs: [
      {
        title: "Formats we deliver",
        items: [
          { name: "DST", note: "Tajima and most commercial machines" },
          { name: "PES / PEC", note: "Brother, Babylock" },
          { name: "EXP", note: "Melco, Bernina" },
          { name: "JEF", note: "Janome" },
          { name: "EMB", note: "Wilcom native, editable" },
          { name: "OFM / PXF / others", note: "Named on your request" },
        ],
      },
      {
        title: "Placements we digitize for",
        items: [
          { name: "Left chest and sleeve", note: "Small logos, readable text, tight density control" },
          { name: "Cap front (flat)", note: "Built for a curved field and centre-out sewing" },
          { name: "Cap front (3D puff)", note: "Wide satin columns, foam-height letterforms" },
          { name: "Jacket back", note: "Large panels, sequenced to keep the hoop stable" },
          { name: "Patch files", note: "Fill, border and merrow allowance for patch production" },
          { name: "Appliqué", note: "Placement, tack-down and cover stitch sequence" },
        ],
      },
    ],
    priceFactors: ["Finished size and stitch count", "Number of placements (cap, chest and back are separate files)", "Detail level: small text, gradients, appliqué or puff", "Fabric: knit, pique, twill, fleece or cap buckram", "Rush requests"],
    process: ["Send artwork, size, fabric and format", "Receive the quote and confirm", "We digitize and send a stitch preview", "Approve or request changes", "Download the file in your format"],
    turnaround:
      "Turnaround is confirmed on the quote and counts from your approval of the quote. Standard left-chest files are usually the fastest; caps, jacket backs, appliqué and 3D puff take longer. Timing covers digitizing and one preview round; it does not include your garment production.",
    revisions:
      "Adjustments that keep the same artwork, size and placement are included. A new size, a different garment type, or a redesigned logo is a new file and is quoted separately.",
    faqs: [
      { q: "Which formats do you deliver?", a: "DST, PES, EXP, JEF, EMB and other shop formats. Tell us the machine and we will match the format." },
      { q: "Can one file be used on a cap, a polo and a jacket back?", a: "No. Each placement has a different size, fabric and sewing direction, so each is digitized separately. We quote them together when you order together." },
      { q: "Will you fix a file that does not sew well on my machine?", a: "Yes. Send a photo of the sew-out and the fabric details and we adjust density, underlay or pull compensation." },
      { q: "Do you sew a physical sample?", a: "A stitch preview is standard. If you need a physical sew-out before a bulk run, ask on the quote form and we will quote it as a line item." },
    ],
    related: ["vector-tracing", "custom-patches", "custom-hats"],
  },
  {
    id: "vector-tracing",
    href: "/vector-tracing",
    route: "digitizing",
    kind: "digital",
    visual: "vector",
    title: "Vector Tracing",
    short: "Clean, scalable vector artwork rebuilt from any logo file.",
    h1: "Vector Tracing & Logo Redraw Services",
    metaTitle: "Vector Tracing & Logo Redraw",
    metaDescription:
      "Convert a JPG, PNG, scan or flattened PDF into clean vector artwork for screen printing, embroidery, signage, engraving and web. Delivered as AI, EPS, SVG and PDF.",
    intro:
      "A vector redraw rebuilds your existing logo as clean paths so it prints sharp at any size. It is not a new design: we follow your mark and fix what the source file lost.",
    buyers: ["Print shops that receive low-resolution customer logos", "Brands with only a JPG or old PDF of their mark", "Sign, engraving and cutting shops", "Anyone preparing artwork for embroidery or screen printing"],
    deliverables: ["Vector files: AI, EPS, SVG and PDF", "Spot colors set to your reference (Pantone or hex) where supplied", "Separated colors for screen printing when requested", "Before/after preview for approval"],
    inputs: ["The best version of the logo you have", "Intended use: print, embroidery, signage, engraving, web", "Color references, if any", "Text or fonts you already know"],
    specs: [
      {
        title: "Redraw or original design?",
        items: [
          { name: "Vector tracing", note: "Your existing logo, rebuilt accurately as vector paths" },
          { name: "Cleanup", note: "Fixing rough edges, uneven text or colors in an existing vector" },
          { name: "Custom logo design", note: "A new mark from a brief. See our logo design service" },
        ],
      },
      {
        title: "Output uses",
        items: [
          { name: "Screen printing", note: "Solid spot colors, separations on request" },
          { name: "Embroidery prep", note: "Simplified shapes ready to digitize" },
          { name: "Signage and vinyl", note: "Closed paths for cutting" },
          { name: "Web and documents", note: "SVG and PDF at any size" },
        ],
      },
    ],
    priceFactors: ["Source quality: a clean scan is faster than a blurred photo", "Number of colors and separate elements", "Text that needs to be matched or redrawn by hand", "Separations or multiple output versions"],
    process: ["Send the logo and tell us how it will be used", "Receive the quote and confirm", "We redraw the artwork", "Review the before/after preview", "Download final files"],
    turnaround:
      "Confirmed on the quote. A simple wordmark is usually faster than a multi-color crest. Timing covers the redraw and one review round.",
    revisions: "Corrections that bring the vector closer to your original mark are included. Changing the design itself is logo design work and is quoted separately.",
    faqs: [
      { q: "Is this the same as a new logo?", a: "No. Tracing reproduces your existing logo. If you want changes to the design, see custom logo design." },
      { q: "My file is very low quality. Can you still trace it?", a: "Usually yes for simple marks. If the source does not contain enough information we will tell you before quoting." },
      { q: "Do I get the font?", a: "We match or redraw the lettering as outlines. We do not supply commercial font files." },
    ],
    related: ["custom-logo-design", "screen-printing", "embroidery-digitizing"],
  },
  {
    id: "custom-logo-design",
    href: "/custom-logo-design",
    route: "digitizing",
    kind: "digital",
    visual: "logo",
    title: "Custom Logo Design",
    short: "An original mark designed to work in thread and ink.",
    h1: "Custom Logo Design for Your Business or Brand",
    metaTitle: "Custom Logo Design for Businesses, Teams & Brands",
    metaDescription:
      "Original logo design with agreed concepts, revision rounds and final files. Designed to work embroidered on caps and apparel as well as in print and on screen.",
    intro:
      "We design original marks for businesses, teams and brands that will be embroidered and printed. Concepts, revisions and final files are agreed before work starts, so you know exactly what you receive.",
    buyers: ["New businesses and side projects", "Teams, clubs and events", "Brands refreshing a mark that never worked in embroidery", "Print shops that want to offer design to their customers"],
    deliverables: ["The agreed number of initial concepts", "Revision rounds stated on your quote", "Final files: AI, EPS, SVG, PDF and PNG", "Color and clear-space notes", "Written usage rights as set out on the quote"],
    inputs: ["Business or team name and exact wording", "Who the logo needs to speak to", "Style references you like or dislike", "Colors you must keep or avoid", "Where it will be used: caps, shirts, patches, signage, web"],
    specs: [
      {
        title: "What to send",
        items: [
          { name: "Wording", note: "Exact name, tagline and any abbreviations" },
          { name: "Audience", note: "Customers, members or players the logo is for" },
          { name: "Style", note: "Examples you like, and ones you do not" },
          { name: "Colors", note: "Brand colors or thread colors you plan to use" },
          { name: "Uses", note: "Embroidery, print, signage, digital" },
        ],
      },
      {
        title: "Logo types",
        items: [
          { name: "Wordmark", note: "Typography-led name" },
          { name: "Badge or crest", note: "Contained shape that suits patches and caps" },
          { name: "Icon and type", note: "A symbol with the name, usable together or apart" },
        ],
      },
    ],
    priceFactors: ["Number of concepts and revision rounds", "Logo type and complexity", "Extra deliverables such as embroidery files or a print-ready version", "Rush timing"],
    process: ["Send the brief", "Receive the quote with concept and revision scope", "Review initial concepts", "Refine through the agreed rounds", "Receive final files and usage terms"],
    turnaround: "Design timing is confirmed on the quote after we read the brief. It depends on concept count and how quickly feedback comes back.",
    revisions: "Revision rounds are those stated on the quote. Additional rounds are quoted before we continue.",
    faqs: [
      { q: "Who owns the finished logo?", a: "Usage rights are written on your quote before you approve it. Final ownership terms transfer on final payment as stated there." },
      { q: "Can you also digitize or print the new logo?", a: "Yes. We design with thread and ink in mind and can quote digitizing, patches or apparel as a follow-on job." },
      { q: "Do you check trademarks?", a: "We do not carry out trademark searches or legal clearance. We recommend checking with a trademark professional before you commit." },
    ],
    related: ["vector-tracing", "embroidery-digitizing", "custom-patches"],
  },
  {
    id: "custom-patches",
    href: "/custom-patches",
    route: "products",
    kind: "physical",
    visual: "patches",
    title: "Custom Patches",
    short: "Embroidered, woven, PVC and chenille patches with your choice of backing.",
    h1: "Custom Patches for Brands, Teams & Workwear",
    metaTitle: "Custom Patches: Embroidered, Woven, PVC & Chenille",
    metaDescription:
      "Custom patches made to your artwork: embroidered, woven, PVC, chenille and printed, with iron-on, sew-on or hook-and-loop backing and merrowed or laser-cut borders.",
    intro:
      "Tell us the artwork, size, quantity and how the patch will be attached. We recommend the right patch type for the design, send a proof, and ship the finished patches to you.",
    buyers: ["Brands and merchandise sellers", "Teams, clubs and schools", "Workwear and uniform buyers", "Individuals ordering a small run"],
    deliverables: ["Patches in the type, size and quantity quoted", "Digital proof before production", "Backing and border as specified", "Packed and shipped to your address with tracking"],
    inputs: ["Artwork", "Shape and finished size", "Quantity", "Patch type, or ask us to recommend one", "Backing and border", "Delivery country and postal code"],
    specs: [
      {
        title: "Patch types",
        items: [
          { name: "Embroidered", note: "Thread on twill. Classic texture; best for bold shapes and text" },
          { name: "Woven", note: "Fine thread weave. Holds small text and thin lines" },
          { name: "PVC", note: "Moulded rubber. Weatherproof, layered, strong colors" },
          { name: "Chenille", note: "Raised yarn loops. Varsity and letterman style" },
          { name: "Printed / sublimated", note: "Photographic detail and gradients on fabric" },
          { name: "Leather", note: "Debossed or laser-marked genuine or faux leather" },
        ],
      },
      {
        title: "Backing options",
        items: [
          { name: "Iron-on", note: "Heat-seal adhesive for home or press application" },
          { name: "Sew-on", note: "Plain backing for stitching to the garment" },
          { name: "Hook-and-loop", note: "Removable, for tactical, uniform and bag use" },
          { name: "Adhesive", note: "Peel-and-stick for short-term use" },
        ],
      },
      {
        title: "Borders and shapes",
        items: [
          { name: "Merrowed edge", note: "Wrapped overlock border on standard shapes" },
          { name: "Hot-cut / laser-cut", note: "Clean edge on custom die-cut shapes" },
          { name: "Standard shapes", note: "Circle, square, shield, rectangle" },
          { name: "Custom shapes", note: "Cut to follow your artwork" },
        ],
      },
    ],
    priceFactors: ["Patch type and size", "Quantity: unit price drops as quantity rises", "Border style and custom shapes", "Backing choice", "Thread or color count for embroidered and woven patches", "Delivery destination"],
    process: ["Send artwork, size, quantity and backing", "Receive an itemized quote for production and shipping", "Approve the digital proof", "Production", "Dispatch with tracking"],
    turnaround:
      "Production timing is confirmed on the quote and starts after proof approval and payment. Shipping time to your country is quoted separately from production.",
    revisions: "Proof changes before approval are included. A change of size, shape or type after approval is re-quoted before production continues.",
    faqs: [
      { q: "Which patch type should I choose?", a: "Bold designs with text over about 6 mm suit embroidered patches. Small text and fine detail suit woven. Outdoor and gear use suit PVC. Send the artwork and we will recommend one." },
      { q: "What is the minimum order?", a: "Minimums depend on patch type and are stated on your quote. Small runs are possible; unit cost is higher at low quantities." },
      { q: "Do you ship to the US, UK and Australia?", a: "Yes. Shipping cost and estimated transit time are itemized on the quote for your postal code." },
    ],
    related: ["embroidery-digitizing", "custom-hats", "embroidered-apparel"],
  },
  {
    id: "embroidered-apparel",
    href: "/embroidered-apparel",
    route: "products",
    kind: "physical",
    visual: "apparel",
    title: "Embroidered Apparel",
    short: "Polos, shirts, jackets and workwear embroidered with your logo.",
    h1: "Custom Embroidered Apparel for Businesses & Teams",
    metaTitle: "Custom Embroidered Apparel: Polos, Shirts, Jackets & Workwear",
    metaDescription:
      "Custom embroidered polos, shirts, hoodies, jackets and workwear with your logo. Placement, size breakdown and proof agreed before we sew. Shipped to the US, UK and Australia.",
    intro:
      "Choose the garment, tell us the sizes and quantity, and send the logo. We confirm placement and decoration size on a proof, embroider the order and ship it to you.",
    buyers: ["Businesses ordering staff uniforms", "Teams and clubs", "Hospitality, trades and workwear buyers", "Brands producing small apparel runs"],
    deliverables: ["Garments in the styles, colors and sizes quoted", "Embroidery digitized for the fabric", "Digital placement proof before production", "Packed by size and shipped with tracking"],
    inputs: ["Garment type and preferred style or brand", "Colors", "Size breakdown (for example S 4, M 10, L 8)", "Logo and any text", "Placement and decoration size", "Delivery country and postal code"],
    specs: [
      {
        title: "Garments",
        items: [
          { name: "Polos and t-shirts", note: "Left chest logos, sleeve marks, back text" },
          { name: "Hoodies and sweatshirts", note: "Chest, full front or back" },
          { name: "Jackets and softshells", note: "Left chest plus large back panels" },
          { name: "Workwear and hi-vis", note: "Durable stitching for hard wear and washing" },
          { name: "Aprons and hospitality", note: "Bib, chest and pocket placements" },
        ],
      },
      {
        title: "Placements",
        items: [
          { name: "Left chest", note: "Typically 3–4 in (75–100 mm) wide" },
          { name: "Right chest / name", note: "Personalized names and titles" },
          { name: "Sleeve", note: "Small marks, flags and text" },
          { name: "Full back", note: "Large logos and lettering" },
          { name: "Nape / collar", note: "Small brand marks" },
        ],
      },
    ],
    priceFactors: ["Garment style and brand", "Quantity and size breakdown", "Stitch count of the design", "Number of placements per garment", "Personalization such as individual names", "Delivery destination"],
    process: ["Send garment, sizes, quantity and logo", "Receive an itemized quote", "Approve the placement proof", "Digitizing and production", "Dispatch with tracking"],
    turnaround: "Production timing depends on garment availability and quantity and is stated on the quote. It starts after proof approval and payment; shipping is quoted separately.",
    revisions: "Placement and size changes on the proof are included. Changes after approval may need a new embroidery file and a new production date.",
    faqs: [
      { q: "Can I supply my own garments?", a: "Ask when you request the quote. If we accept customer-supplied garments for your job, the terms and any risk on supplied goods are written on the quote." },
      { q: "Do you embroider names on individual shirts?", a: "Yes. Send a list of names with sizes and we quote personalization per piece." },
      { q: "How large can a back design be?", a: "Most jacket and hoodie backs take designs up to about 10–12 in (250–300 mm) wide. We confirm the exact maximum for your garment on the proof." },
    ],
    related: ["embroidery-digitizing", "screen-printing", "custom-hats"],
  },
  {
    id: "screen-printing",
    href: "/screen-printing",
    route: "products",
    kind: "physical",
    visual: "printing",
    title: "Screen Printing",
    short: "Printed shirts and apparel for events, teams and merchandise.",
    h1: "Custom Screen Printing for Shirts & Apparel",
    metaTitle: "Custom Screen Printing for T-Shirts, Hoodies & Apparel",
    metaDescription:
      "Custom screen printing for t-shirts, hoodies and event apparel. Front, back and sleeve prints with spot colors, proof approval and shipping to the US, UK and Australia.",
    intro:
      "Screen printing suits bold artwork in solid colors on t-shirts, hoodies and event apparel. Send the design, garment colors and quantities and we quote by print location and color count.",
    buyers: ["Events, festivals and fundraisers", "Clubs, schools and teams", "Merchandise and streetwear brands", "Shops outsourcing overflow print runs"],
    deliverables: ["Printed garments in the styles, colors and sizes quoted", "Digital placement and color proof", "Consistent color across the run", "Packed by size and shipped with tracking"],
    inputs: ["Artwork, ideally vector", "Garment style and colors", "Size breakdown and total quantity", "Print locations and sizes", "Number of ink colors per location", "Delivery country and postal code"],
    specs: [
      {
        title: "Print locations",
        items: [
          { name: "Full front", note: "Up to about 12 × 16 in (300 × 400 mm)" },
          { name: "Left chest", note: "Small logo, typically 3–4 in wide" },
          { name: "Full back", note: "Large designs and event listings" },
          { name: "Sleeve", note: "Narrow marks and text" },
          { name: "Nape", note: "Small brand mark below the collar" },
        ],
      },
      {
        title: "Artwork requirements",
        items: [
          { name: "Spot colors", note: "Each ink color is one screen; fewer colors cost less" },
          { name: "Vector preferred", note: "AI, EPS, PDF or SVG. We can vector-trace a JPG first" },
          { name: "Light or dark garments", note: "Dark shirts usually need an underbase, counted as a color" },
          { name: "Fine detail", note: "Keep lines above about 0.5 pt and text above about 8 pt" },
        ],
      },
    ],
    priceFactors: ["Number of ink colors per location", "Number of print locations", "Quantity: screen setup is spread across the run", "Garment style and color", "Specialty inks or oversized prints", "Delivery destination"],
    process: ["Send artwork, garments, sizes and locations", "Receive an itemized quote", "Approve the placement and color proof", "Screens made and printed", "Dispatch with tracking"],
    turnaround: "Production timing is stated on the quote and starts after proof approval and payment. Shipping is quoted separately for your destination.",
    revisions: "Artwork and color changes on the proof are included. Changes after screens are made are quoted as new setup.",
    faqs: [
      { q: "Is there a minimum quantity?", a: "Screen printing suits runs rather than single pieces because each color needs a screen. Minimums by color count are stated on your quote." },
      { q: "Can you print photos or gradients?", a: "Screen printing works best with solid spot colors. For photographic artwork we will recommend an alternative on the quote." },
      { q: "Will the colors match my brand?", a: "Send Pantone references and we mix to match as closely as the ink system allows. The proof shows the intended colors." },
    ],
    related: ["vector-tracing", "embroidered-apparel", "custom-hats"],
  },
  {
    id: "custom-hats",
    href: "/custom-hats",
    route: "products",
    kind: "physical",
    visual: "caps",
    title: "Custom Hats & Caps",
    short: "Embroidered and patch caps in structured, dad-hat and trucker styles.",
    h1: "Custom Embroidered Hats & Patch Caps",
    metaTitle: "Custom Embroidered Hats, 3D Puff Caps & Patch Caps",
    metaDescription:
      "Custom caps with flat embroidery, 3D puff or applied patches. Structured, unstructured, trucker and beanie styles, proof approved before production and shipped with tracking.",
    intro:
      "Pick a cap style, choose flat embroidery, 3D puff or a patch, and send your logo. We digitize for the cap's curved front, proof the placement and ship the finished caps.",
    buyers: ["Brands and merchandise sellers", "Teams, clubs and events", "Businesses ordering staff or promotional caps", "Individuals ordering small runs"],
    deliverables: ["Caps in the style, color and quantity quoted", "Embroidery digitized specifically for caps", "Digital placement proof", "Boxed and shipped with tracking"],
    inputs: ["Cap style and color", "Quantity", "Decoration: flat embroidery, 3D puff or patch", "Logo and any side or back text", "Delivery country and postal code"],
    specs: [
      {
        title: "Cap styles",
        items: [
          { name: "Structured 6-panel", note: "Firm front, classic snapback or fitted look" },
          { name: "Unstructured / dad hat", note: "Soft crown, curved peak, relaxed fit" },
          { name: "Trucker", note: "Foam or twill front with mesh back" },
          { name: "5-panel and flat peak", note: "Streetwear styles with a larger flat front" },
          { name: "Beanies", note: "Knit beanies with embroidered or woven patches" },
        ],
      },
      {
        title: "Decoration",
        items: [
          { name: "Flat embroidery", note: "Front, side and back placements" },
          { name: "3D puff", note: "Raised foam lettering; suits bold, simple shapes" },
          { name: "Applied patch", note: "Embroidered, woven, PVC or leather patch sewn or heat-applied" },
          { name: "Closure", note: "Snapback, strapback, velcro or fitted" },
        ],
      },
      {
        title: "Placement limits",
        items: [
          { name: "Front", note: "Usually up to about 2.25 in (57 mm) high on structured caps; lower on unstructured" },
          { name: "Side", note: "Small marks, about 1.5–2 in wide" },
          { name: "Back", note: "Above the closure; short text or a small icon" },
        ],
      },
    ],
    priceFactors: ["Cap style and brand", "Quantity", "Decoration type: puff and patches cost more than flat embroidery", "Number of placements", "Stitch count of the front design", "Delivery destination"],
    process: ["Send cap style, quantity, decoration and logo", "Receive an itemized quote", "Approve the placement proof", "Digitizing and production", "Dispatch with tracking"],
    turnaround: "Production timing is stated on the quote and starts after proof approval and payment. Shipping is quoted separately.",
    revisions: "Placement and size changes on the proof are included. Switching between flat, puff or patch after approval requires a new file and is re-quoted.",
    faqs: [
      { q: "Can I get my logo in 3D puff?", a: "Puff works for bold letters and simple shapes with columns roughly 3 mm or wider. Fine script and small detail are better as flat embroidery or a woven patch; we advise on the proof." },
      { q: "Do you make patch caps?", a: "Yes. We produce the patch and apply it to the cap, or we can supply patches separately for you to apply." },
      { q: "Can you digitize the logo and make the caps as one order?", a: "Yes. The embroidery file and the finished caps are quoted as line items on one quote." },
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
  {
    n: "01",
    title: "Send your requirements",
    body: "Choose the service, upload artwork and tell us size, quantity, placement and the date you need it.",
  },
  {
    n: "02",
    title: "Receive an itemized quote",
    body: "Digital work is quoted per file. Products are quoted per unit with shipping shown separately. Payment terms are on the quote.",
  },
  {
    n: "03",
    title: "Approve the proof",
    body: "You approve a stitch preview or placement proof before anything is produced. Changes are made at this stage.",
  },
  {
    n: "04",
    title: "Receive files or products",
    body: "Files are delivered for download. Products are made after approval and payment, then shipped with tracking.",
  },
] as const;

export const buyingAnswers = [
  {
    q: "What determines the price?",
    a: "For files: size, stitch count or complexity, and the number of placements. For products: item, quantity, decoration type, number of placements and destination. Every quote itemizes these.",
  },
  {
    q: "Is there a minimum quantity?",
    a: "Digital work has no minimum. Product minimums depend on the item and decoration type and are stated on your quote. Small runs are possible at a higher unit cost.",
  },
  {
    q: "How long does it take?",
    a: "Each quote states production time and, for products, an estimated shipping time to your country. Production starts after proof approval and payment.",
  },
  {
    q: "What about revisions?",
    a: "Changes before you approve the proof are part of the job. Changes after approval that need a new file, screen or production run are quoted before we continue.",
  },
] as const;

export const tradeBenefits = [
  { title: "Artwork kept on file", body: "Approved embroidery files, vectors and proofs stay attached to your quote reference, so repeat jobs start from the approved version." },
  { title: "Overflow and white-label work", body: "Digitizing, vector and production work delivered under your reference. We do not contact your customers." },
  { title: "Consistent proofs", body: "Every job gets a stitch preview or placement proof before production, in a format you can forward to your customer." },
  { title: "Trade pricing by agreement", body: "Trade terms are agreed after your first job based on volume and job mix, and confirmed in writing on each quote." },
] as const;

export const guides = [
  {
    href: "/resources/choosing-a-patch-type",
    title: "Choosing a patch type",
    body: "Embroidered, woven, PVC or chenille: which one fits your artwork and how the patch will be used.",
    datePublished: "2026-09-12",
  },
  {
    href: "/resources/embroidery-proofs",
    title: "Understanding embroidery proofs",
    body: "What a stitch preview shows, what it cannot show, and what to check before you approve.",
    datePublished: "2026-09-12",
  },
  {
    href: "/resources/artwork-for-printing",
    title: "Preparing artwork for printing",
    body: "File types, color counts and sizes that keep a screen print job on schedule.",
    datePublished: "2026-09-12",
  },
  {
    href: "/resources/vector-vs-digitizing",
    title: "Vector tracing vs embroidery digitizing",
    body: "Two different files for two different machines, and why a vector logo still needs digitizing.",
    datePublished: "2026-09-12",
  },
] as const;
