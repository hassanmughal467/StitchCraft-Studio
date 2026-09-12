# Implementation plan

Maps the Stitchcraft Studio brief to this Next.js repository. Superseded in detail by `docs/UPGRADE_PLAN.md` (upgrade pass, 2026-09-12); kept as the route/module index.

## Phase 1 — Foundation

| Brief item | Module |
|---|---|
| Design tokens | `src/app/globals.css` |
| Typography (Manrope) | `src/app/layout.tsx` |
| Navigation (two routes) | `src/lib/nav.ts`, `src/components/layout/Header.tsx` |
| Environment / indexing switch | `src/lib/env.ts`, `next.config.ts` |
| Configurable owner fields | `src/lib/site.ts`, `.env.example`, `docs/OWNER_INPUTS_REQUIRED.md` |
| Service content type | `src/lib/services.ts` |
| Portfolio content type (hidden until populated) | `src/lib/portfolio.ts` |
| SEO / sitemap / robots / JSON-LD | `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` |

## Phase 2 — Ordering workflow

| Brief item | Module |
|---|---|
| Conditional quote form | `src/components/quote/QuoteForm.tsx`, `src/lib/quote.ts` |
| Quote intake (store, idempotency, rate limit, file checks, notifications) | `src/app/api/quote/route.ts`, `src/lib/server/*` |
| Quote → order → proof → payment rules | `src/lib/workflow/index.ts` (pure, unit-tested) |
| Status model | `docs/DATA_MODEL.md` |
| Accounts, proof approval UI, payments | Blocked on provider decisions; `/account` returns 404 until then |

## Phase 3 — Public content

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/digitizing-artwork` | Route 1 hub |
| `/embroidery-digitizing`, `/vector-tracing`, `/custom-logo-design` | Digital services |
| `/custom-products` | Route 2 hub |
| `/custom-patches`, `/embroidered-apparel`, `/screen-printing`, `/custom-hats` | Physical services |
| `/portfolio`, `/portfolio/[slug]` | Shown only when items are published with permission |
| `/trade` | Trade / wholesale |
| `/how-it-works` | Process |
| `/about` | Pakistan-based studio, no invented offices |
| `/resources` + 4 guides | Educational section |
| `/quote` | Request a quote (two steps) |
| `/contact` | Contact + quote |
| `/faq`, `/shipping`, `/artwork-guidelines`, `/file-formats` | Help |
| `/privacy`, `/terms`, `/refund-policy`, `/cookies`, `/accessibility` | Legal (need owner/legal review) |

Redirects (permanent): `/services` → `/digitizing-artwork`, `/industries` → `/trade`.

## Phase 4 — QA and launch

See `docs/QA_REPORT.md` and `docs/ADMIN_HANDOVER.md`. Launch is blocked on the items in `docs/OWNER_INPUTS_REQUIRED.md`.

## Explicitly not invented

Legal address, domain, trademark status, live prices, minimums, turnaround guarantees, shipping rates, tax rules, payment provider, staff roles, client names, and customer testimonials.
