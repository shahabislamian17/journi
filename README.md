# Journi — Next.js conversion

This project is a Next.js (Pages Router) conversion of the provided PHP templates **without changing CSS/JS files**.

## Run locally

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Notes

- All original static assets are kept under `public/assets/` and referenced with the same paths.
- PHP template partials were compiled into static HTML under `templates/` and rendered via `dangerouslySetInnerHTML` to preserve markup.
- Routes match the old structure:
  - `/` (from `index.php`)
  - `/wishlist`
  - `/resources/contact`, `/resources/faqs`
  - `/checkout`, `/checkout/confirmation`
  - `/ibiza/sightseeing`, `/ibiza/sightseeing/experience`
  - `/account/*`
- Redirects from `*.php` URLs are configured in `next.config.js`.

### Backend/PHP

Any PHP backend endpoints (e.g. Stripe `/inc/classes/...`) are included under `legacy/` for reference but are **not executed** by Next.js.
# journi
