# Upgrade Plan and Status

Source: `Stitchcraft_Studio_Cursor_Upgrade_Prompt.md` (owner-supplied). This file records what was found in the baseline, what changed per phase, and the status of every requirement. Statuses: **tested** (implemented and verified), **unverified** (implemented, not fully verified in a realistic environment), **blocked** (needs owner input, credentials or a decision).

Baseline commit: `7e2280a` on `cursor/website-build-brief`. Baseline screenshots: `docs/screenshots/before/`. After screenshots: `docs/screenshots/after/` (captured from a production build, `next build` + `next start`, on 2026-09-12).

## Phase 1: Inspection and baseline

Stack kept: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, `next/font` (Manrope). Vitest added for unit tests.

Baseline problems found:

| Issue | Where | Fix |
| --- | --- | --- |
| Placeholder contact details rendered publicly (`quotes@example.com`, `+1 555 014 8820`, bare `wa.me`) | `src/lib/site.ts`, Footer, Contact, WhatsApp button, Organization JSON-LD | Contact channels are now env-driven and validated; placeholder or unset values resolve to `null` and every dependent UI element hides |
| Client and portfolio boards with unapproved names / stock images | `src/lib/clients.ts`, `src/lib/media.ts`, `ClientBoard`, `PortfolioPreview`, homepage | Removed. Portfolio content model requires `published` + permission + a real result image; all portfolio UI hides while the list is empty |
| Indexing on for every deployment; canonical pointed at an unconfirmed `.vercel.app` URL | `layout.tsx`, `seo.ts`, `robots.ts`, `sitemap.ts` | Indexing is opt-in (`NEXT_PUBLIC_SITE_ENV=production` and `NEXT_PUBLIC_SITE_URL`). Preview: `noindex` meta, `X-Robots-Tag`, robots disallow, empty sitemap, no canonical |
| Quote API simulated success (no persistence, no idempotency, no file validation) | `api/quote/route.ts` | Real intake pipeline (see Phase 5); returns 503 and the form shows an unavailable state when no store is configured |
| Account link in navigation with no working account | `nav.ts`, `/account` | Link removed; route deleted so `/account` is a true 404 |
| Newsletter block with no provider | Footer | Removed |
| Generic homepage hero, no service-specific visuals, unapproved stock photography | Homepage, service pages | New hero and service pages with original SVG illustrations (labelled as illustrations) |
| Root `loading.tsx` streamed a shell for the dynamic quote page (layout shift) and defeated 404 status codes | `src/app/loading.tsx` | Removed; the only dynamic page renders server-side in milliseconds |

## Phase 2: Trust and integrity — tested

- Env-driven contact channels (`CONTACT_EMAIL`, `CONTACT_PHONE`, `WHATSAPP_NUMBER`, socials) with validation in `src/lib/site.ts`.
- No "CLIENT_SLOT", "pending owner approval", TODO or placeholder language in rendered pages (checked with a source grep and the browser sweep).
- Preview builds are non-indexable: verified `X-Robots-Tag: noindex, nofollow, noarchive`, `<meta name="robots" content="noindex, nofollow, nocache">`, `robots.txt` disallow all, empty `sitemap.xml`, no canonical. Production behaviour verified by unit test (`src/lib/__tests__/env-indexing.test.ts`).
- `metadataBase` is the confirmed URL, else the Vercel URL, else localhost. No hard-coded domain.

## Phase 3: Design system, homepage, service pages — tested

- Tokens in `globals.css`: warm `#F7F5EF`, charcoal `#20252B`, blue `#174A66`, copper `#C97744` (graphics) / `#A45E32` (text, AA on warm and white) / `#E6B896` (text on blue/charcoal), card, line, error, success. Container 1200px.
- Homepage: hero with illustrated artwork-to-stitch composition, "files or finished products" routes, 7 service cards, artwork-to-stitch section, 4-step process, trade section, buying answers with FAQ JSON-LD, guides, CTA band.
- Service page template (`ServiceView`): breadcrumb, H1 per the prompt, who it is for, deliverables, what to send, specs, price factors, process, turnaround, revisions, FAQ (JSON-LD), related services, CTA to `/quote?service=<id>`.
- Homepage title: "Embroidery Digitizing & Custom Patches | Stitchcraft Studio".

## Phase 4: Portfolio, trade, guides — tested (portfolio hidden)

- `src/lib/portfolio.ts`: typed content model with publishing rules; `/portfolio` shows an honest "shared on request" page (noindex) while empty; `/portfolio/[slug]` ready for future items.
- Trade page rewritten (no invented pricing, tiers or client names).
- Guides: 4 articles under `/resources` with Article JSON-LD, including "Vector vs. digitizing".
- About and FAQ rewritten with truthful location statement.

## Phase 5: Quote, accounts, orders

| Item | Status |
| --- | --- |
| Persistent quote store (`QUOTE_STORE=file`, `.data/quotes`) with reference `SC-YYMMDD-XXXX` | tested locally (file store) |
| Idempotency via client `submissionId`; duplicate returns original reference with `duplicate: true` | tested (API + unit) |
| Field validation, honeypot, rate limit (6 / 10 min per IP), 15 MB cap, magic-byte file checks, scripted-SVG rejection | tested (API + unit) |
| Notifications via Resend to staff and customer, recorded separately; failure never asks the customer to resubmit | unverified (no API key; code path unit-tested with a fake mailer) |
| Two-step form, service-specific fields, `?service=` and `?customer=` prefill, error summary with anchors, live error clearing, XHR upload progress | tested in browser (steps 1–2, validation); final "Send" button was exercised through the same API from a script, not by clicking in the browser |
| Honest unavailable state when no store is configured (503, no simulated success) | tested (unit) |
| Order / proof / payment domain rules (`src/lib/workflow`) | unit-tested, not wired to storage, auth or payments |
| Customer accounts, order history, proof approval UI, payments | blocked (see OWNER_INPUTS_REQUIRED) |

## Phase 6: Verification — tested

See `docs/QA_REPORT.md` for the full matrix. Summary: typecheck, lint and 20 unit tests pass; production build passes; 12 routes × 6 widths (320–1440) with no horizontal overflow, one H1 each and zero console errors; keyboard behaviour for menus verified; Lighthouse on the production build: performance 97–100, accessibility 100, best practices 100, CLS 0; SEO 63 only because preview builds are intentionally non-crawlable.

## Phase 7: Handover — done

`docs/OWNER_INPUTS_REQUIRED.md`, `docs/ASSETS_REQUIRED.md`, `docs/QA_REPORT.md`, `docs/ADMIN_HANDOVER.md`, this file.

## Not done, and why

- No production deployment, DNS change or paid service was made (not authorised).
- No durable production quote store or email provider is connected (credentials/decision needed).
- No photography, client logos or testimonials were added (none approved).
- Prices, minimums, turnaround guarantees and legal entity details are not published (not supplied).
