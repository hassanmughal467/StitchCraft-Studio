# Implementation plan

Maps the Stitchcraft Studio brief to this Next.js repository.

## Phase 1 — Foundation (this pass)

| Brief item | Module |
|---|---|
| Design tokens | `src/app/globals.css` |
| Typography (Manrope) | `src/app/layout.tsx` |
| Navigation (two routes) | `src/lib/nav.ts`, `src/components/layout/Header.tsx` |
| Configurable owner fields | `src/lib/site.ts`, `docs/OWNER_INPUTS_REQUIRED.md` |
| Service content type | `src/lib/services.ts` |
| Portfolio content type | `src/lib/portfolio.ts`, `src/lib/clients.ts` |
| SEO / sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts` |

## Phase 2 — Ordering workflow (structured, not live commerce)

| Brief item | Module |
|---|---|
| Conditional quote form | `src/components/quote/QuoteForm.tsx`, `src/lib/quote.ts` |
| Quote API integration point | `src/app/api/quote/route.ts` |
| Status model | `docs/DATA_MODEL.md` |
| Account / proof / tracking UI shells | `/account` and related utility pages (no payment) |
| Payments / Woo conversion | Deferred until owner names the gateway |

## Phase 3 — Public content (this pass)

| Route | Purpose |
|---|---|
| `/` | Homepage per brief §6 |
| `/digitizing-artwork` | Route 1 hub |
| `/embroidery-digitizing` | Service |
| `/vector-tracing` | Service |
| `/custom-logo-design` | Service |
| `/custom-products` | Route 2 hub |
| `/custom-patches` | Service |
| `/embroidered-apparel` | Service |
| `/screen-printing` | Service |
| `/custom-hats` | Service |
| `/portfolio` | Filterable proof + client slots |
| `/trade` | B2B / trade account |
| `/how-it-works` | Five-step process |
| `/about` | Pakistan-based studio, no fake offices |
| `/resources` + 3 guides | Educational section |
| `/quote` | Request a quote |
| `/contact` | Contact + quote |
| `/account` | Dashboard placeholder |
| `/faq`, `/shipping`, `/artwork-guidelines`, `/file-formats` | Help |
| `/privacy`, `/terms`, `/refund-policy`, `/cookies`, `/accessibility` | Legal |

Redirects: `/services` → `/digitizing-artwork`, `/industries` → `/trade`.

## Phase 4 — QA and launch

See `docs/QA_REPORT.md`. Production checkout is blocked on owner payment, tax, and shipping inputs.

## Explicitly not invented

Legal address, domain, trademark status, live prices, shipping rates, tax rules, payment provider, staff roles, and customer testimonials.
