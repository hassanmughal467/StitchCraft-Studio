import { NextResponse } from "next/server";
import { verifyArtworkLink } from "@/lib/server/artwork-links";
import { log } from "@/lib/server/log";
import { resolveQuoteStore } from "@/lib/server/quote-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Streams private artwork to holders of a valid, unexpired signed link.
 * Files are always served as downloads with a fixed, non-executable content type
 * so that SVG or HTML-like content can never render in the browser.
 */
export async function GET(request: Request) {
  const check = verifyArtworkLink(new URL(request.url).searchParams);
  if (!check.ok) {
    const message = check.status === 410 ? "This link has expired. Ask for a fresh link from the quote record." : check.status === 503 ? "Artwork links are not enabled." : "This link is not valid.";
    return new NextResponse(message, { status: check.status, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } });
  }
  const { store } = resolveQuoteStore();
  if (!store) return new NextResponse("Storage unavailable.", { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const artwork = await store.openArtwork(check.reference, check.storedName);
    if (!artwork) return new NextResponse("Not found.", { status: 404, headers: { "Cache-Control": "no-store" } });
    const safeType = artwork.contentType === "image/svg+xml" || !/^(image\/(png|jpeg|webp)|application\/pdf)$/.test(artwork.contentType) ? "application/octet-stream" : artwork.contentType;
    return new NextResponse(artwork.stream, {
      status: 200,
      headers: {
        "Content-Type": safeType,
        "Content-Length": String(artwork.size),
        "Content-Disposition": `attachment; filename="${check.storedName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    log.error("quote.artwork.read_failed", error, { reference: check.reference });
    return new NextResponse("Could not read the file.", { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
