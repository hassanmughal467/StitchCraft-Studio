import { NextResponse } from "next/server";
import { getIntakeStatus, publicIntakeConfig } from "@/lib/server/intake-config";
import { log } from "@/lib/server/log";
import { intakeLimits, processQuoteIntake } from "@/lib/server/quote-intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** Public intake status (no secrets, no reasons). */
export async function GET() {
  return NextResponse.json(publicIntakeConfig(getIntakeStatus()), { headers: noStore });
}

export async function POST(request: Request) {
  // Same-origin check: browsers always send Origin for cross-site POSTs; reject mismatches.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, message: "Cross-site submissions are not accepted." }, { status: 403, headers: noStore });
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > intakeLimits.maxRequestBytes) {
    return NextResponse.json({ ok: false, message: "The upload is too large. Remove a file and try again.", errors: { artwork: "The files together are too large." } }, { status: 413, headers: noStore });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "The request could not be read. Please try again.", retryable: true }, { status: 400, headers: noStore });
  }
  try {
    const result = await processQuoteIntake({ form, headers: request.headers });
    const headers: Record<string, string> = { ...noStore };
    if (result.status === 429 && !result.body.ok && result.body.retryAfterSeconds) {
      headers["Retry-After"] = String(result.body.retryAfterSeconds);
    }
    return NextResponse.json(result.body, { status: result.status, headers });
  } catch (error) {
    log.error("quote.route.unexpected", error);
    return NextResponse.json({ ok: false, message: "Something went wrong on our side. Nothing was submitted; please try again.", retryable: true }, { status: 500, headers: noStore });
  }
}
