# Admin handover

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example`. Public values: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`. Quote delivery: `FORMSPREE_FORM_ID` or `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `QUOTE_INBOX_EMAIL`. Empty credentials return a mock success so the form can be tested.

## Content edits

- Studio identity: `src/lib/site.ts`
- Navigation: `src/lib/nav.ts`
- Services: `src/lib/services.ts`
- Portfolio samples: `src/lib/portfolio.ts`
- Client frames: `src/lib/clients.ts` (`clientName` + `image.src` only with permission)
- Photography: `src/lib/media.ts` (`PLACEHOLDER_IMAGE`)

## Quotes today

Submissions hit `POST /api/quote`. Staff receive email only after a provider is configured. Files are not stored in a private vault yet.

## Deploy

GitHub `main` is connected to the Vercel project `stitchcraft-studio`. Push to `main` for production.

## Common support tasks (once Phase 2 ships)

1. Open the quote record by reference  
2. Request missing information  
3. Issue a versioned quote  
4. Upload a proof version  
5. Confirm approval + payment before production  
6. Send tracking or a signed file download  

Until then, handle jobs by email/WhatsApp using the quote form payload.
