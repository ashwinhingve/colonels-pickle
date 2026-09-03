# Vercel Production Deploy Checklist — Colonel's Pickle

Before deploying to production (https://colonelspickle.in), complete this checklist. Each step is critical for a functioning e-commerce platform.

---

## 1. Environment Variables (Vercel Settings)

All variables must be set in **Vercel Project Settings > Environment Variables** before deploying.

### Required Core (without these, app will not start)

- [ ] **MONGODB_URI** — Production MongoDB Atlas connection string  
  `mongodb+srv://username:password@cluster.mongodb.net/colonels-pickle-prod`

- [ ] **NEXTAUTH_SECRET** — Generate NEW secret (do NOT reuse dev secret)  
  `openssl rand -base64 32`

- [ ] **NEXTAUTH_URL** — Production domain  
  `https://colonelspickle.in`

### Public URLs (used in emails, SMS, webhooks)

- [ ] **NEXT_PUBLIC_APP_URL** — `https://colonelspickle.in`
- [ ] **NEXT_PUBLIC_SITE_URL** — `https://colonelspickle.in`

### Payment Gateway (Cashfree) — Required for checkout

- [ ] **CASHFREE_APP_ID** — Production App ID from Cashfree Merchant Dashboard
- [ ] **CASHFREE_SECRET_KEY** — Production Secret Key from Cashfree
- [ ] **CASHFREE_ENV** — Set to `production` (default: `sandbox`)
- [ ] **CASHFREE_RETURN_URL** — `https://colonelspickle.in/api/payment/callback`

### Google OAuth — Optional but recommended for user signup

- [ ] **GOOGLE_CLIENT_ID** — From Google Cloud Console
- [ ] **GOOGLE_CLIENT_SECRET** — From Google Cloud Console

### Cloudinary Media Hosting — Required for product images

- [ ] **CLOUDINARY_CLOUD_NAME** — Your Cloudinary cloud name
- [ ] **CLOUDINARY_API_KEY** — From Cloudinary Settings > API Keys
- [ ] **CLOUDINARY_API_SECRET** — From Cloudinary Settings > API Keys

### Email Notifications (SMTP) — Required for order confirmations

- [ ] **SMTP_HOST** — `smtp.protonmail.com` or your email provider
- [ ] **SMTP_PORT** — Typically `587` or `465`
- [ ] **SMTP_USER** — Your SMTP username (usually email)
- [ ] **SMTP_PASS** or **SMTP_PASSWORD** — App password (NOT account password)
- [ ] **SMTP_FROM** — `Colonel's Pickle <noreply@colonelspickle.in>`
- [ ] **EMAIL_FROM** — `Colonel's Pickle <noreply@colonelspickle.in>`

### SMS Notifications (Fast2SMS) — Required for order/shipment SMS

- [ ] **FAST2SMS_API_KEY** — Production API key from Fast2SMS dashboard
- [ ] **ADMIN_PHONE** — Admin mobile for notifications (format: `919XXXXXXXXX`)

### Shipping — Delhivery (primary supplier)

- [ ] **DELHIVERY_API_KEY** — Production API key
- [ ] **DELHIVERY_BASE_URL** — `https://one.delhivery.com`
- [ ] **DELHIVERY_RETURN_PINCODE** — `302020`
- [ ] **DELHIVERY_RETURN_ADDRESS** — `B-6/374, Vaishali Nagar`
- [ ] **DELHIVERY_RETURN_CITY** — `Jaipur`
- [ ] **DELHIVERY_RETURN_STATE** — `Rajasthan`
- [ ] **DELHIVERY_RETURN_COUNTRY** — `India`
- [ ] **DELHIVERY_RETURN_NAME** — `Colonel's Pickle`
- [ ] **DELHIVERY_RETURN_PHONE** — `9717243306`
- [ ] **DELHIVERY_WEBHOOK_SECRET** — Generate: `openssl rand -hex 32`

### Shipping — Shiprocket (optional secondary)

- [ ] **SHIPROCKET_EMAIL** — Shiprocket account email
- [ ] **SHIPROCKET_PASSWORD** — Shiprocket account password
- [ ] **SHIPROCKET_PICKUP_LOCATION** — Warehouse ID from Shiprocket
- [ ] **SHIPROCKET_WEBHOOK_SECRET** — Generate: `openssl rand -hex 32`

### Admin & Security

- [ ] **ADMIN_EMAIL** — Admin email for role access (e.g., `colonelspickle@proton.me`)
- [ ] **INTERNAL_API_SECRET** — For internal queue polling; generate: `openssl rand -hex 32`

### Logging & Monitoring

- [ ] **NODE_ENV** — `production`
- [ ] **LOG_LEVEL** — `INFO` or `WARN` (not `DEBUG`)

### Optional: Telegram Alerts

- [ ] **TELEGRAM_BOT_TOKEN** — (Optional) For real-time order alerts
- [ ] **TELEGRAM_CHAT_ID** — (Optional) Your Telegram chat ID

---

## 2. Third-Party Integrations Setup

### Cashfree Payment Gateway

- [ ] Log in to Cashfree Merchant Dashboard (https://merchant.cashfree.com/)
- [ ] Navigate to **Developers > Webhook Settings**
- [ ] Add webhook URL: `https://colonelspickle.in/api/payment/webhook`
- [ ] Enable webhook events: `PAYMENT_SUCCESS`, `PAYMENT_FAILED`, `PAYMENT_CANCELLED`
- [ ] Test webhook by creating a test order in production mode

### Google OAuth

- [ ] Go to **Google Cloud Console** > your project
- [ ] **APIs & Services > Credentials > OAuth 2.0 Client ID (Web)**
- [ ] Add **Authorized redirect URI**: `https://colonelspickle.in/api/auth/callback/google`
- [ ] Test login with a test Google account

### Cloudinary Media

- [ ] Verify **Cloudinary Settings > Upload Presets** are configured
- [ ] Test image upload via admin panel → Products > Add Product → Upload image

### Delhivery Shipping

- [ ] Log in to Delhivery Dashboard
- [ ] Verify **API Key** is active for production
- [ ] Set **Return Address** (Jaipur warehouse) in Delhivery settings
- [ ] Add webhook URL: `https://colonelspickle.in/api/shipping/webhook` (if Delhivery supports)
- [ ] Test shipment creation with a test order

### Fast2SMS

- [ ] Log in to Fast2SMS Dashboard
- [ ] Verify **API Key** is production-enabled
- [ ] Verify **Sender ID** is approved
- [ ] Test SMS send to a live mobile number

### SMTP Email Provider

- [ ] If using ProtonMail: generate **app password** (Settings > Security > App Passwords)
- [ ] If using Gmail: generate **app password** (https://myaccount.google.com/apppasswords)
- [ ] If using other provider: follow their SMTP setup guide
- [ ] Test email send by triggering an order confirmation

---

## 3. Database & Initial Data

### MongoDB Production Setup

- [ ] Verify MongoDB Atlas cluster is created and accessible
- [ ] Whitelist Vercel IPs in MongoDB Network Access (or allow all: `0.0.0.0/0`)
- [ ] Create production database (if not auto-created)
- [ ] Verify connection string in `MONGODB_URI`

### Seed Product Catalog

- [ ] Run product seed locally or via Vercel deployment:

```bash
# Locally (with .env.local set to production DB)
npm run build
npx tsx scripts/seed-products.ts

# Or create a one-time Vercel job to seed data
```

- [ ] Verify products appear in admin panel (/admin/products)

### Create Admin User

- [ ] In production, sign up with your `ADMIN_EMAIL`
- [ ] Verify admin account has role `admin` (check MongoDB directly if needed)
- [ ] Log in to `/admin` dashboard and confirm access to all admin routes

---

## 4. Custom Domain & DNS

- [ ] Register domain (or use existing): `colonelspickle.in`
- [ ] Add domain to Vercel project: **Settings > Domains**
- [ ] Update DNS records at registrar to point to Vercel:
  - [ ] `A` record: `76.76.19.21` (Vercel IP)
  - [ ] Or use CNAME: `cname.vercel-dns.com`
- [ ] Wait for DNS to propagate (check with `nslookup colonelspickle.in`)
- [ ] Verify HTTPS/SSL certificate auto-issues on Vercel

---

## 5. Payments & Webhooks

### Cashfree Payment Testing

- [ ] Go to homepage → Browse products → Add to cart → Checkout
- [ ] Select **Cashfree Payment** (not COD)
- [ ] Use Cashfree test card: `4111111111111111` (exp: any future, CVV: 123)
- [ ] Complete payment and verify:
  - [ ] Order created in MongoDB
  - [ ] Order status = `paid`
  - [ ] Confirmation email sent
  - [ ] Confirmation SMS sent to customer
  - [ ] Admin receives order SMS alert

### Payment Webhook Verification

- [ ] Trigger a payment in production
- [ ] Check Cashfree webhook logs (Merchant Dashboard > Webhooks > Delivery Logs)
- [ ] Verify webhook payload was received by our API
- [ ] Check transaction is marked as verified in MongoDB

---

## 6. Shipping Integration

### Create Test Shipment

- [ ] Go to Admin > Orders > find test order
- [ ] Click **Create Shipment**
- [ ] Verify:
  - [ ] Shipment created in Delhivery
  - [ ] Tracking number generated
  - [ ] Customer receives shipment SMS
  - [ ] Admin receives shipment alert SMS

### Shipping Webhook

- [ ] Trigger a status update in Delhivery (mark as "out for delivery")
- [ ] Verify webhook received and order status updated to `out-for-delivery`
- [ ] Verify customer receives SMS: "Your order is out for delivery"

---

## 7. Post-Deploy Smoke Tests

After deployment to production, run these tests in sequence:

### Homepage & Browse

- [ ] [ ] Visit `https://colonelspickle.in` — page loads, no console errors
- [ ] [ ] Verify announcement bar marquee is running
- [ ] [ ] Click on a product → variant selector works (100g, 250g, 500g, 1kg)
- [ ] [ ] Verify "No Preservatives ✓" badge visible on products

### Cart & Checkout Flow

- [ ] [ ] Add 2 products to cart
- [ ] [ ] Verify cart persists (refresh page → items still there)
- [ ] [ ] Click checkout → redirects to shipping address form
- [ ] [ ] Fill shipping form → select delivery method
- [ ] [ ] Choose COD payment → place order → order confirmation page
- [ ] [ ] Verify order appears in account/orders
- [ ] [ ] Verify order email sent (check email)
- [ ] [ ] Verify order SMS sent (check phone)

### Payment Flow (Real Money)

- [ ] [ ] Repeat checkout flow but choose **Cashfree Payment**
- [ ] [ ] Use test card or real card (check Cashfree sandbox mode)
- [ ] [ ] Complete payment → order confirmation page
- [ ] [ ] Verify order status is `paid`
- [ ] [ ] Verify webhook received and idempotency works (check logs)

### Admin Dashboard

- [ ] [ ] Log in as admin: `https://colonelspickle.in/admin`
- [ ] [ ] Navigate to **Products** → verify all products load
- [ ] [ ] Click **Edit Product** → change price → save → verify update
- [ ] [ ] Navigate to **Orders** → find test order → view details
- [ ] [ ] Click **Create Shipment** → select Delhivery → submit
- [ ] [ ] Verify shipment created and tracking number generated
- [ ] [ ] Navigate to **Analytics** → verify charts/metrics load
- [ ] [ ] Test **Users** page → search/filter works

### Health Check Endpoint

- [ ] [ ] Visit `https://colonelspickle.in/api/health`
- [ ] [ ] Verify response contains:
  - `status: "ok"`
  - `db: "connected"`
  - `env: { required: true, optionalConfigured: [...] }`

### Search & Filtering

- [ ] [ ] Visit `/products` → search for "pickle" → verify results
- [ ] [ ] Filter by category "Achaar" → verify results
- [ ] [ ] Sort by price (high to low) → verify order

### Mobile Responsiveness

- [ ] [ ] Open DevTools → toggle device toolbar
- [ ] [ ] Test at 375px width (iPhone SE)
- [ ] [ ] Test at 768px width (iPad)
- [ ] [ ] Verify:
  - [ ] Navigation hamburger works
  - [ ] Product grid is 2 columns on mobile
  - [ ] Checkout form is readable
  - [ ] Images load and scale properly

---

## 8. Security & Monitoring

### Verify Security Headers

```bash
curl -i https://colonelspickle.in | grep -i "Strict-Transport-Security\|X-Frame-Options\|X-Content-Type-Options"
```

- [ ] Verify headers present:
  - [ ] `Strict-Transport-Security: max-age=63072000`
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `X-Content-Type-Options: nosniff`

### Enable Monitoring

- [ ] [ ] Set up **Sentry** error tracking (optional but recommended)
  - Visit `https://sentry.io/`, create project, add `SENTRY_DSN` to env vars
  
- [ ] [ ] Set up **Vercel Analytics** (already included, check dashboard)

- [ ] [ ] Configure rate limiting for production
  - Check `src/lib/middleware/rateLimit.ts` — currently in-memory
  - Plan to migrate to Redis/Upstash for distributed deployments

### Monitor Logs

- [ ] [ ] Check Vercel deployment logs for warnings/errors
- [ ] [ ] Monitor MongoDB slow queries (Atlas Dashboard > Performance Advisor)
- [ ] [ ] Set up email alerts for deployment failures

---

## 9. Backup & Disaster Recovery

- [ ] [ ] Enable **MongoDB Atlas automated backups** (default: 7-day retention)
- [ ] [ ] Document recovery procedure for team
- [ ] [ ] Test restore from backup in staging environment (monthly)
- [ ] [ ] Enable **Vercel automatic deployments** from main branch

---

## 10. Launch Announcement

- [ ] [ ] Update social media links (Instagram, WhatsApp)
- [ ] [ ] Send announcement to existing customers (email list)
- [ ] [ ] Post on Instagram @colonels.pickle
- [ ] [ ] Add site to Google Search Console (https://search.google.com/search-console)
- [ ] [ ] Submit sitemap: `https://colonelspickle.in/sitemap.xml`
- [ ] [ ] Test on Google PageSpeed Insights
- [ ] [ ] Monitor initial traffic via Vercel Analytics

---

## Post-Launch Maintenance

### Daily (First Week)

- [ ] Check health endpoint: `https://colonelspickle.in/api/health`
- [ ] Review error logs in Vercel
- [ ] Monitor order flow (place test orders)
- [ ] Check SMS/email delivery

### Weekly

- [ ] Review analytics (orders, users, revenue)
- [ ] Check payment webhook deliveries
- [ ] Verify shipping integrations
- [ ] Monitor rate limiting logs

### Monthly

- [ ] Review security audit findings
- [ ] Update product prices/catalog
- [ ] Perform full backup restore test
- [ ] Review customer feedback/reviews

---

## Reference Links

- Vercel Project: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com/
- Cashfree Merchant: https://merchant.cashfree.com/
- Cloudinary Dashboard: https://cloudinary.com/console/
- Delhivery Dashboard: https://www.delhivery.com/
- Fast2SMS Dashboard: https://www.fast2sms.com/
- Google Cloud Console: https://console.cloud.google.com/
- Environment Variables Spec: `.env.local.example`
- Production Health Check: `/api/health`

---

**Last updated:** 2026-07-28  
**Maintained by:** Engineering Team  
**For questions:** colonelspickle@proton.me
