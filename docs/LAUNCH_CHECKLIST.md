# Production launch checklist

Do not index the site until the items marked **blocker** are done.

## Infrastructure (blocker)

- [ ] Confirmed production domain set as `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SITE_ENV=production` on that deployment only
- [ ] `QUOTE_STORE=vercel-blob` (or another durable adapter) and `BLOB_READ_WRITE_TOKEN`
- [ ] `QUOTE_ARTWORK_LINK_SECRET` set
- [ ] Resend: `RESEND_API_KEY`, verified `RESEND_FROM_EMAIL`, `QUOTE_INBOX_EMAIL`
- [ ] At least one public contact channel (`NEXT_PUBLIC_CONTACT_EMAIL` and/or WhatsApp/phone)
- [ ] Preview deployments keep SITE_ENV unset (stay `noindex`)

## After deploy — smoke

1. Homepage loads.
2. Navigation works; Escape closes menus.
3. All seven service pages load.
4. Quote form submits and returns a reference.
5. Staff notification arrives.
6. Customer confirmation arrives.
7. Artwork URL is not public without a signed link.
8. Configured contact methods work.
9. Portfolio empty state (or filters, if published).
10. `sitemap.xml` uses the production domain.
11. Canonicals use the production domain.
12. Preview URLs remain noindex.
13. Unknown path returns HTTP 404.
14. No serious console errors.
15. Analytics (if enabled) records a test event without personal data.

## Owner content (not blockers for code, blockers for promotion)

- [ ] Legal name, address decision, hours
- [ ] Commercial facts in `src/lib/config/business.ts` if any price/minimum is to be shown
- [ ] Portfolio assets + written permission
- [ ] Offer campaigns: enable only after quote + contact work
- [ ] Legal page review
