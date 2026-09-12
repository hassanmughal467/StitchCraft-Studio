import { NextResponse } from "next/server";
import { intakeLimits, isQuoteIntakeAvailable, processQuoteIntake } from "@/lib/server/quote-intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  const { available } = isQuoteIntakeAvailable();
  return NextResponse.json({ available }, { headers: noStore });
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > intakeLimits.maxUploadBytes + 64 * 1024) {
    return NextResponse.json({ ok: false, message: "The upload is too large." }, { status: 413, headers: noStore });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "The request could not be read. Please try again." }, { status: 400, headers: noStore });
  }
  try {
    const result = await processQuoteIntake({ form, headers: request.headers });
    const headers: Record<string, string> = { ...noStore };
    if (result.status === 429 && "retryAfterSeconds" in result.body && result.body.retryAfterSeconds) {
      headers["Retry-After"] = String(result.body.retryAfterSeconds);
    }
    return NextResponse.json(result.body, { status: result.status, headers });
  } catch (error) {
    console.error("[quote] unexpected failure", error);
    return NextResponse.json({ ok: false, message: "Something went wrong. Nothing was submitted; please try again." }, { status: 500, headers: noStore });
  }
}
