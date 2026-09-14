import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { fileLimits, isAcceptedExtension } from "@/lib/config/limits";
import { log } from "@/lib/server/log";
import { resolveQuoteStore } from "@/lib/server/quote-store";
import { clientKey, createRateLimiter } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Issues short-lived client-upload tokens for direct-to-storage artwork uploads.
 * Only active when the configured store supports direct uploads (Vercel Blob).
 * Each token is bound to one pathname under uploads/<submissionId>/ and capped in size.
 * The upload is verified again (signature bytes, size) when the quote is submitted.
 */
const limiter = createRateLimiter({ limit: 30, windowMs: 10 * 60 * 1000 });
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const safeName = /^[a-z0-9][a-z0-9._-]{0,80}$/;

export async function POST(request: Request) {
  const { store } = resolveQuoteStore();
  if (!store?.direct) {
    return NextResponse.json({ error: "Direct uploads are not enabled." }, { status: 404 });
  }
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Cross-site uploads are not accepted." }, { status: 403 });
  }
  if (!limiter.check(clientKey(request.headers)).allowed) {
    return NextResponse.json({ error: "Too many upload attempts. Please wait a few minutes." }, { status: 429 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const submissionId = String(clientPayload ?? "");
        if (!uuidPattern.test(submissionId)) throw new Error("Invalid submission id");
        const prefix = store.direct!.prefixFor(submissionId);
        if (!pathname.startsWith(prefix)) throw new Error("Pathname outside the allowed prefix");
        const name = pathname.slice(prefix.length);
        if (!safeName.test(name) || !isAcceptedExtension(name)) throw new Error("File name or type not accepted");
        return {
          maximumSizeInBytes: fileLimits.maxSizeBytes,
          addRandomSuffix: true,
          allowOverwrite: false,
          validUntil: Date.now() + 15 * 60 * 1000,
          tokenPayload: submissionId,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do: the quote submission verifies and links the upload.
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    log.warn("quote.upload.rejected", { message: error instanceof Error ? error.message.slice(0, 120) : "unknown" });
    return NextResponse.json({ error: "Upload not accepted." }, { status: 400 });
  }
}
