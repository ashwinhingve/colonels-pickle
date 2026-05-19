
# Colonel's Pickle — Development SOP

Complete step-by-step process for building the Colonel's Pickle website on top of the TAPTIFS codebase.

---

## Phase 0: Repository Setup

```bash
# 1. Clone TAPTIFS
git clone https://github.com/ashwinhingve/taptifs colonels-pickle
cd colonels-pickle

# 2. Remove old git history, start fresh
rm -rf .git
git init
git add .
git commit -m "feat: initial commit — Colonel's Pickle based on TAPTIFS"

# 3. Install dependencies
npm install

# 4. Copy env file
cp .env.local.example .env.local
# Fill in all values per CLAUDE.md > Environment Variables

# 5. Copy all docs from colonel-pickle-docs/ into project root docs/
mkdir docs
cp /path/to/colonel-pickle-docs/* docs/

# 6. Test that TAPTIFS runs (baseline working state)
npm run dev
```

---

## Phase 1: Rebrand & Configuration (Day 1 — 2-3 hours)

### 1.1 package.json
```json
{
  "name": "colonels-pickle",
  "version": "1.0.0",
  "description": "Colonel's Pickle — Maa Ka Pyaar, Ghar Ka Achar"
}
```

### 1.2 Update tailwind.config.ts
Add the complete `cp` color palette from CLAUDE.md.
Add font families: `display`, `serif`, `sans`, `hindi`.
Add animations: `float`, `marquee`, `fade-up`, `cart-bounce`.

### 1.3 Update src/styles/globals.css
Add all CSS variables from CLAUDE.md.
Add Google Fonts `@import`.
Add utility classes: `.sec-title-underline`, `.marquee-track`.

### 1.4 Update src/lib/constants.ts
Replace all TAPTIFS constants with Colonel's Pickle constants from CLAUDE.md.

### 1.5 Update src/lib/auth.ts
Change admin email check from `taptiagrofood@gmail.com` to `process.env.ADMIN_EMAIL`.

### 1.6 Update Zustand store
In `src/store/`: change `tapti-cart-storage` → `cp-cart-storage`.

### 1.7 Site Metadata
Update `src/app/layout.tsx` metadata: title, description, OG tags.

**Checkpoint:** `npm run build` should pass. `npm run lint` should pass.

---

## Phase 2: Design System Components (Day 1-2 — 4-5 hours)

Build these shared components first. All other pages depend on them.

### 2.1 RajasthaniPattern (`src/components/common/RajasthaniPattern.tsx`)
```tsx
// SVG pattern component with two variants: 'jali' and 'medallion'
// Props: variant, opacity, color
// Used as background overlay in Hero, Story sections
```

### 2.2 SectionHeader (`src/components/common/SectionHeader.tsx`)
```tsx
// Props: eyebrow, title, subtitle, align ('center' | 'left')
// Uses: font-display for title, sec-title-underline underline
```

### 2.3 Badge (`src/components/common/Badge.tsx`)
```tsx
// Variants: 'no-preservatives' | 'product-badge' | 'certification'
// Always show correct colors per DESIGN_SYSTEM.md
```

### 2.4 VariantSelector (`src/components/common/VariantSelector.tsx`)
```tsx
// Props: variants[], selectedIndex, onChange
// Pill buttons: weight label + optional price label
// Active state: crimson bg, white text
```

### 2.5 ProductCard (`src/components/products/ProductCard.tsx`)
```tsx
// Full spec in DESIGN_SYSTEM.md > Components > ProductCard
// Required props: product (MongoDB doc), addToCart function
// Internal state: selectedVariant index, added (success flash)
```

### 2.6 AnnouncementBar (`src/components/layout/AnnouncementBar.tsx`)
```tsx
// Crimson bg, white text, CSS marquee animation
// Items array from constants.ts
// Position: above Header in root layout
```

### 2.7 Header (`src/components/layout/Header.tsx`)
```tsx
// Full spec in DESIGN_SYSTEM.md > Components > Header
// Sticky, scroll-aware (shadow + blur on scroll)
// Mobile: hamburger → sheet/drawer nav
// Cart badge with count from useCartStore()
```

### 2.8 CartDrawer (`src/components/cart/CartDrawer.tsx`)
```tsx
// Full spec in DESIGN_SYSTEM.md > Components > CartDrawer
// Controlled by useCartStore (isOpen, items, addToCart, removeFromCart)
// Free delivery nudge at < ₹499
```

### 2.9 Footer (`src/components/layout/Footer.tsx`)
```tsx
// Full spec in DESIGN_SYSTEM.md > Components > Footer
// 4-col grid with all links, contact, certifications
// Dark charcoal background
```

**Checkpoint:** Storybook or visual check of all components. All render correctly at 320px, 768px, 1280px.

---

## Phase 3: Homepage (Day 2 — 4-5 hours)

Build in this order — top to bottom:

```
src/components/home/
  HeroSection.tsx        ← most important, most visual
  TrustBar.tsx
  FeaturedProducts.tsx   ← requires ProductCard from Phase 2
  OurStory.tsx
  PremiumIngredients.tsx
  CategoryGrid.tsx
  ProcessSection.tsx
  CTABanner.tsx
  WholesaleTeaser.tsx
```

Assemble in `src/app/page.tsx`:
```tsx
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedProducts />
      <OurStory />
      <PremiumIngredients />
      <CategoryGrid />
      <ProcessSection />
      <CTABanner />
      <WholesaleTeaser />
    </>
  )
}
```

**Image handling in Phase 3:** Use Cloudinary placeholder images or the product emoji + colored background approach until actual images are uploaded. The product card design shows a colored gradient header even without images — this is by design, not a fallback.

**Checkpoint:** Homepage looks correct at all breakpoints. Scroll anchors work (OurStory, Products sections). Cart add works and drawer slides in.

---

## Phase 4: Shop & Product Pages (Day 2-3 — 4-5 hours)

### 4.1 Shop Page (`/shop`)
- Fetch all products from MongoDB via API
- Category filter pills
- Sort options
- ProductCard grid (responsive)
- Loading skeleton states

### 4.2 Product Detail Page (`/products/[slug]`)
- Server-side: `generateStaticParams` for all product slugs
- ImageGallery with Cloudinary images
- VariantSelector
- Add to Cart + Buy Now
- Description accordion
- Related products

### 4.3 API Routes
These are inherited from TAPTIFS unchanged:
- `GET /api/products` — list with category/sort filters
- `GET /api/products/[slug]` — single product
All logic unchanged. Only product data in MongoDB changes.

**Checkpoint:** `/shop` loads all products. Clicking a product opens detail page. Variant selection updates price. Add to cart works.

---

## Phase 5: Product Data Seeding (Day 3 — 2-3 hours)

### 5.1 Update `scripts/seed-products.ts`
Replace TAPTIFS product data with complete Colonel's Pickle catalog from PRODUCT_CATALOG.md.

```typescript
// Each product must have:
//   name, nameHindi, slug, subtitle, category, themeColor,
//   description, shortDescription, ingredients, noPreservatives: true,
//   variants: [{weight, price, mrp, sku}],
//   isActive, isFeatured, sortOrder
```

### 5.2 Run seed
```bash
npx tsx scripts/seed-products.ts
```

### 5.3 Upload images to Cloudinary
Use Cloudinary upload widget or CLI to upload all 65+ client photos.
Follow the folder structure in PRODUCT_CATALOG.md > Image Cloudinary Structure.
Update each product in MongoDB with Cloudinary URLs via admin dashboard.

---

## Phase 6: Remaining Pages (Day 3-4 — 4-5 hours)

Build in priority order:

1. **Our Story page** (`/story`) — High client visibility
2. **Contact page** (`/contact`) — Client needs this for orders
3. **Cart + Checkout** — Restyle only (logic unchanged)
4. **Account pages** — Restyle only
5. **Order confirmation** — Update copy and branding
6. **Admin dashboard** — Restyle (crimson sidebar, CP logo)
7. **Static pages** — Privacy, Terms, Returns, FAQ, Shipping

---

## Phase 7: Performance & SEO (Day 4 — 2-3 hours)

### 7.1 Next.js Image optimization
All product images via `<Image>` component with Cloudinary domains whitelisted in `next.config.js`:
```js
images: {
  domains: ['res.cloudinary.com'],
}
```

### 7.2 SEO per product
Each product page: `generateMetadata()` with product-specific title and description from PRODUCT_CATALOG.md.

### 7.3 Structured data (JSON-LD)
Add `Product` schema to product detail pages.
Add `LocalBusiness` schema to homepage/contact.

### 7.4 robots.txt and sitemap
Next.js automatic sitemap or `next-sitemap` package.

---

## Phase 8: Testing & QA (Day 4-5 — 3-4 hours)

### Critical Paths to Test

| Flow | Test |
|---|---|
| Browse products | /shop loads, filters work |
| Product detail | Variant selector, price updates |
| Add to cart | Item appears in drawer, count updates |
| Checkout — COD | Full flow to order confirmation |
| Checkout — Online | Cashfree gateway opens |
| Auth — Google | Google OAuth redirects correctly |
| Auth — OTP | OTP email received and validates |
| Admin login | Admin email gets admin role |
| Admin products | CRUD works |
| Order tracking | Order status updates visible |
| Mobile 320px | No layout breaking |
| Mobile 768px | Grid changes correct |

### Visual QA Checklist
- [ ] Announcement bar marquee runs
- [ ] Hero Hindi text readable and correctly fonted
- [ ] All section headings use Playfair Display
- [ ] No Preservatives badge on every product card
- [ ] Variant pills select correctly
- [ ] Cart drawer slides in/out smoothly
- [ ] Cart count badge bounces on add
- [ ] Footer shows all 3 phone numbers
- [ ] FSSAI number in footer
- [ ] Google Maps link works (/contact)
- [ ] WhatsApp link opens wa.me

---

## Phase 9: Deployment

```bash
# Vercel deployment (recommended)
vercel

# OR self-hosted
npm run build
npm run start
```

### Vercel Environment Variables
Copy all from `.env.local` to Vercel dashboard environment variables.

### Domain
Point `colonelspickle.in` (or client's domain) to Vercel deployment.

### Post-deployment checklist
- [ ] NEXTAUTH_URL updated to production domain
- [ ] Cashfree callback URL updated to production
- [ ] Cloudinary webhook URLs updated
- [ ] Google OAuth redirect URIs updated
- [ ] Test one real payment on staging

---

## Total Timeline Estimate

| Phase | Task | Time |
|---|---|---|
| 0 | Repo setup | 0.5 hr |
| 1 | Rebrand & config | 2-3 hr |
| 2 | Design system components | 4-5 hr |
| 3 | Homepage | 4-5 hr |
| 4 | Shop & product pages | 4-5 hr |
| 5 | Product data seeding | 2-3 hr |
| 6 | Remaining pages | 4-5 hr |
| 7 | SEO & performance | 2-3 hr |
| 8 | Testing & QA | 3-4 hr |
| 9 | Deployment | 1-2 hr |
| **Total** | | **27-36 hours** |

With Claude Code doing the heavy lifting: 2-3 focused working days.

---

## Claude Code Master Prompt

Paste this into Claude Code after setting up the repo:

---

```
Read docs/CLAUDE.md, docs/DESIGN_SYSTEM.md, docs/PRODUCT_CATALOG.md, and docs/PAGES_SPEC.md completely before starting.

We are building Colonel's Pickle — an authentic homemade pickle e-commerce website. This is built on top of the TAPTIFS codebase. The entire backend (MongoDB, Mongoose models, API routes, Cashfree payment, NextAuth, Cloudinary, Delhivery/Shiprocket, Twilio) is inherited and should NOT be changed. We are doing a complete frontend redesign.

Brand: Colonel's Pickle® by Ridhwika Agro Organics
Tagline: Maa Ka Pyaar, Ghar Ka Achar (माँ का प्यार, घर का अचार)
Design system: Rajasthani Heritage Premium — warm cream bg, deep crimson primary, saffron gold accents, Playfair Display headings, Lora body, Mukta for Hindi/UI text.

Phase 1 (start here): Complete the rebrand and configuration changes listed in docs/DEVELOPMENT_SOP.md Phase 1. Update package.json, tailwind.config.ts, globals.css, constants.ts, auth.ts. Run `npm run build` to confirm it passes before moving to Phase 2.

Phase 2: Build all shared design system components: RajasthaniPattern, SectionHeader, Badge, VariantSelector, ProductCard, AnnouncementBar, Header, CartDrawer, Footer.

Phase 3: Build the complete Homepage assembling all home sections.

Do one phase at a time. After each phase, verify `npm run build` passes and `npm run lint` is clean. Follow the design system EXACTLY — colors, fonts, spacing, components all per the spec documents.
```

---

## Git Commit Convention

```
feat: add HeroSection with crimson gradient and floating jar
feat: add ProductCard with variant selector and add-to-cart
feat: add AnnouncementBar marquee component
fix: mobile grid layout on shop page
style: update Header scroll behavior
chore: seed Colonel's Pickle product catalog
```

---

## Emergency Contacts & Links

| Resource | Link |
|---|---|
| Client WhatsApp | wa.me/919717243306 |
| Client Beacons | beacons.ai/colonelspickle |
| Google Maps | maps.app.goo.gl/FCraoQErzuMnHLBz9 |
| TAPTIFS codebase | github.com/ashwinhingve/taptifs |
| Cloudinary | cloudinary.com |
| Cashfree | cashfree.com |
| NextAuth docs | next-auth.js.org |
