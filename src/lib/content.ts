export const services = [
  {
    id: "digitizing",
    href: "/embroidery-digitizing",
    title: "Embroidery digitizing",
    summary:
      "Production files built for clean registration, sensible stitch counts, and consistent runs on the machines you actually use.",
  },
  {
    id: "patches",
    href: "/custom-patches",
    title: "Custom embroidered patches",
    summary:
      "Merrowed, die-cut, and shaped patches prepared from your artwork, with backing and finish options that match how the patch will be applied.",
  },
  {
    id: "logo-digitizing",
    href: "/services#logo-digitizing",
    title: "Logo digitizing",
    summary:
      "Brand marks converted for left-chest, sleeve, and cap placements without losing the shapes that make the logo readable.",
  },
  {
    id: "jacket-back",
    href: "/services#jacket-back",
    title: "Jacket-back patches",
    summary:
      "Large-format designs planned for jacket backs, including split files, underlay, and density that will not warp heavy garments.",
  },
  {
    id: "caps",
    href: "/services#caps",
    title: "Hat and cap embroidery files",
    summary:
      "Front, side, and rear cap files that account for structured crowns, curvature, and the limited height of a typical cap window.",
  },
  {
    id: "applique",
    href: "/services#applique",
    title: "Appliqué digitizing",
    summary:
      "Placement, tack-down, and cover stitches sequenced so fabric pieces sit flat and edges stay clean after trimming.",
  },
  {
    id: "puff",
    href: "/services#puff",
    title: "3D puff embroidery",
    summary:
      "Raised lettering and simple shapes digitized with foam in mind — wide columns, controlled underlay, and finishes that hold height.",
  },
  {
    id: "chenille",
    href: "/services#chenille",
    title: "Chenille and woven patches",
    summary:
      "Varsity-style chenille and woven labels specified with the right pile, border, and backing for jackets, bags, and teamwear.",
  },
  {
    id: "vector",
    href: "/services#vector",
    title: "Vector artwork preparation",
    summary:
      "Cleanup of logos and scans so stitch paths can follow real edges instead of muddy pixels or overlapping fills.",
  },
  {
    id: "bulk",
    href: "/services#bulk",
    title: "Bulk order support",
    summary:
      "Repeatable file sets, colorways, and patch runs for shops and brands that need the same mark across many SKUs.",
  },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Submit artwork",
    body: "Send your logo, sketch, or existing file with garment type, size, and deadline. Vector or high-resolution artwork is preferred; we can work from a clear raster if needed.",
  },
  {
    n: "02",
    title: "Review & digitize",
    body: "We check scale, stitch type, and fabric. Then we build the file: underlay, pathing, trims, and color sequence set for the machine and placement you named.",
  },
  {
    n: "03",
    title: "Approve proof",
    body: "You receive a stitch preview and notes on any adjustments. Request changes before we lock the file. Nothing is released until you approve.",
  },
  {
    n: "04",
    title: "Receive files or patches",
    body: "Approved digitizing is delivered in the formats your shop runs. Patch orders move into production with the backing and finish you selected.",
  },
] as const;

export const industries = [
  {
    title: "Clothing brands",
    body: "Seasonal marks, chest logos, and capsule graphics that need to sew the same way across factories and contract shops.",
  },
  {
    title: "Fashion companies",
    body: "Lookbook and runway-adjacent branding where edges, letter spacing, and fabric choice have to stay exact.",
  },
  {
    title: "Workwear suppliers",
    body: "Durable left-chest and back marks for heavy twill, ripstop, and coated fabrics that see daily wear.",
  },
  {
    title: "Sports teams",
    body: "Crests, numbers, and sponsor marks for jerseys, warm-ups, and caps, including puff and appliqué where it helps.",
  },
  {
    title: "Uniform companies",
    body: "Repeatable identity files for hospitality, healthcare, security, and corporate programs with many locations.",
  },
  {
    title: "Promotional-product businesses",
    body: "Fast, clear files for hats, polos, bags, and giveaways when the order cannot wait on a redraw.",
  },
  {
    title: "Merchandise brands",
    body: "Tour, campus, and lifestyle merch — jacket backs, chenille, and patches that have to match the printed artwork.",
  },
  {
    title: "Embroidery shops",
    body: "Overflow digitizing and patch support when your own queue is full or a job needs a specialist file.",
  },
] as const;

export const faqs = [
  {
    q: "What artwork should I send?",
    a: "Vector files (AI, EPS, SVG, or PDF) are the most reliable. A high-resolution PNG or JPG works if the edges are sharp. Include the intended size, garment or patch type, and any thread colors you already use.",
  },
  {
    q: "Which machine formats do you deliver?",
    a: "Common shop formats include DST, EMB, PES, EXP, and others on request. Tell us the machine brand and we will match the file type and color sequence to that setup.",
  },
  {
    q: "How long does a typical file take?",
    a: "Simple left-chest logos are often turned around within one to two business days. Caps, jacket backs, appliqué, and puff take longer because the pathing and density need more testing. Rush work is available when the queue allows — note the deadline on the quote form.",
  },
  {
    q: "Do you sew a physical sample before release?",
    a: "We provide a stitch preview for approval on every job. A sewn sample can be arranged when the fabric or stitch type is unusual, or when you want to see the file on the actual garment before a bulk run.",
  },
  {
    q: "What is the difference between a cheap file and a production file?",
    a: "A weak file often looks acceptable on screen and then bird-nests, gaps, or puckers on the garment. Production files control underlay, density, entry and exit points, and travel so the design registers and the shop is not stopping the machine to clear thread breaks.",
  },
  {
    q: "Can you digitize for caps and jackets from the same logo?",
    a: "Yes. Those placements need different sizing, stitch types, and sometimes simplified detail. We treat them as related files, not a single stretched design.",
  },
  {
    q: "What patch finishes and backings do you offer?",
    a: "Typical options include merrowed or laser-cut edges, iron-on, sew-on, and hook-and-loop backing. Chenille and woven patches are specified separately. We will confirm the finish against how the patch will be applied.",
  },
  {
    q: "Is there a minimum order for patches?",
    a: "Patch production is usually more economical in small batches than one-offs, but we quote from the quantity and size you send. Digitizing has no minimum — a single logo file is a normal job.",
  },
  {
    q: "How do revisions work?",
    a: "Proof revisions that stay within the original brief are part of the job. A new size, a different garment type, or a redesigned mark is a new file and is quoted as such.",
  },
  {
    q: "Do you keep files for reorders?",
    a: "Approved files are archived so repeat orders and extra colorways can be pulled without starting over. Tell us the original job reference when you reorder.",
  },
  {
    q: "Can you work from a low-quality image?",
    a: "Sometimes. If the mark is simple we can rebuild it. Complex crests or fine script may need a redraw or a better source file first. We will say so before you commit.",
  },
  {
    q: "How should I request a quote?",
    a: "Use the quote form, email, or WhatsApp. Include artwork, size, garment or patch type, quantity, and the date you need the files or finished patches.",
  },
] as const;

export const quoteServices = [
  "Embroidery digitizing",
  "Custom embroidered patches",
  "Logo digitizing",
  "Jacket-back patches",
  "Hat and cap embroidery files",
  "Appliqué digitizing",
  "3D puff embroidery",
  "Chenille patches",
  "Woven patches",
  "Vector artwork preparation",
  "Bulk / multi-SKU order",
  "Not sure — advise me",
] as const;

export const garmentTypes = [
  "Left-chest logo",
  "Polo / shirt",
  "Cap / hat",
  "Jacket back",
  "Sleeve or collar",
  "Uniform set",
  "Sports jersey",
  "Workwear",
  "Embroidered patch",
  "Chenille patch",
  "Woven label",
  "Other / multiple",
] as const;

export const contactMethods = ["Email", "WhatsApp", "Phone"] as const;
