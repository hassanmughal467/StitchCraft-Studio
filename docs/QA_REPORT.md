# QA report

Updated as the public Next.js pass is implemented.

## Covered in this pass

- Homepage follows brief §6 section order
- Two buying routes and seven service pages exist
- Quote form is multi-step and service-conditional
- Digitizing quote submitted locally; mock confirmation returned
- `/quote?service=` preselects the service
- Portfolio has client slots without invented names
- Legal and help pages exist as drafts
- Keyboard-visible focus styles and labeled form fields
- Desktop header groups How It Works / About / Resources under Studio
- Mobile menu groups the two buying routes and keeps Request a Quote visible

## Not yet testable (blocked on owner inputs or Phase 2)

1. Duplicate-submission protection against a durable store  
2. Tax, shipping, and currency totals  
3. Quote-to-order conversion  
4. Payment success / failure / refund webhooks  
5. Proof version audit  
6. Cross-customer file isolation  
7. Designer role vs finance data  
8. Transactional email templates with live references  
9. Backup restore  
10. Core Web Vitals on production after real photography is added  

## Open issues

- Contact, phone, WhatsApp, and address are placeholders  
- Photography is `PLACEHOLDER_IMAGE` until studio files arrive  
- Commerce, proofs, and private storage are not live  
- WordPress/WooCommerce was not adopted; see `ARCHITECTURE.md`
