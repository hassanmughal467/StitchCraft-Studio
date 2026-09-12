# Architecture

## Current stack (approved)

This repository is already a **Next.js 16 + TypeScript + Tailwind CSS** App Router site, deployed on Vercel and sourced from GitHub. The brief recommends WordPress + WooCommerce if starting from nothing. Because a working Next.js codebase and production deployment already exist, the brief’s exception applies: **keep the Next.js stack** and preserve every workflow, data, and acceptance requirement.

| Concern | Current implementation | Brief equivalent |
|---|---|---|
| Presentation | `src/app`, `src/components` | Child theme |
| Business logic | `src/lib`, `src/app/api` | Custom plugin |
| Commerce | Not implemented | WooCommerce |
| Quotes | `/contact` form + `POST /api/quote` (mock, Formspree, or Resend) | Quote records |
| Files | Client-side validation; no private object storage yet | Secure uploads |
| Auth / accounts | Not implemented | Customer accounts |
| Payments | Not implemented | Gateway (owner input pending) |
| Email | Optional Resend/Formspree env vars | Transactional templates |
| SEO | `sitemap.ts`, `robots.ts`, Open Graph, JSON-LD | Required technical SEO |

## Directory map

- `src/app` — routes, metadata, sitemap, robots, quote API
- `src/components` — layout, home, quote, portfolio, UI
- `src/lib` — site config, services, portfolio, quote validation
- `docs` — architecture, plan, owner inputs, data model, security, QA, handover
- `.env.example` — public and server integration placeholders only

## Buying routes

1. **Digitizing & Artwork** — embroidery digitizing, vector tracing, custom logo design  
2. **Custom Products** — patches, embroidered apparel, screen printing, hats/caps  

## What is deferred (Phase 2+)

Payments, proof approval, order conversion, customer file vault, role-based admin, malware scanning, and country-specific tax/shipping engines. These are specified in `DATA_MODEL.md` and `IMPLEMENTATION_PLAN.md` and must not be faked as live commerce.
