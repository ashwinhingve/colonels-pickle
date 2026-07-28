# QA & Performance Report — Colonel's Pickle

_Covers the Phase 3 Wave 2 + Phase 4 build (commit `0383455`) and the Phase 4 perf pass._

## Method & environment note

Interactive browser automation (Playwright) could **not** be driven reliably in this
sandbox for two independent reasons:

1. **No external network in the sandboxed browser.** The site loads Google Fonts; with
   `fonts.googleapis.com` unreachable, the browser's page-load event never settles, so
   Playwright navigation times out at 60s on every route (even warmed ones).
2. **Remote-MongoDB latency.** Dynamic (`force-dynamic`) pages swing from ~5s to >90s per
   request under the dev server, making step-by-step UI automation non-deterministic.

QA was therefore performed against a running dev server via **rendered-HTML assertions and
HTTP/API probes** (routing, SSR content, SEO output, and access control), plus the
**`build` + `lint`** gates (type-checking every route/component). Purely visual checks
(pixel layout at breakpoints, Lighthouse scores) should be run once in a real browser —
see "Remaining manual checks".

## Functional QA results

| Area | Check | Result |
|---|---|---|
| Storefront | `/products` renders grid, ₹ prices, add-to-cart, "No Preservatives" badge | ✅ PASS |
| Storefront | `/cart` renders | ✅ PASS |
| Storefront | Home renders brand/heritage content | ✅ PASS (warm) |
| Storefront | Product detail (`/products/adrak-ka-achar`), `/checkout`, `/login` return 200 with expected content | ✅ PASS (warm) |
| SEO | `/robots.txt` → 200, disallows `/admin`, references sitemap | ✅ PASS |
| SEO | Product/Organization/WebSite JSON-LD + canonical/OG/Twitter present | ✅ PASS (in SSR HTML) |
| Health | `/api/health` → 200 with `status` + `db` fields, no secrets | ✅ PASS |
| Access control | `GET /api/admin/analytics` → **401** unauthenticated | ✅ PASS |
| Access control | `GET /api/admin/inventory/low-stock` → **401** | ✅ PASS |
| Access control | `GET /api/admin/users` → **401** | ✅ PASS |
| Access control | Admin **pages** call `requireAdmin()` (redirect non-admins) | ✅ PASS (code + behavior) |
| Build/Lint | `npm run build` compiles all routes; `npm run lint` clean | ✅ PASS |

Routes that intermittently timed out (`/sitemap.xml`, some heavy `force-dynamic` pages) did
so from remote-Mongo latency, not application errors — they compile in `build` and returned
correct content when the request completed.

## Performance pass

**Findings**
- **Images:** no raw `<img>` debt on the storefront — components already use `next/image`.
  `next.config.js` is well-configured (Cloudinary remote pattern, AVIF/WebP, device/image
  sizes). No change needed.
- **Security headers** present (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- **Fonts (fixed):** Google Fonts were loaded via a render-blocking CSS `@import` at the top
  of `globals.css` (CSS must download before the font CSS is even discovered).

**Change applied**
- Moved the Google-Fonts stylesheet out of the CSS `@import` and into a **preconnected
  `<link>`** in the root-layout `<head>` (`fonts.googleapis.com` + `fonts.gstatic.com`
  preconnect). Fonts are now discovered in the initial HTML and fetched in parallel →
  faster FCP/LCP. Failure mode is graceful (Tailwind font-family fallbacks keep the UI
  intact if the stylesheet is slow/unreachable).

## Recommendations (not blocking; documented for later)

- **`next/font`**: migrating to `next/font/google` would self-host fonts (zero external
  round-trips, no layout shift). Deferred previously due to Tailwind v4 `@theme` coupling —
  worth a dedicated, visually-verified pass.
- **CSP**: add a `Content-Security-Policy` header (currently none).
- **CORS**: `Access-Control-Allow-Origin: *` is applied to every path incl. APIs — scope it
  to the storefront origin for API routes.
- **Rate limiting / errors**: move the in-memory limiter to Upstash Redis for serverless;
  wire Sentry (see `SECURITY_REVIEW.md`).
- **Lighthouse**: run mobile + desktop in a real browser after deploy to a preview URL.

## Remaining manual checks (need a real browser)

Run `npm run dev` locally and click through:
- Responsive layout at 320 / 768 / 1280.
- Full cart flow: product → variant → add to cart → cart drawer → cart → checkout.
- Admin (logged in as `ADMIN_EMAIL`): new **Analytics**, **Inventory** pages; **Users**
  role change + CSV; **Orders** bulk actions + CSV + refund modal (gateway path needs live
  Cashfree keys; manual/COD refund works without them).
