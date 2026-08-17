# Colonel's Pickle — Pages Specification

Complete spec for every page. Build in the order listed.

---

## Root Layout (`src/app/layout.tsx`)

```tsx
// Renders on ALL pages
// Order:
//   <AnnouncementBar />     ← crimson marquee, always visible
//   <Header />              ← sticky nav with cart
//   {children}
//   <Footer />
//   <CartDrawer />          ← global, controlled by Zustand cart store

// Meta:
title: "Colonel's Pickle® — Maa Ka Pyaar, Ghar Ka Achar | Homemade Pickles Jaipur"
description: "Authentic homemade pickles by the mother of an Indian Army Colonel. No preservatives, no vinegar, 24 whole spices, cold press mustard oil. FSSAI licensed. Pan India delivery from Jaipur."
ogImage: "/og-colonels-pickle.jpg"
```

---

## Page 1: Homepage (`src/app/page.tsx`)

### Section 1: HeroSection
```
Component: src/components/home/HeroSection.tsx
Bg: crimson gradient (see DESIGN_SYSTEM.md)
Height: min-h-[88vh]

LEFT COL:
  [Glass badge pill] "🏅 Army Officer's Mother's Homemade Pickles"
  [H1 Hindi] "माँ का प्यार,"
  [H1 Hindi accent] "घर का अचार"  ← saffron yellow color
  [Subtitle italic] "Maa Ka Pyaar, Ghar Ka Achar"
  [Body] Brand story 2 sentences — 24 spices, zero preservatives, mother's recipe
  [CTA row] [Shop Now →] gold gradient + [Our Story] ghost
  [Stats row] 15+ Varieties | 100% Natural | 0 Preservatives  ← FCD34D numbers

RIGHT COL:
  Floating jar illustration (CSS, animated)
  Floating badges: "🌿 100% Natural" top-right | "FSSAI ✓ Certified" bottom-left

BOTTOM:
  SVG wave divider into cream bg
```

### Section 2: TrustBar
```
Component: src/components/home/TrustBar.tsx
Bg: white
6-column grid (3-col on mobile)
Items: Zero Preservatives | Cold Press Oils | FSSAI | Rock & Black Salt | 24 Spices | Afghani Hing
```

### Section 3: FeaturedProducts
```
Component: src/components/home/FeaturedProducts.tsx
Bg: cp-cream (#FDF8F0)
Padding: py-20

Header:
  Eyebrow: "OUR ACHAAR COLLECTION"
  H2: "Signature Homemade Pickles"
  Subtitle: "Each jar crafted in small batches with traditional recipes, premium ingredients, and a mother's love."

Content:
  Two rows of 4 products each (8 featured products total)
  Products: Chhuhara Adrak, Adrak Haldi Nimbu, Organic Gulkand, Kaccha Mango (row 1)
            Dry Masala Aam, Lehsun Ka Achar, Bharwa Mirch, Nimbu Chatpata (row 2)
  
  Each: <ProductCard> component (see DESIGN_SYSTEM.md)

CTA: [View All 15+ Products →] outline button → /shop
```

### Section 4: OurStory
```
Component: src/components/home/OurStory.tsx
Bg: charcoal gradient (dark section)
ID: "story" (for scroll anchor)

2-col grid:
LEFT:
  Story card with military icon, name, quote
  Decorative corner borders (gold + crimson)
  
RIGHT:
  Eyebrow: "THE STORY BEHIND EVERY JAR"
  H2: "Born from a" italic-saffron "Mother's Kitchen"
  Para 1: About the mother (Urmila Devi) and her son — an Indian Army Colonel (name withheld) — soldiers missing home
  Para 2: Ridhwika Agro Organics, women employment, Maa Ka Pyaar
  4 fact tiles grid: Women Empowerment | FSSAI | Zero Chemicals | Jaipur Location
```

### Section 5: PremiumIngredients
```
Component: src/components/home/PremiumIngredients.tsx
Bg: white

Header:
  Eyebrow: "WHAT MAKES US DIFFERENT"
  H2: "Premium Ingredients, No Compromises"

4-col grid of IngredientCards:
  Afghani Hing | Cold Press Mustard Oil | 24 Exotic Spices | Rock & Black Salt
  (see DESIGN_SYSTEM.md for card spec)
```

### Section 6: CategoryGrid
```
Component: src/components/home/CategoryGrid.tsx
Bg: cp-cream

Header:
  Eyebrow: "EXPLORE BY CATEGORY"
  H2: "What We Make"

4-col grid:
  Achaar Collection → /shop?category=achaar
  Cold Press Oils → /shop?category=cold-press-oils
  Gulkand & Preserves → /shop?category=gulkand
  Masale & More → /shop?category=masale-more

Each category card:
  Colored header (200px) with category icon + pattern overlay
  Category name (font-display)
  Product count badge
  "Explore →" link
```

### Section 7: ProcessSection (Production Journey)
```
Component: src/components/home/ProcessSection.tsx
Bg: cp-cream-dark
Title: "From Kitchen to Your Doorstep"
Subtitle: "Every jar is a labour of love — from sourcing the finest ingredients to delivering it to your home."

4-step process with connecting line:
  Step 1: "Premium Sourcing" — Afghani hing, whole spices, mustard
  Step 2: "Traditional Preparation" — mother's recipes, sun-drying
  Step 3: "Quality Packaging" — glass jars, sealed, labeled
  Step 4: "Pan India Delivery" — shipped with care

Each step: number circle (crimson) + icon + title + description
```

### Section 8: CallToAction Banner
```
Component: src/components/home/CTABanner.tsx
Bg: crimson (#B91C1C)
Rajasthani pattern overlay

Content (centered):
  H2 (white, font-display): "Order Authentic Ghar Ka Achar Today"
  Subtext (white/80): "Free delivery on orders above ₹499. Pan India shipping. FSSAI certified."
  CTA: [Shop Now →] white bg + crimson text button | [WhatsApp Order] green WhatsApp button

WhatsApp link: https://wa.me/919717243306
```

### Section 9: Wholesale / B2B Teaser
```
Component: src/components/home/WholesaleTeaser.tsx
Bg: white

2-col:
  LEFT: Text content
    "Partner With Us"
    H3: "For Retailers & Distributors"
    Body: 20% discount on MRP, monthly credit basis, transport covered by company
    [Apply for Wholesale] → /wholesale
  
  RIGHT: 3 benefit tiles (Discount / Credit / Transport)
```

---

## Page 2: Shop/Products (`src/app/(shop)/shop/page.tsx`)

```
URL: /shop
URL with filter: /shop?category=achaar

Layout:
  TOP: PageHeader with title "All Products" or category name
  
  FILTERS ROW:
    Category pills: All | Achaar | Oils | Gulkand | Masale
    Sort dropdown: Featured | Price Low-High | Price High-Low | Newest
    Search input (optional for MVP)
  
  GRID: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 (xl:grid-cols-5 on XL)
  
  Each: <ProductCard> with full functionality

  PAGINATION or infinite scroll (optional for MVP — simple load all)
```

---

## Page 3: Product Detail (`src/app/(shop)/products/[slug]/page.tsx`)

```
URL: /products/chhuhara-adrak

Layout: 2-col (image + details)

LEFT: ImageGallery
  Primary image (large)
  Thumbnail row (3-4 images)
  Video thumbnail if available
  
RIGHT: ProductDetails
  Breadcrumb: Home > Achaar > Chhuhara Adrak
  [Badge: Bestseller] [Badge: No Preservatives ✓]
  H1: Product name (font-display)
  Hindi name subtitle
  Rating stars (placeholder: 4.8 ★ from mock data initially)
  
  Variant selector:
    "SELECT SIZE" label
    Pill group: [100g ₹149] [250g ₹349] [500g ₹649] [1kg ₹1,298]
    Selected variant shows price prominently
  
  Price: ₹149 (selected variant)
  
  [Add to Cart] crimson button (full width) 
  [Buy Now] saffron gradient button
  
  Description accordion (collapsible):
    Product Description (fserif text)
    Ingredients
    How to Use / Storage
    FSSAI & Certifications
  
  Trust row: "No Preservatives ✓" | "FSSAI: 12226026000060" | "Pan India Delivery"

BELOW:
  "Why Colonel's Pickle?" — 4 trust points
  Related Products (other products from same category)
  Reviews section (placeholder if no real reviews yet)
```

---

## Page 4: Cart (`src/app/(shop)/cart/page.tsx`)

```
Reuse TAPTIFS cart page structure
Restyle with CP design system:
  - crimson/saffron colors instead of amber
  - font-display for headings
  - Cream bg
  - Product image shows Cloudinary URL
  - "Free delivery above ₹499" nudge bar
```

---

## Page 5: Checkout (`src/app/(shop)/checkout/page.tsx`)

```
Reuse TAPTIFS checkout (Cashfree integration unchanged)
Restyle:
  - Step indicators: 1 Address → 2 Payment → 3 Confirmation
  - Address form: Mukta font, crimson focus borders
  - Payment options: COD + Cashfree Online
  - Order summary sidebar with CP branding
```

---

## Page 6: Our Story (`src/app/(info)/story/page.tsx`)

```
URL: /story

Sections:
  1. Hero (dark): "A Mother's Love, In Every Jar" — full width crimson hero
  
  2. Story Narrative:
     Large editorial text about an Indian Army Colonel (personal name withheld)
     His mother, Urmila Devi
     Starting the venture for soldiers away from home
     Growing into Ridhwika Agro Organics
     Women employment mission
  
  3. Team Photo: Full-width warehouse team photo (from client images — 13th image)
     Caption: "The Colonel's Pickle team at our Jaipur facility"
  
  4. Our Promise: 
     6 commitment tiles — No Preservatives | Authentic Recipes | Premium Hing |
     Cold Press Oils | Rock Salt | FSSAI Certified
  
  5. Production Gallery:
     Image grid showing production process photos (client has 65+ photos)
     Caption each with process description
  
  6. Certifications:
     FSSAI certificate | Udhyam Registration | BNI Affiliation logos/details
  
  7. Location:
     Embedded Google Maps → https://maps.app.goo.gl/FCraoQErzuMnHLBz9
     Address card with contact numbers
```

---

## Page 7: About (`src/app/(info)/about/page.tsx`)

```
Similar to Story page but brand-focused (less personal narrative)
Include: Brand history | Ridhwika Agro Organics | Certifications | Manufacturing
```

---

## Page 8: Contact (`src/app/(info)/contact/page.tsx`)

```
URL: /contact

2-col layout:
  LEFT: Contact Info
    Colonel's Pickle logo
    Address (full)
    Phone numbers (3 numbers, clickable)
    WhatsApp link → wa.me/919717243306
    Beacons link → beacons.ai/colonelspickle
    Google Maps embed
    FSSAI number
  
  RIGHT: Contact Form (optional — redirect to WhatsApp for MVP)
    Name, Phone, Message
    OR: Large "Chat on WhatsApp" button with green styling

Note: Client uses WhatsApp primarily. A WhatsApp-first contact page is acceptable.
```

---

## Page 9: Wholesale (`src/app/(wholesale)/wholesale/page.tsx`)

```
Reuse TAPTIFS wholesale structure
Content update:
  Hero: "Partner with Colonel's Pickle"
  Benefits:
    • 20% discount on MRP
    • Monthly credit basis
    • Transportation cost borne by company
    • Pan India coverage
  Form: Business name, contact, location, type of business
  Process: Apply → Review → Onboard → Monthly replenishment
```

---

## Page 10: Admin Dashboard (`src/app/admin/`)

```
Reuse TAPTIFS admin structure entirely
Only visual updates:
  - Sidebar: crimson (#B91C1C) instead of amber
  - Logo: Colonel's Pickle
  - Table hover: crimson-light instead of amber
  - Buttons: CP color system
  - Page title font: Playfair Display

Functionality unchanged:
  - Products CRUD
  - Orders management
  - User management
  - Discount codes
  - Shipment tracking
  - Revenue overview
```

---

## Page 11: Auth Pages

```
Login/Signup pages: restyle with CP branding
  - Logo top center
  - "Maa Ka Pyaar, Ghar Ka Achar" subtitle
  - Crimson primary button
  - Google OAuth button
  - OTP input for email auth
```

---

## Page 12: Account Pages (`/account`, `/orders`, `/profile`)

```
Reuse TAPTIFS account pages
Visual restyle only:
  - CP color system
  - Playfair headings
  - Order history with CP-styled status badges
```

---

## Page 13: Order Confirmation (`/orders/[orderId]`)

```
Thank you page with:
  Order number
  Estimated delivery (based on shipping provider)
  "Maa Ka Pyaar, Ghar Ka Achar" thank you message
  [Track Order] [Continue Shopping] [WhatsApp Support]
```

---

## SEO Pages (`src/app/(info)/`)

- `/privacy-policy` — Update TAPTIFS privacy policy with CP details
- `/terms` — Update terms with CP details
- `/return-policy` — No returns on consumables (pickles/oils), exceptions for wrong/damaged
- `/shipping` — Delhivery/Shiprocket, 3-7 days, free above ₹499
- `/faq` — Common questions about shelf life, storage, ingredients, ordering

---

## Key Shared Components

### `src/components/layout/AnnouncementBar.tsx`
### `src/components/layout/Header.tsx`
### `src/components/layout/Footer.tsx`
### `src/components/layout/CartDrawer.tsx`
### `src/components/common/SectionHeader.tsx`
### `src/components/common/ProductCard.tsx`
### `src/components/common/Badge.tsx`
### `src/components/common/VariantSelector.tsx`
### `src/components/common/TrustBadges.tsx`
### `src/components/common/RajasthaniPattern.tsx` ← SVG pattern component

---

## Mobile UX Priority

These interactions must be flawless on mobile:
1. Product grid scrolling (2-col)
2. Variant selection on product card
3. Add to cart → drawer opens smoothly
4. Cart drawer full-screen on mobile
5. Checkout form typing experience
6. WhatsApp contact button (fixed bottom on mobile?)
7. AnnouncementBar doesn't break layout
8. Hero Hindi text readable at 320px
