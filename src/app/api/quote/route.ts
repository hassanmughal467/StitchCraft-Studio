import { NextResponse } from "next/server";
import { fileUpload, site } from "@/lib/site";
import { validateQuote, type QuotePayload } from "@/lib/quote";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const payload: QuotePayload = {
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      service: String(form.get("service") ?? ""),
      garment: String(form.get("garment") ?? ""),
      quantity: String(form.get("quantity") ?? ""),
      deadline: String(form.get("deadline") ?? ""),
      details: String(form.get("details") ?? ""),
      contactMethod: String(form.get("contactMethod") ?? ""),
      consent: form.get("consent") === "true" || form.get("consent") === "on",
    };

    const artwork = form.get("artwork");
    const file = artwork instanceof File && artwork.size > 0 ? artwork : null;

    if (file) {
      const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      if (!fileUpload.accept.includes(ext as (typeof fileUpload.accept)[number])) {
        return NextResponse.json(
          { ok: false, message: "Artwork file type is not accepted." },
          { status: 400 },
        );
      }
      if (file.size > fileUpload.maxSizeMb * 1024 * 1024) {
        return NextResponse.json(
          { ok: false, message: `Artwork must be ${fileUpload.maxSizeMb} MB or smaller.` },
          { status: 400 },
        );
      }
      payload.fileName = file.name;
      payload.fileType = file.type;
      payload.fileSize = file.size;
    }

    const errors = validateQuote(payload);
    if (Object.keys(errors).length) {
      return NextResponse.json(
        { ok: false, message: "Please correct the highlighted fields.", errors },
        { status: 400 },
      );
    }

    const formspreeId = process.env.FORMSPREE_FORM_ID;
    const resendKey = process.env.RESEND_API_KEY;

    if (formspreeId) {
      const forwarded = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== false) forwarded.append(key, String(value));
      });
      if (file) forwarded.append("artwork", file);
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: forwarded,
      });
      if (!response.ok) {
        return NextResponse.json(
          { ok: false, message: "The quote service could not accept this request. Try email or WhatsApp." },
          { status: 502 },
        );
      }
      return NextResponse.json({
        ok: true,
        message: "Quote request sent. We will reply with next steps.",
      });
    }

    if (resendKey) {
      const inbox = process.env.QUOTE_INBOX_EMAIL ?? site.email;
      const from = process.env.RESEND_FROM_EMAIL ?? site.email;
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [inbox],
          reply_to: payload.email,
          subject: `Quote request — ${payload.service} — ${payload.name}`,
          text: formatQuoteEmail(payload),
        }),
      });
      if (!response.ok) {
        return NextResponse.json(
          { ok: false, message: "Email delivery failed. Try again or use WhatsApp." },
          { status: 502 },
        );
      }
      return NextResponse.json({
        ok: true,
        message: "Quote request sent. We will reply with next steps.",
      });
    }

    // Mock success when no email provider is configured.
    return NextResponse.json({
      ok: true,
      mock: true,
      message:
        "Request received. Email delivery is not connected yet, so this is a test confirmation. Add FORMSPREE_FORM_ID or RESEND_API_KEY to send live quotes.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Something went wrong while sending the request. Please try again." },
      { status: 500 },
    );
  }
}

function formatQuoteEmail(payload: QuotePayload) {
  return [
    `Name: ${payload.name}`,
    `Company: ${payload.company || "—"}`,
    `Email: ${payload.email}`,
    `Phone / WhatsApp: ${payload.phone}`,
    `Service: ${payload.service}`,
    `Garment / patch: ${payload.garment}`,
    `Quantity: ${payload.quantity}`,
    `Deadline: ${payload.deadline}`,
    `Preferred contact: ${payload.contactMethod}`,
    `Artwork: ${payload.fileName ?? "Not attached"}`,
    "",
    "Details:",
    payload.details || "—",
  ].join("\n");
}
