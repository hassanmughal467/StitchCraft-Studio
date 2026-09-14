/**
 * Structured limits for the quote form. Shared by client and server validation.
 * Upper limits are deliberately generous; they exist to reject nonsense, not to
 * cap real orders. Change them here, not in the form.
 */
export const quantityLimits = {
  min: 1,
  /** Largest single quantity accepted through the website form. */
  max: 100_000,
} as const;

export const dimensionLimits = {
  /** Smallest dimension in either unit. */
  min: 0.1,
  /** Largest finished width/height per unit. */
  max: { in: 60, mm: 1500 },
  decimals: 2,
} as const;

export const countLimits = {
  /** Number of designs / colours / variants entered as a plain integer. */
  min: 1,
  max: 500,
} as const;

export const rowLimits = {
  /** Repeatable size-breakdown or variant rows. */
  maxRows: 24,
  labelLength: 60,
} as const;

export const fileLimits = {
  maxFiles: 6,
  maxSizeMb: 15,
  maxSizeBytes: 15 * 1024 * 1024,
  /** Combined size of all files in one request. */
  maxTotalBytes: 40 * 1024 * 1024,
  accept: [".ai", ".eps", ".pdf", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".dst", ".emb", ".pes", ".exp", ".jef", ".ofm", ".pxf"] as const,
  acceptLabel: "AI, EPS, PDF, SVG, PNG, JPG, WEBP, DST, EMB, PES, EXP, JEF, OFM or PXF. Up to 6 files, 15 MB each.",
  /** MIME types we advertise in `accept`. Embroidery formats have no registered type and fall back to extension matching. */
  acceptMime: ["application/pdf", "application/postscript", "image/svg+xml", "image/png", "image/jpeg", "image/webp"] as const,
};

export type AcceptedExtension = (typeof fileLimits.accept)[number];

export function extensionOf(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx).toLowerCase();
}

export function isAcceptedExtension(name: string) {
  return (fileLimits.accept as readonly string[]).includes(extensionOf(name));
}

export function acceptAttribute() {
  return [...fileLimits.accept, ...fileLimits.acceptMime].join(",");
}
