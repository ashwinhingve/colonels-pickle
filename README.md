# Colonel's Pickle® — by Ridhwika Agro Organics

> **माँ का प्यार, घर का अचार** · *Maa Ka Pyaar, Ghar Ka Achar*

A production-grade e-commerce storefront for **Colonel's Pickle** — homemade organic pickles, cold-press oils, gulkand, and natural products, made with pride by the family of an Indian Army Colonel in Jaipur, Rajasthan.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

**FSSAI Licensed** · **Udyam Registered** · **Trademark®** · **GST Registered**

---

## 🫙 About

Colonel's Pickle sells authentic, small-batch pickles and cold-press oils with **no artificial preservatives, colours, or flavours** — made from a traditional mother's recipe using 24 exotic whole spices, Kachi Ghani cold-press mustard oil, rock & black salt, and premium Afghani/Tajikistani/Uzbeki hing.

- **Brand:** Colonel's Pickle® by Ridhwika Agro Organics (RAO)
- **Location:** B-6/374, Vaishali Nagar, Jaipur, Rajasthan – 302020
- **Free delivery** pan-India on orders above **₹999**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript 5 |
| Styling | Tailwind CSS 4 · shadcn/ui (Radix) · Framer Motion |
| Database | MongoDB via Mongoose 8 |
| Auth | NextAuth v4 — Google OAuth + Email OTP |
| Payments | Cashfree PG |
| Images | Cloudinary (`next-cloudinary`) |
| Shipping | Delhivery + Shiprocket |
| Notifications | Nodemailer (email) + Twilio (SMS/WhatsApp) |
| State | Zustand |
| Content | TipTap rich-text editor (admin CMS) |
| Validation | Zod + React Hook Form |

---

## ✨ Features

- **Storefront** — product listings, variant selection (100g / 250g / 500g / 1kg), persistent cart, checkout
- **Accounts** — Google OAuth + email OTP login, order history, addresses, wishlist
- **Payments** — Cashfree PG integration with order lifecycle tracking
- **Shipping** — pluggable Delhivery / Shiprocket provider factory, live rate calculation, order tracking & returns
- **Wholesale (B2B) portal** — bulk pricing & applications
- **Admin dashboard** — product/inventory CMS, review moderation, order operations (role-gated)
- **Trust & compliance** — verified FSSAI / Udyam / Trademark / GST registrations surfaced in-store
- **Sitewide motion & illustration system** — Framer Motion primitives + inline-SVG artwork
- **Notifications** — transactional email (Nodemailer) + SMS/WhatsApp (Twilio)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (MongoDB Atlas recommended)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```
Then fill in `.env.local`. Required groups of keys:

| Group | Keys |
|---|---|
| MongoDB | `MONGODB_URI` |
| NextAuth | `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Cashfree | `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY` |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| Email (SMTP) | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` |
| Admin | `ADMIN_EMAIL` (comma-separated; first entry is the primary admin) |

> See `.env.local.example` for the complete, up-to-date list.

### 3. Seed the product catalogue
```bash
npx tsx scripts/seed-products.ts
```

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 📦 Scripts

### npm scripts
```bash
npm run dev      # start the dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run the production build
npm run lint     # ESLint
```

### Data / catalogue scripts (`tsx`)
```bash
npx tsx scripts/seed-products.ts        # seed products & categories into MongoDB
npx tsx scripts/validate-products.ts    # validate product data integrity
npx tsx scripts/add-extra-products.ts   # add supplementary products
npx tsx scripts/reconcile-prices.ts     # reconcile prices against the price list
npx tsx scripts/upload-product-images.ts # upload product images to Cloudinary
npx tsx scripts/link-product-images.ts   # link uploaded images to products
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (shop)/          # Product listings, cart, checkout, orders
│   ├── (info)/          # About, Contact, FAQ, policy pages
│   ├── (account)/       # Login, account, orders, wishlist, addresses
│   ├── (wholesale)/     # B2B wholesale portal
│   ├── admin/           # Admin dashboard (role-gated)
│   ├── auth/            # Auth pages (error, signout)
│   └── api/             # REST API routes
├── components/
│   ├── ui/              # shadcn base components
│   ├── layout/          # Header, Footer, MobileMenu, CartDrawer
│   ├── home/            # Homepage sections
│   ├── products/        # ProductCard, gallery, purchase
│   ├── shared/          # Motion primitives, dividers, skeletons
│   └── illustrations/   # Inline-SVG artwork & scenes
├── models/              # Mongoose schemas
├── lib/
│   ├── constants.ts     # Brand, registrations, pricing, categories
│   ├── auth.ts          # NextAuth config
│   ├── payment/         # Cashfree
│   ├── shipping/        # Delhivery + Shiprocket
│   └── notifications/   # Email + SMS
├── store/               # Zustand stores
├── types/               # TypeScript types
└── styles/              # globals.css, fonts
scripts/                 # Seed / validate / image / price tooling
```

---

## 🚢 Deployment

Deployable to any Node host; **Vercel** is recommended.

1. Push to GitHub
2. Import the project into Vercel
3. Add every environment variable from `.env.local.example`
4. Deploy

Ensure production `NEXTAUTH_URL` and the Cashfree, Cloudinary, Twilio, and SMTP credentials point at their production values.

---

## 🏛️ Registrations & Trust

These government registrations are displayed in-store so customers can independently verify the brand:

| Registration | Number |
|---|---|
| FSSAI (valid till 12 Jan 2027) | `12226026000060` |
| Udyam (MSME · Manufacturing) | `UDYAM-RJ-17-0307560` |
| Trademark (Class 29 · Pickles) | `6202243` |
| GSTIN (Rajasthan) | `08BFKPD8446R1ZM` |

---

## 📄 License & Contact

Copyright © Ridhwika Agro Organics. All rights reserved. This is a private, proprietary project.

- 🌐 [beacons.ai/colonelspickle](https://beacons.ai/colonelspickle)
- 📸 [@colonels.pickle](https://instagram.com/colonels.pickle)
- ✉️ colonelspickle@proton.me
- 📞 +91 9717243306 · 9416845689 · 9350406289

---

**Built with ❤️ in Jaipur — Next.js · TypeScript · Tailwind CSS · MongoDB**
