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
    entryTitle: "I need production files",
    body: "Embroidery digitizing, vector artwork, or an original logo — delivered as files ready for your machine or print process.",
    items: ["Embroidery digitizing", "Vector artwork", "Custom logo design"],
  },
  {
    id: "products",
    href: "/custom-products",
    title: "Custom Products",
    entryTitle: "I need finished products",
    body: "Custom patches, embroidered apparel, screen-printed shirts and caps — produced to an approved proof and shipped to you.",
    items: ["Custom patches", "Custom embroidery", "Screen printing", "Hats & caps"],
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
    h1: "Embroidery Digitizing Services for Your Logo",
    metaTitle: "Embroidery Digitizing Services",
    metaDescription:
      "Request embroidery digitizing for left chest logos, caps, and jacket backs. Share your artwork, size, fabric, and machine format with Brandstitch Works.",
    intro:
      "Turn your logo into a stitch file prepared for its intended size, fabric, and placement. Send Brandstitch Works your artwork and embroidery requirements so we can review the design and quote the digitizing work. This service supplies production files; garment embroidery is quoted separately.",
    buyers: ["Embroidery shops and apparel decorators", "Brands and apparel programs", "Teams and clubs ordering embroidered kit", "Anyone with a logo that needs to become a stitch file"],
    deliverables: [
      "Stitch file in the format you request",
      "Stitch preview (PDF or image) with color sequence",
      "Thread color list for the operator",
      "Production correction if the file needs adjusting on your machine",
    ],
    inputs: ["Artwork: AI, EPS, PDF, SVG, or a sharp PNG/JPG", "Finished size in inches or millimeters", "Fabric and garment or patch type", "Placement (left chest, cap front, back, sleeve, patch)", "Machine format, or say you are not sure"],
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
        title: "Choose your application",
        items: [
          { name: "Left chest and sleeve", note: "Small logos, readable text, tight density control" },
          { name: "Cap front (flat)", note: "Built for a curved field and center-out sewing" },
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
      "Turnaround is confirmed on the quote and counts from your confirmation of the quote. Standard left-chest files are usually the fastest; caps, jacket backs, appliqué and 3D puff take longer. Timing covers digitizing and one preview round; it does not include garment embroidery or shipping.",
    revisions:
      "Adjustments that keep the same artwork, size and placement are included. A new size, a different garment type, or a redesigned logo is a new file and is quoted separately.",
    faqs: [
      { q: "Can you digitize a JPG or PNG?", a: "Yes. Sharp artwork works best. Low-resolution images may need cleanup or vector redraw first; we will say so before quoting." },
      { q: "Which embroidery file formats do you supply?", a: "Machine formats such as DST, PES, EXP, JEF and EMB. Tell us the machine and we match the output. Editable source files are only included when stated on your quote." },
      { q: "What information is needed for cap digitizing?", a: "Artwork, finished height or width, cap style if known, flat or 3D puff, and your preferred machine format." },
      { q: "Does changing the size need new digitizing?", a: "Usually yes. A file built for one size does not sew the same at another size. Each size or placement is quoted as its own file." },
      { q: "Are revisions included?", a: "Adjustments that keep the same artwork, size and placement are included. Redesigns or new placements are quoted separately." },
      { q: "Is a sew-out included?", a: "A digital stitch preview is standard. A physical sew-out is available when requested and quoted as a line item." },
      { q: "Do I receive stitched garments or only files?", a: "This service delivers production files. Finished embroidered apparel is a separate service." },
    ],
    related: ["vector-tracing", "custom-patches", "custom-hats"],
  },
  {
    id: "vector-tracing",
    href: "/vector-tracing",
    route: "digitizing",
    kind: "digital",
    visual: "vector",
    title: "Vector Artwork",
    short: "Clean, scalable vector artwork and logo redraw for print and production.",
    h1: "Vector Art Services for Logos and Print Production",
    metaTitle: "Vector Art Conversion Services",
    metaDescription:
      "Need editable artwork for printing? Request logo vectorization or raster-to-vector conversion from Brandstitch Works and share your output requirements.",
    intro:
      "Prepare your logo for print and reuse with vector artwork built around your production requirements. Send a raster image, sketch, or existing logo and tell Brandstitch Works how you plan to use it. We will review the artwork and confirm the scope, output format, and price.",
    buyers: ["Print shops that receive low-resolution customer logos", "Brands with only a JPG or old PDF of their mark", "Sign, engraving and cutting shops", "Anyone preparing artwork for embroidery or screen printing"],
    deliverables: ["Vector files: AI, EPS, SVG and PDF", "Spot colors set to your reference (Pantone or hex) where supplied", "Separated colors for screen printing when requested", "Before/after preview for approval"],
    inputs: ["The best version of the logo you have", "Intended use: print, embroidery, signage, engraving, web", "Requested output format", "Color references, if any", "Whether you need design changes or a faithful redraw"],
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
        title: "Applications",
        items: [
          { name: "Screen printing", note: "Solid spot colors, separations on request" },
          { name: "Promotional products and branding", note: "Clean paths for reuse across channels" },
          { name: "Embroidery prep", note: "Simplified shapes ready to digitize" },
          { name: "Signage and vinyl", note: "Closed paths for cutting" },
        ],
      },
    ],
    priceFactors: ["Source quality: a clean scan is faster than a blurred photo", "Number of colors and separate elements", "Text that needs to be matched or redrawn by hand", "Separations or multiple output versions"],
    process: ["Send the logo and tell us how it will be used", "Receive the quote and confirm", "We redraw the artwork", "Review the before/after preview", "Download final files"],
    turnaround:
      "Confirmed on the quote. A simple wordmark is usually faster than a multi-color crest. Timing covers the redraw and one review round.",
    revisions: "Corrections that bring the vector closer to your original mark are included. Changing the design itself is logo design work and is quoted separately.",
    faqs: [
      { q: "Can you convert a low-resolution logo?", a: "Often yes for simple marks. If the source does not contain enough information to rebuild accurately, we will tell you before quoting." },
      { q: "Will the artwork be editable?", a: "Delivered AI, EPS, SVG and vector PDF files contain editable paths when that is what we produce. A PDF filename alone does not prove vector content; we confirm the format on your quote." },
      { q: "What is the difference between vector artwork and an embroidery file?", a: "Vector artwork is for print and design reuse. An embroidery file is stitch data for a machine. They are separate services." },
      { q: "Can you match my font or colors?", a: "We match lettering as outlines and set colors to Pantone or hex references you supply. We do not supply commercial font files." },
      { q: "Are screen-print color separations included?", a: "Separations are included when requested and listed on your quote. They are not automatic on every vector job." },
      { q: "Can I request a different design?", a: "Faithful redraws stay on this service. New creative direction is custom logo design and is quoted separately." },
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
    metaTitle: "Custom Logo Design Services",
    metaDescription:
      "Original logo design with agreed concepts, revision rounds and final files. Designed to work embroidered on caps and apparel as well as in print and on screen.",
    intro:
      "We design original marks for businesses, teams and brands that will be embroidered and printed. Concepts, revisions, ownership terms and final files are agreed before work starts, so you know exactly what you receive.",
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
    h1: "Custom Patches Made for Your Logo",
    metaTitle: "Custom Patches for Businesses & Teams",
    metaDescription:
      "Explore custom logo patches for uniforms, teams, and brands. Share your design, size, quantity, backing, and delivery needs for a tailored quote.",
    intro:
      "Create patches for uniforms, merchandise, teams, or your own clothing line. Share your artwork, preferred size, quantity, and attachment method with Brandstitch Works. We will help define the specifications and quote your order before production.",
    buyers: ["Brands and merchandise sellers", "Teams, clubs and schools", "Workwear and uniform buyers", "Individuals ordering a small run"],
    deliverables: ["Patches in the type, size and quantity quoted", "Digital proof before production", "Backing and border as specified", "Packed and shipped to your address with tracking"],
    inputs: ["Artwork", "Shape and finished size", "Quantity", "Patch type, or ask us to recommend one", "Backing and border", "Delivery country and ZIP or postal code"],
    specs: [
      {
        title: "Patch types",
        items: [
          { name: "Embroidered", note: "Thread on twill. Classic texture; best for bold shapes and text" },
          { name: "Woven", note: "Fine thread weave. Holds small text and thin lines" },
          { name: "PVC", note: "Molded rubber. Weatherproof, layered, strong colors" },
          { name: "Chenille", note: "Raised yarn loops. Varsity and letterman style" },
          { name: "Printed / sublimated", note: "Photographic detail and gradients on fabric" },
          { name: "Leather", note: "Debossed or laser-marked genuine or faux leather" },
        ],
      },
      {
        title: "Attachment choices",
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
      "Production timing is confirmed on the quote and starts after proof approval and payment. Transit time to your destination is quoted separately. Fulfillment ships from Pakistan; US delivery times and any duties depend on destination and carrier.",
    revisions: "Proof changes before approval are included. A change of size, shape or type after approval is re-quoted before production continues.",
    faqs: [
      { q: "What is the minimum quantity?", a: "Minimums depend on patch type and are stated on your quote. Small runs are possible; unit cost is higher at low quantities." },
      { q: "Which backing should I choose?", a: "Sew-on for permanent attachment, iron-on for heat application where the fabric allows, and hook-and-loop when you need to remove the patch. We can recommend based on how the patch will be used." },
      { q: "Can small lettering be reproduced?", a: "Fine text suits woven patches better than embroidered. Send the artwork and finished size and we will advise before quoting." },
      { q: "Is the proof digital or physical?", a: "A digital proof is standard before production. Physical samples are quoted separately when requested." },
      { q: "When will my order arrive?", a: "Your quote separates production days from estimated transit. Alaska, Hawaii and US territories may need separate confirmation." },
      { q: "What affects the price?", a: "Type, size, quantity, coverage, backing, setup, rush and shipping. Every quote itemizes these." },
      { q: "Can I reorder the same design?", a: "Yes. Keep your quote or order reference so we can match the approved specifications." },
    ],
    related: ["embroidery-digitizing", "custom-hats", "embroidered-apparel"],
  },
  {
    id: "embroidered-apparel",
    href: "/embroidered-apparel",
    route: "products",
    kind: "physical",
    visual: "apparel",
    title: "Custom Embroidery",
    short: "Polos, shirts, jackets and workwear embroidered with your logo.",
    h1: "Custom Embroidery for Branded Apparel",
    metaTitle: "Custom Embroidery for Business Apparel",
    metaDescription:
      "Add your logo to business apparel with custom embroidery. Share garment choices, quantities, placement, and artwork with Brandstitch Works for a quote.",
    intro:
      "Put your logo on apparel selected for your team or business. Tell Brandstitch Works which garments you need, how many, and where the design should appear. We will review the artwork and confirm the embroidery and garment requirements in your quote.",
    buyers: ["Businesses ordering staff uniforms", "Teams and clubs", "Hospitality, trades and workwear buyers", "Brands producing small apparel runs"],
    deliverables: ["Garments in the styles, colors and sizes quoted", "Embroidery digitized for the fabric", "Digital placement proof before production", "Packed by size and shipped with tracking"],
    inputs: ["Garment type and preferred style or brand", "Colors", "Size breakdown (for example S 4, M 10, L 8)", "Logo and any text", "Placement and decoration size", "Whether you supply garments or we source them", "Delivery country and ZIP or postal code"],
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
    priceFactors: ["Garment style and brand", "Quantity and size breakdown", "Stitch count of the design", "Number of placements per garment", "Personalization such as individual names", "Digitizing fees when a new file is required", "Delivery destination"],
    process: ["Send garment, sizes, quantity and logo", "Receive an itemized quote", "Approve the placement proof", "Digitizing and production", "Dispatch with tracking"],
    turnaround: "Production timing depends on garment availability and quantity and is stated on the quote. It starts after proof approval and payment; shipping from Pakistan is quoted separately from production.",
    revisions: "Placement and size changes on the proof are included. Changes after approval may need a new embroidery file and a new production date.",
    faqs: [
      { q: "Can I supply my own garments?", a: "Ask when you request the quote. If we accept customer-supplied garments, the terms and any risk on supplied goods are written on the quote." },
      { q: "Which items are suitable for embroidery?", a: "Most woven and knit polos, shirts, jackets and workwear. Very lightweight knits or coated fabrics may need a different process; we confirm on the quote." },
      { q: "Do you embroider names on individual shirts?", a: "Yes. Send a list of names with sizes and we quote personalization per piece." },
      { q: "Can setup be reused on reorders?", a: "Approved embroidery files stay with your order reference so repeat placements can start from the approved version." },
      { q: "Is file-only digitizing included?", a: "Digitizing for your order is quoted on the apparel job. Standalone stitch files for your own machines are the embroidery digitizing service." },
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
    h1: "Custom Screen Printing for Shirts and Apparel",
    metaTitle: "Custom Screen Printing Services",
    metaDescription:
      "Request screen printing for shirts, hoodies, and business apparel. Share your quantities, print locations, artwork, and deadline with Brandstitch Works.",
    intro:
      "Plan screen-printed apparel for your business, team, or event. Send your design, garment preferences, quantities, and print locations to Brandstitch Works so we can confirm the production approach and prepare your quote.",
    buyers: ["Events, festivals and fundraisers", "Clubs, schools and teams", "Merchandise and streetwear brands", "Shops outsourcing overflow print runs"],
    deliverables: ["Printed garments in the styles, colors and sizes quoted", "Digital placement and color proof", "Consistent color across the run", "Packed by size and shipped with tracking"],
    inputs: ["Artwork, ideally vector", "Garment style and colors", "Size breakdown and total quantity", "Print locations and sizes", "Number of ink colors per location, or say you are not sure", "Delivery country and ZIP or postal code"],
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
        title: "Artwork and process",
        items: [
          { name: "Spot colors", note: "Each ink color is one screen; fewer colors cost less" },
          { name: "Vector preferred", note: "AI, EPS, PDF or SVG. We can vector-trace a JPG first" },
          { name: "Light or dark garments", note: "Dark shirts usually need an underbase, counted as a color" },
          { name: "Not DTG or DTF", note: "This page covers screen printing only. Other print methods are quoted only when offered separately." },
        ],
      },
    ],
    priceFactors: ["Number of ink colors per location", "Number of print locations", "Quantity: screen setup is spread across the run", "Garment style and color", "Specialty inks or oversized prints", "Delivery destination"],
    process: ["Send artwork, garments, sizes and locations", "Receive an itemized quote", "Approve the placement and color proof", "Screens made and printed", "Dispatch with tracking"],
    turnaround: "Production timing is stated on the quote and starts after proof approval and payment. Shipping is quoted separately for your destination.",
    revisions: "Artwork and color changes on the proof are included. Changes after screens are made are quoted as new setup.",
    faqs: [
      { q: "Is there a minimum quantity?", a: "Screen printing suits runs rather than single pieces because each color needs a screen. Minimums by color count are stated on your quote. We do not advertise a blanket no-minimum claim." },
      { q: "Can you print photos or gradients?", a: "Screen printing works best with solid spot colors. For photographic artwork we will recommend an alternative on the quote rather than labeling every method as screen printing." },
      { q: "Are separations, screens and setup charged?", a: "Yes. Setup and screens are part of the quote and are itemized. They are spread across the run as quantity rises." },
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
    h1: "Custom Embroidered Hats and Caps",
    metaTitle: "Custom Embroidered Hats & Caps",
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
    title: "Submit your requirements",
    body: "Choose the service, upload artwork and tell us size, quantity, placement and the date you need it.",
  },
  {
    n: "02",
    title: "Receive scope and quote",
    body: "Digital work is quoted per file. Products are quoted per unit with shipping shown separately. Payment terms are on the quote.",
  },
  {
    n: "03",
    title: "Approve the applicable proof",
    body: "You approve a stitch preview or placement proof before anything is produced. Changes are made at this stage.",
  },
  {
    n: "04",
    title: "Receive files or shipped goods",
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
