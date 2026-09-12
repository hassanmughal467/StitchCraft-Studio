/**
 * Content sniffing for uploaded artwork. Extension alone is not trusted.
 * Returns a normalized kind or an error message. Never executes or renders
 * the content; SVG is treated as text and rejected if it carries scripts.
 */

export type FileCheck = { ok: true; kind: string } | { ok: false; reason: string };

const textDecoder = new TextDecoder("utf-8", { fatal: false });

function startsWith(bytes: Uint8Array, sig: number[], offset = 0) {
  return sig.every((b, i) => bytes[offset + i] === b);
}

function asciiPrefix(bytes: Uint8Array, length = 512) {
  return textDecoder.decode(bytes.subarray(0, length));
}

export function checkArtworkBytes(name: string, bytes: Uint8Array): FileCheck {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (bytes.length === 0) return { ok: false, reason: "The file is empty." };
  const head = asciiPrefix(bytes);
  const looksHtml = /<\s*(script|html|iframe|object|embed)\b/i.test(head);

  switch (ext) {
    case "png":
      return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) ? { ok: true, kind: "image/png" } : bad("PNG");
    case "jpg":
    case "jpeg":
      return startsWith(bytes, [0xff, 0xd8, 0xff]) ? { ok: true, kind: "image/jpeg" } : bad("JPEG");
    case "webp":
      return startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8) ? { ok: true, kind: "image/webp" } : bad("WEBP");
    case "pdf":
      return startsWith(bytes, [0x25, 0x50, 0x44, 0x46]) ? { ok: true, kind: "application/pdf" } : bad("PDF");
    case "ai":
      // Modern .ai files are PDF-based; legacy ones are PostScript.
      if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46]) || startsWith(bytes, [0x25, 0x21, 0x50, 0x53])) return { ok: true, kind: "application/postscript" };
      return bad("Illustrator");
    case "eps":
      if (startsWith(bytes, [0x25, 0x21, 0x50, 0x53]) || startsWith(bytes, [0xc5, 0xd0, 0xd3, 0xc6])) return { ok: true, kind: "application/postscript" };
      return bad("EPS");
    case "svg": {
      if (looksHtml || /on\w+\s*=|javascript:|<foreignObject/i.test(asciiPrefix(bytes, Math.min(bytes.length, 200_000)))) {
        return { ok: false, reason: "SVG files with scripts or event handlers are not accepted. Export a plain SVG." };
      }
      return /^\s*(<\?xml|<svg|<!--|<!DOCTYPE svg)/i.test(head) ? { ok: true, kind: "image/svg+xml" } : bad("SVG");
    }
    case "dst":
      // Tajima DST header begins with "LA:" label.
      return head.startsWith("LA:") ? { ok: true, kind: "application/x-dst" } : bad("DST");
    case "pes":
      return head.startsWith("#PES") ? { ok: true, kind: "application/x-pes" } : bad("PES");
    case "emb":
    case "exp":
    case "jef":
    case "ofm":
    case "pxf":
      // No reliable public signature; reject anything that looks like markup/script.
      if (looksHtml || head.trimStart().startsWith("<")) return { ok: false, reason: "That file does not look like an embroidery file." };
      return { ok: true, kind: `application/x-${ext}` };
    default:
      return { ok: false, reason: "That file type is not accepted." };
  }
}

function bad(label: string): FileCheck {
  return { ok: false, reason: `That file is not a valid ${label} file. Check the export and try again.` };
}
