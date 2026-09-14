# Implementation plan: production upgrade (2026-09-14)

Baseline: Next.js 16 App Router, React 19, Tailwind v4, Vitest. Quote intake (Phases 1–2) is already implemented in this tree. This plan records the audited architecture and the remaining work completed in this pass.

## 1. Existing architecture (audited)

| Concern | Found |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript strict, Turbopack |
| Styling | Tailwind v4; tokens in `src/app/globals.css` (warm, charcoal, blue, copper) |
| Routing | App Router; `/quote` and `/api/quote*` dynamic; `/portfolio/[slug]` static |
| Business config | `src/lib/site.ts` (env-driven contact), `src/lib/env.ts` (indexing opt-in), `src/lib/services.ts` |
| Quote form | Two-step client form (`QuoteForm` + `QuoteIntake`), service-specific fields, multi-file upload |
| Quote API | `processQuoteIntake`: honeypot, optional Turnstile, rate limit, magic-byte checks, idempotency, save-then-notify |
| Stores | `QUOTE_STORE=memory\|file\|vercel-blob`. Unset or invalid → honest offline (503), never fake success |
| Email | Resend or development `log` mailer; notifications after persist |
| Portfolio | Typed model; empty published list; nav/homepage hide while empty |
| SEO | Production indexing only when `NEXT_PUBLIC_SITE_ENV=production` and `NEXT_PUBLIC_SITE_URL` are set |
| Tests | Vitest unit/integration; Playwright e2e added in this pass |

## 2. Files/components changed in this pass

- Config: `src/lib/config/business.ts`, `src/lib/config/offers.ts`, `src/lib/copy.ts`
- Quote: screen-print ink colours; contact location gating
- Portfolio: full content model, lightbox, prev/next, related services, quote prefill
- Homepage: featured work after services
- Service pages: config-driven commercial facts; CTA copy; fulfilment notes
- Banner: `AnnouncementBanner` (campaigns prepared, all disabled)
- SEO/security: production-only social URLs, CSP, HSTS
- Analytics: service/portfolio/banner events
- Docs: environment, operational claims, accessibility manual tests, launch checklist

## 3. New modules

- `src/lib/config/business.ts` — commercial facts (all `null` until owner-approved)
- `src/lib/config/offers.ts` — announcement campaigns (`enabled: false`)
- `src/lib/copy.ts` — service CTA wording
- `src/components/layout/AnnouncementBanner.tsx`
- `src/components/portfolio/Lightbox.tsx`
- `src/components/analytics/ViewTracker.tsx`
- `src/components/services/CommercialFacts.tsx`

## 4. Environment variables

See `.env.example` and `docs/ENVIRONMENT.md`.

## 5. Risks and missing business information

- No production Blob/Resend credentials in this environment. Adapters are tested; live Vercel intake stays offline until `QUOTE_STORE=vercel-blob` (or another durable store) and mail env are set.
- Contact channels, prices, minimums, turnaround numbers, rush, revisions counts, proof types, shipping/customs: remain `null` and hidden.
- Portfolio: no approved assets. Model is complete; public list stays empty.
- Offers: prepared, not published. Any discount requires an approved config value.
- Cross-browser: Chromium is exercised here; Safari/Firefox/iOS/Android are listed as untested unless actually run.
