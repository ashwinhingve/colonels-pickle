# CLAUDE.md — Colonel's Pickle by Ridhwika Agro Organics

This file provides complete context to Claude Code for building the Colonel's Pickle e-commerce website.
**Read DESIGN_SYSTEM.md, PRODUCT_CATALOG.md, and PAGES_SPEC.md before writing any code.**

---

## Project Overview

**Brand:** Colonel's Pickle® — Homemade Organic Pickles, Oils & Natural Products  
**Sub-brand:** Ridhwika Agro Organics (RAO) — the manufacturing entity  
**Tagline:** *"Maa Ka Pyaar, Ghar Ka Achar"* (माँ का प्यार, घर का अचार)  
**Owner:** Urmila Devi Roshan Lal (managed by Lt Col Praveen Kumar Sharma)  
**Location:** Plot A-207, Block A, Vardhman Nagar, Gali 24, Ajmer Road, Jaipur, Rajasthan – 302019  
**Contact:** 9717243306, 9416845689, 9350406289  
**FSSAI:** 12223026002188  
**Certifications:** FSSAI, Udhyam Registration, BNI Affiliation

**This project is built by cloning the TAPTIFS codebase (`github.com/ashwinhingve/taptifs`) and completely redesigning the frontend while reusing the entire backend.**

---

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev       # http://localhost:3000

# Production build
npm run build
npm run start

# Linting
npm run lint

# Seed products into MongoDB
npx tsx scripts/seed-products.ts

# Validate product data
npx tsx scripts/validate-products.ts
```

---

## Tech Stack (inherited from TAPTIFS — do not change)

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Database | MongoDB via Mongoose |
| Auth | NextAuth v4 — Google OAuth + Email OTP |
| Payment | Cashfree PG |
| Images | Cloudinary |
| Shipping | Delhivery + Shiprocket |
| Notifications | Nodemailer (email) + Twilio (SMS/WhatsApp) |
| State | Zustand |
| Styling | Tailwind CSS + custom design system |
| UI base | shadcn/ui (Radix UI) — reskinned with CP palette |

---

## Architecture (from TAPTIFS CLAUDE.md)

```
src/
├── app/
│   ├── (shop)/          # Product listings, cart, checkout, orders
│   ├── (info)/          # About, Contact, Story, FAQ
│   ├── (account)/       # User account, orders, wishlist
│   ├── (wholesale)/     # B2B wholesale portal
│   ├── admin/           # Admin dashboard (role-gated)
│   ├── auth/            # Auth pages
│   └── api/             # All REST API routes
├── components/
│   ├── ui/              # shadcn base components (reskinned)
│   ├── layout/          # Header, Footer, AnnouncementBar, CartDrawer
│   ├── home/            # Homepage section components
│   ├── products/        # ProductCard, ProductGrid, VariantSelector
│   ├── cart/            # CartDrawer, CartItem, CartSummary
│   ├── common/          # Badges, Decorators, TrustBar, SectionHeader
│   └── story/           # StorySection, TeamCard, IngredientCard
├── models/              # Mongoose schemas (unchanged from TAPTIFS)
├── lib/
│   ├── mongodb/         # DB connection
│   ├── auth.ts          # NextAuth config — update admin email
│   ├── payment/         # Cashfree (unchanged)
│   ├── shipping/        # Delhivery + Shiprocket (unchanged)
│   └── notifications/   # Email + SMS (unchanged)
├── store/               # Zustand stores (update storage key names)
├── types/               # TypeScript types
└── styles/
    ├── globals.css      # CSS variables + base styles
    └── fonts.css        # Google Fonts imports
```

---

## Key Changes from TAPTIFS → Colonel's Pickle

### Must Change
- [ ] `package.json` name: `taptifs` → `colonels-pickle`
- [ ] All `tapti-*` localStorage keys → `cp-*`  
- [ ] `ashwin.hingave123@gmail.com` → actual admin email in `src/lib/auth.ts`
- [ ] Zustand store: `tapti-cart-storage` → `cp-cart-storage`
- [ ] Site metadata: title, description, OG tags
- [ ] `constants.ts`: brand name, tagline, contact info, address
- [ ] Product seed data: full Colonel's Pickle catalog (see PRODUCT_CATALOG.md)
- [ ] All frontend components: complete redesign per DESIGN_SYSTEM.md

### Keep Unchanged
- All Mongoose models (User, Product, Order, OrderItem, etc.)
- All API route logic (`/api/*`)
- Cashfree payment flow
- NextAuth auth logic (just change admin email)
- Shipping provider factory
- Cloudinary integration
- Twilio notifications
- Nodemailer email
- RBAC middleware

---

## Environment Variables

Create `.env.local` with these keys (same as TAPTIFS, just update values):

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://colonelspickle.in

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cashfree
CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Email (Nodemailer)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Admin
ADMIN_EMAIL=ashwin.hingave123@gmail.com  #in future colonelspickle@gmail.com
```

---

## Tailwind Configuration

Extend `tailwind.config.ts` with the Colonel's Pickle design system:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cp: {
          crimson: {
            DEFAULT: '#B91C1C',
            dark: '#7F1D1D',
            deep: '#450A0A',
            light: '#FEE2E2',
            muted: '#FECACA',
          },
          saffron: {
            DEFAULT: '#D97706',
            bright: '#F59E0B',
            deep: '#B45309',
            light: '#FEF3C7',
            muted: '#FDE68A',
          },
          brown: {
            DEFAULT: '#92400E',
            dark: '#78350F',
            deep: '#451A03',
            light: '#FEF9C7',
          },
          cream: {
            DEFAULT: '#FDF8F0',
            dark: '#F5ECD8',
            muted: '#FFF7ED',
          },
          green: {
            DEFAULT: '#166534',
            dark: '#14532D',
            light: '#DCFCE7',
          },
          text: {
            primary: '#1C1917',
            secondary: '#78716C',
            light: '#A8A29E',
          },
          border: {
            DEFAULT: '#E7E5E4',
            dark: '#D6D3D1',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        sans: ['var(--font-mukta)', 'system-ui', 'sans-serif'],
        hindi: ['var(--font-mukta)', 'Noto Sans Devanagari', 'sans-serif'],
      },
      backgroundImage: {
        'rajasthani-pattern': "url('/patterns/jali.svg')",
        'parchment': "url('/patterns/parchment.svg')",
      },
      animation: {
        'float': 'float 3.5s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'fade-up': 'fadeUp .65s ease forwards',
        'cart-bounce': 'cartBounce .3s ease',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        cartBounce: { '0%,100%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.3)' }, '70%': { transform: 'scale(0.9)' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
export default config
```

---

## Global CSS Variables (`src/styles/globals.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Mukta:wght@300;400;500;600;700&display=swap');

:root {
  /* Fonts */
  --font-playfair: 'Playfair Display';
  --font-lora: 'Lora';
  --font-mukta: 'Mukta';

  /* Brand colors */
  --cp-crimson: #B91C1C;
  --cp-crimson-dark: #7F1D1D;
  --cp-crimson-deep: #450A0A;
  --cp-crimson-light: #FEE2E2;
  --cp-saffron: #D97706;
  --cp-saffron-bright: #F59E0B;
  --cp-saffron-light: #FEF3C7;
  --cp-brown: #92400E;
  --cp-brown-dark: #78350F;
  --cp-cream: #FDF8F0;
  --cp-cream-dark: #F5ECD8;
  --cp-green: #166534;
  --cp-green-light: #DCFCE7;
  --cp-text: #1C1917;
  --cp-text-muted: #78716C;
  --cp-text-light: #A8A29E;
  --cp-border: #E7E5E4;

  /* Semantic */
  --color-primary: var(--cp-crimson);
  --color-secondary: var(--cp-saffron);
  --color-background: var(--cp-cream);
  --color-surface: #FFFFFF;
  --color-text: var(--cp-text);
}

html {
  scroll-behavior: smooth;
  background-color: var(--cp-cream);
}

body {
  font-family: var(--font-mukta), system-ui, sans-serif;
  color: var(--cp-text);
  background-color: var(--cp-cream);
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--cp-cream); }
::-webkit-scrollbar-thumb { background: var(--cp-crimson); border-radius: 3px; }

/* Section title underline */
.sec-title-underline::after {
  content: '';
  display: block;
  width: 56px;
  height: 3px;
  background: linear-gradient(90deg, var(--cp-crimson), var(--cp-saffron));
  margin: 12px auto 0;
  border-radius: 2px;
}
.sec-title-underline.left::after { margin-left: 0; }

/* Announcement bar marquee */
.marquee-track {
  display: flex;
  animation: marquee 28s linear infinite;
  white-space: nowrap;
}
```

---

## Constants (`src/lib/constants.ts`)

```typescript
export const BRAND = {
  name: "Colonel's Pickle",
  nameFull: "Colonel's Pickle® by Ridhwika Agro Organics",
  tagline: "Maa Ka Pyaar, Ghar Ka Achar",
  taglineHindi: "माँ का प्यार, घर का अचार",
  fssai: "12223026002188",
  address: {
    line1: "Plot A-207, Block A, Vardhman Nagar",
    line2: "Gali No. 24, Ajmer Road",
    city: "Jaipur",
    state: "Rajasthan",
    pin: "302019",
  },
  phones: ["9717243306", "9416845689", "9350406289"],
  social: {
    beacons: "https://beacons.ai/colonelspickle",
    gmaps: "https://maps.app.goo.gl/FCraoQErzuMnHLBz9",
  },
  certifications: ["FSSAI", "Udhyam", "BNI"],
  usp: [
    "No Artificial Preservatives",
    "No Artificial Colours or Flavours",
    "24 Exotic Whole Spices",
    "Kachi Ghani Cold Press Mustard Oil",
    "Rock Salt & Black Salt Only",
    "Afghani Hing (₹35,000/kg)",
    "Traditional Mother's Recipe",
    "FSSAI Certified",
  ],
} as const

export const FREE_DELIVERY_THRESHOLD = 499
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'colonelspickle@gmail.com'
export const CART_STORAGE_KEY = 'cp-cart-storage'
```

---

## Auth Config Update (`src/lib/auth.ts`)

In the NextAuth config, update the admin role check:
```typescript
// Change this line:
if (user.email === 'ashwin.hingave123@gmail.com') role = 'admin'
// To:
if (user.email === process.env.ADMIN_EMAIL) role = 'admin'
```

---

## Product Seed Script

After populating `PRODUCT_CATALOG.md` data into `scripts/seed-products.ts`, run:
```bash
npx tsx scripts/seed-products.ts
```

The seed script should:
1. Connect to MongoDB
2. Clear existing products
3. Insert all Colonel's Pickle products with variants, categories, images
4. Create categories: Achaar, Cold Press Oils, Gulkand, Masale & More

---

## Development Rules

1. **Read DESIGN_SYSTEM.md before writing any component**
2. **Never use dark backgrounds on page-level sections** — only for the Hero and Story sections
3. **Always use `font-display` (Playfair Display) for section headings**
4. **Always use `font-hindi` (Mukta) for Hindi text and UI elements**
5. **Always use `font-serif` (Lora) for body copy and descriptions**
6. **Every product card must have a variant selector** (weight: 100g / 250g / 500g / 1kg)
7. **"No Preservatives ✓" badge must appear on every product card**
8. **The announcement bar runs on all pages** — it is part of the root layout
9. **Cart is persistent** — uses Zustand with localStorage key `cp-cart-storage`
10. **Images use Cloudinary** — never use local `/public` images for products
11. **All monetary values formatted** as `₹X,XXX` using `Intl.NumberFormat('en-IN')`
12. **Hindi text must be wrapped in a `font-hindi` class** — never left in default font
13. **Pattern overlays (jali, parchment) are SVG** — never raster images for patterns
14. **Mobile-first** — all grids use `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` pattern
15. **Section alternation**: cream bg → white bg → cream bg → dark bg → cream bg

---

## Quality Gates

Before marking any task complete:
- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes
- [ ] Mobile layout verified (320px + 768px)
- [ ] Cart add/remove/persist works
- [ ] All product variants selectable
- [ ] "No Preservatives" badge visible on product cards
- [ ] Hindi text renders correctly with Mukta font
- [ ] Section heading uses Playfair Display
- [ ] Announcement bar marquee running
- [ ] Color palette matches `#B91C1C` crimson + `#D97706` saffron + `#FDF8F0` cream
