# Implementation plan: production upgrade (2026-09-14)

Supersedes the 2026-09-12 plan. Baseline commit `06d7e7b`. Baseline checks before editing: typecheck pass, lint pass, 20/20 unit tests pass.

## 1. Existing architecture (audited)

| Concern | Found |
| --- | --- |
| Framework | Next.js 16.0.x App Router, React 19, TypeScript strict, Turbopack dev |
| Styling | Tailwind v4 via `@tailwindcss/postcss`; tokens in `src/app/globals.css` (`--color-warm`, `charcoal`, `blue`, `copper`, `copper-dark`, `copper-soft`, `card`, `line`, `stone`, `error`, `success`); Manrope through `next/font` |
| Routing | 36 static routes; `/quote` and `/api/quote` dynamic; `/portfolio/[slug]` static params |
| Shared components | `ui/Button`, `ui/Container`, `ui/SectionHeading`, `sections/PageHero`, `sections/CtaBand`, `services/ServicePage` (template for 7 services), `layout/Header` (details-based menus), `layout/Footer`, `seo/JsonLd`, SVG illustration components |
| Business config | `src/lib/site.ts` (env-driven contact channels, validated; placeholders resolve to `null`), `src/lib/env.ts` (production indexing opt-in via `NEXT_PUBLIC_SITE_ENV` + `NEXT_PUBLIC_SITE_URL`), `src/lib/services.ts` (service content) |
| Quote form | `components/quote/QuoteForm.tsx` client component, 2 steps, XHR multipart POST to `/api/quote`, single file, 6-country select, free-text quantity/size, single "date needed" |
| Quote API | `lib/server/quote-intake.ts` (validation, honeypot, in-memory rate limit, magic-byte checks, idempotency by `submissionId`, save-then-notify), `quote-store.ts` (`QuoteStore` interface, `FileQuoteStore` only), `notify.ts` (Resend via fetch, plain-text), `file-check.ts`, `rate-limit.ts` |
| Why the live site says "unavailable" | `resolveQuoteStore()` returns `null` when `QUOTE_STORE` is unset. Vercel has no persistent disk, so the file store cannot be used there and no production adapter exists. The API returns 503 and the form renders the unavailable notice with the controls still visible. No contact channels are set in the Vercel environment either, so there is no fallback route. |
| Portfolio | Typed model + empty array; list/detail pages and previews hide while empty; no filters by URL, no lightbox, no prev/next |
| SEO | `pageMetadata()` emits canonical/robots only for the confirmed production origin; preview = `noindex` meta + `X-Robots-Tag` + robots disallow + empty sitemap; OG image route; Organization/Service/Breadcrumb/FAQ/Article JSON-LD |
| Security headers | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`; no CSP, no HSTS |
| Analytics | Consent-gated `dataLayer` sink; 6 event types; no provider |
| Tests | Vitest, 3 files (workflow, intake, env indexing); no E2E |
| Deployment | Vercel project `stitchcraft-studio` (hobby). Vercel serverless request bodies are capped at 4.5 MB, so the current 15 MB multipart upload cannot work there. |

## 2. Files/components to change

- `src/lib/quote.ts`: new payload schema (structured country, deadline mode, deadline date, previous reference, portfolio ref, per-service fields, repeatable variant/size rows as JSON, multiple files), limits, validation.
- `src/components/quote/QuoteForm.tsx`: rebuilt on the new schema (country selector, file list with progress and removal, numeric fields, deadline modes, service-specific sections, offline state, a11y behaviour).
- `src/app/quote/page.tsx`, `src/app/contact/page.tsx`: offline mode before the form; contact page independent from the quote system.
- `src/lib/server/quote-intake.ts`, `quote-store.ts`, `notify.ts`, `file-check.ts`, `rate-limit.ts`: multi-file, store adapters, notification content, redacted logging.
- `src/lib/services.ts`, `src/components/services/ServicePage.tsx`, `ServiceCard.tsx`, `CtaBand.tsx`, `Header.tsx`, homepage: CTA copy, commercial block, featured work placement, banner slot.
- `src/lib/portfolio.ts`, `components/portfolio/*`, `app/portfolio/*`: extended model, filters, lightbox, prev/next, quote prefill.
- `src/lib/seo.ts`, `sitemap.ts`, `robots.ts`, `next.config.ts`: CSP, HSTS, 404 metadata, portfolio filter canonical.
- `src/lib/analytics.ts`: event schema per Phase 12.
- `src/lib/nav.ts`: unchanged behaviour (Portfolio link only when published).
- Docs: `.env.example`, `docs/*`.

## 3. New modules

- `src/lib/config/business.ts`: central business-controlled values (contact, response statement, availability, location, intake mode + offline fallback, commercial facts per service, artwork-rights wording). Everything unknown is `null`/empty and never rendered.
- `src/lib/config/limits.ts`: quantity/dimension/file limits.
- `src/lib/config/offers.ts`: announcement banner campaigns (all disabled by default).
- `src/lib/countries.ts`: ISO 3166-1 list.
- `src/lib/server/stores/{memory,file,vercel-blob}.ts` + `quote-store.ts` resolver: `QUOTE_STORE=memory|file|vercel-blob`.
- `src/lib/server/mailer.ts`: `resend` (HTTP) and `log` (development) providers; `notify.ts` builds messages.
- `src/lib/server/artwork-links.ts`: HMAC-signed expiring links; `src/app/api/quote/artwork/route.ts` streams private files to holders of a valid link.
- `src/app/api/quote/upload/route.ts`: `handleUpload` token endpoint for direct-to-Blob client uploads (used when `QUOTE_STORE=vercel-blob`, because of Vercel's 4.5 MB body limit). The intake verifies each uploaded blob (prefix, size, signature bytes) before accepting the submission.
- `src/lib/server/log.ts`: structured, redacting logger.
- `src/components/layout/AnnouncementBanner.tsx`, `src/components/portfolio/Lightbox.tsx`, `src/components/quote/FileList.tsx`, `CountrySelect.tsx`, `RowsEditor.tsx`.
- `src/proxy.ts`: not used for CSP (nonce CSP would force dynamic rendering of every page); CSP is a static header in `next.config.ts` and the trade-off is documented.
- Tests: `src/lib/__tests__/*.test.ts` for validation, reference, preselection, country, deadline, offers, SEO URLs, stores, intake integration; `e2e/*.spec.ts` (Playwright) for the seven services, navigation, 404, portfolio prefill.

## 4. Environment variables

See `.env.example` and `docs/ENVIRONMENT.md`. New: `QUOTE_STORE=vercel-blob`, `BLOB_READ_WRITE_TOKEN`, `QUOTE_INTAKE_MODE`, `QUOTE_OFFLINE_MESSAGE`, `QUOTE_RESPONSE_STATEMENT`, `QUOTE_ARTWORK_LINK_SECRET`, `QUOTE_ARTWORK_LINK_TTL_HOURS`, `EMAIL_PROVIDER`, `NEXT_PUBLIC_RESPONSE_HOURS`, `NEXT_PUBLIC_SERVICE_AVAILABILITY`, `TURNSTILE_SECRET_KEY`/`NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional, off by default), `QUOTE_IP_SALT`.

## 5. Risks and missing business information

- No production credentials are available in this environment: Blob, Resend and the production domain cannot be exercised end-to-end here. The adapters are unit-tested with injected fakes; the file/memory stores are exercised for real.
- Contact channels, response hours, availability, prices, minimums, turnaround, rush, revision counts, proof types, shipping/customs statements: unknown. They remain `null` and hidden. `docs/OWNER_INPUTS_REQUIRED.md` lists them.
- Portfolio: no approved assets. The model is complete; the list stays empty and the empty state is honest.
- Offer banners: prepared, disabled; discounts and pricing statements need approved values.
- Legal pages: reviewed for claims; wording is not rewritten as fact. `docs/OPERATIONAL_CLAIMS.md` lists every operational claim needing owner confirmation.
- Cross-browser: only Chromium is available here. Other browsers are listed as not tested.
