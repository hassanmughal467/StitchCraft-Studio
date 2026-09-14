# Accessibility — automated checks and remaining manual tests

Target: WCAG 2.2 AA. Automated passes are not a compliance claim.

## Automated

- Component markup: visible labels, `aria-required` / required, `aria-describedby` on errors, error-summary links, step-heading focus, live regions on the quote form.
- Skip link, landmarks (`header`, `main`, `footer`, announcement `region`).
- Focus styles in `globals.css` (`:focus-visible`).
- `prefers-reduced-motion` disables animation and smooth scrolling.
- Mobile menu: `aria-expanded`, Escape closes and returns focus to the trigger.
- Lightbox: `role="dialog"`, focus trap, Escape, previous/next.

Run: `npm run lint` and the production Lighthouse accessibility category on a built site.

## Manual tests still required

These cannot be signed off from this environment alone.

1. Screen reader pass (NVDA + Chrome, VoiceOver + Safari) on Home, one digital service, one physical service, Quote (both steps + error + success), Contact, 404.
2. Keyboard-only: tab order, menus, quote form, lightbox (when projects exist), skip link.
3. Zoom 200% and 400% on Home, Quote, a service page.
4. Mobile keyboard does not cover quote fields (iOS Safari, Android Chrome).
5. Colour contrast of banner (when an offer is enabled) and error text.
6. Touch targets ≥ 24×24 CSS px on 320–430 px widths.
7. No keyboard trap in desktop `<details>` menus.
8. Announce menu open/closed with a screen reader.

Do not add an “accessible” badge or WCAG conformance statement until the manual list is completed.
