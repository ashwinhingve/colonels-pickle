# Colonel's Pickle — Design System

## Design Philosophy

**"Rajasthani Heritage Premium"** — The visual language of Colonel's Pickle blends the warmth of a traditional Indian home kitchen with the premium presentation of an artisan food brand. It should feel like receiving a beautifully wrapped gift from someone's dadi — personal, authentic, high-quality.

**Three emotional pillars:**
1. **Ghar Jaisa (Home-like)** — warm, soft, familiar
2. **Premium Desi** — not cheap, not generic; artisan and proud
3. **Maa Ka Pyaar** — emotional, story-driven, human

**Anti-patterns (what NOT to do):**
- ❌ Dark backgrounds everywhere (only Hero + Story sections get dark)
- ❌ Glassmorphism or frosted glass effects
- ❌ Neon or electric colors
- ❌ Generic sans-serif typography (no Inter, no Roboto, no system-ui headings)
- ❌ Modern minimalism without warmth
- ❌ Anything that looks like TAPTIFS (amber/dark/spice aesthetic)

---

## Color Palette

### Primary — Crimson (Brand Color)
| Token | Hex | Usage |
|---|---|---|
| `cp-crimson` | `#B91C1C` | Primary buttons, logo color, CTAs, active states |
| `cp-crimson-dark` | `#7F1D1D` | Hover states, Hero background gradient |
| `cp-crimson-deep` | `#450A0A` | Very dark accents, footer |
| `cp-crimson-light` | `#FEE2E2` | Badge backgrounds, tint fills |
| `cp-crimson-muted` | `#FECACA` | Subtle tints |

### Secondary — Saffron Gold (Heritage Accent)
| Token | Hex | Usage |
|---|---|---|
| `cp-saffron` | `#D97706` | CTA gradient start, sub-brand text, icons |
| `cp-saffron-bright` | `#F59E0B` | CTA gradient end, highlighted numbers |
| `cp-saffron-deep` | `#B45309` | Hover for gold CTAs |
| `cp-saffron-light` | `#FEF3C7` | Badge fills, light accent areas |
| `cp-saffron-muted` | `#FDE68A` | Decorative accents |

### Tertiary — Earth Brown (Ridhwika Identity)
| Token | Hex | Usage |
|---|---|---|
| `cp-brown` | `#92400E` | Sub-brand "BY RIDHWIKA AGRO ORGANICS", URLs |
| `cp-brown-dark` | `#78350F` | Product card colored headers |
| `cp-brown-deep` | `#451A03` | Deep earth accents |
| `cp-brown-light` | `#FEF9C7` | Warm background tints |

### Backgrounds
| Token | Hex | Usage |
|---|---|---|
| `cp-cream` | `#FDF8F0` | **Main page background** — warm parchment feel |
| `cp-cream-dark` | `#F5ECD8` | Alternate section backgrounds |
| `cp-cream-muted` | `#FFF7ED` | Card inner fills |
| White | `#FFFFFF` | Card surfaces, product details |

### Text
| Token | Hex | Usage |
|---|---|---|
| `cp-text` | `#1C1917` | Primary body text, headings |
| `cp-text-muted` | `#78716C` | Secondary text, captions, sub-labels |
| `cp-text-light` | `#A8A29E` | Placeholders, hints, disabled states |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| `cp-green` | `#166534` | "No Preservatives" badge, organic indicators |
| `cp-green-light` | `#DCFCE7` | Badge background for green badges |
| `cp-border` | `#E7E5E4` | Default borders, dividers |
| `cp-border-dark` | `#D6D3D1` | Emphasized borders, hover states |

### Dark Section Palette (Hero + Story sections only)
| Token | Hex | Usage |
|---|---|---|
| Hero bg | `linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #78350F 100%)` | Hero section |
| Story bg | `linear-gradient(135deg, #1C1917 0%, #292524 100%)` | Our Story section |
| Text on dark | `#FFFFFF` | Primary text on dark |
| Text on dark muted | `rgba(255,255,255,0.72)` | Secondary text on dark |
| Accent on dark | `#FCD34D` | Highlighted text on dark (warm yellow) |

---

## Typography

### Font Families

```css
--font-display: 'Playfair Display', Georgia, serif;  /* Section headings, hero */
--font-serif: 'Lora', Georgia, serif;                /* Body copy, descriptions */
--font-sans: 'Mukta', system-ui, sans-serif;         /* UI, navigation, badges */
--font-hindi: 'Mukta', 'Noto Sans Devanagari', sans-serif; /* Hindi text */
```

**Load via Google Fonts:**
```
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Mukta:wght@300;400;500;600;700&display=swap
```

### Type Scale & Usage

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Hero Hindi tagline | Mukta | 3.5–4.5rem | 700 | white |
| Hero italic subtitle | Playfair Display | 1.2rem | 400 italic | white 80% |
| Section H2 | Playfair Display | 2rem–2.5rem | 800 | `#1C1917` |
| Section H3 | Playfair Display | 1.5rem | 700 | `#1C1917` |
| Product card title | Playfair Display | 1rem | 700 | `#1C1917` |
| Body paragraph | Lora | 1rem | 400 | `#78716C` |
| UI text / nav | Mukta | 0.875–1rem | 500 | `#1C1917` |
| Badge text | Mukta | 0.75rem | 700 | varies |
| Price | Mukta | 1.25–1.5rem | 800 | `#B91C1C` |
| Hindi label | Mukta | varies | 500–700 | context |
| Eyebrow / overline | Mukta | 0.75rem | 700 | `#B91C1C` | UPPERCASE + letter-spacing |
| Caption | Mukta | 0.6875rem | 400 | `#78716C` |

### Typographic Rules
- Section eyebrows (small labels above H2): `font-hindi text-xs font-bold text-cp-crimson uppercase tracking-widest mb-2`
- Section H2: `font-display text-3xl md:text-4xl font-extrabold text-cp-text sec-title-underline`
- The `.sec-title-underline` class adds the crimson→saffron gradient underline
- Never use Inter, Roboto, or system-ui for headings
- Hindi text MUST use `font-hindi` class — never default font
- Price values: `font-hindi font-extrabold text-cp-crimson`

---

## Spacing & Layout

### Grid System
```
Container max-width: 1280px
Container padding: px-6 (24px mobile), px-8 (32px desktop)
Section padding: py-16 (64px mobile), py-20 (80px desktop)
Card gap: gap-4 (16px mobile), gap-5 (20px desktop)
```

### Product Grid
```
Mobile:  grid-cols-2
Tablet:  grid-cols-3
Desktop: grid-cols-4
XL:      grid-cols-5 (only on All Products page)
```

### Section Alternation Pattern
```
1. AnnouncementBar  → crimson bg
2. Header           → cream bg (sticky)
3. Hero             → crimson gradient (dark)
4. TrustBar         → white bg
5. FeaturedProducts → cream bg
6. OurStory         → charcoal bg (dark)
7. PremIngredients  → white bg
8. CategoryGrid     → cream bg
9. OilsSection      → cream-dark bg
10. AllProducts     → white bg
11. CallToAction    → crimson bg
12. Footer          → charcoal bg (dark)
```

---

## Components

### AnnouncementBar
```tsx
// Full-width crimson bar with scrolling marquee
// Content: USPs separated by " • "
// Font: Mukta 500 12.5px white
// Animation: CSS marquee (28s linear infinite)
// Items: "🌿 No Preservatives" | "⭐ FSSAI Certified" | "🫙 15+ Varieties" | 
//        "🚚 Pan India Delivery" | "💰 Free Delivery ₹499+" | "📞 9717243306"
```

### Header / Navbar
```tsx
// Sticky, top-0, z-50
// Bg: cp-cream (light), blur+shadow on scroll
// Height: h-[70px]
// Left: Brand logo (two-line)
//   Line 1: "Colonel's Pickle®" — font-display text-xl font-extrabold text-cp-crimson
//   Line 2: "BY RIDHWIKA AGRO ORGANICS" — font-hindi text-[9px] font-bold text-cp-brown uppercase tracking-widest
// Center: Nav links — Shop, Our Story, Premium Oils, Categories
//   Each: font-hindi text-[15px] font-medium, underline hover animation with cp-crimson
// Right: Search icon | Cart icon (with count badge) | "Order Now" crimson button
// Mobile: Hamburger menu, slide-in drawer nav
```

### Hero Section
```tsx
// min-h-[88vh]
// Background: crimson gradient + Rajasthani SVG pattern overlay (opacity-[0.06])
// Bottom: wave SVG divider into cream
// Layout: 2-col grid (left content, right jar visual)
//
// LEFT:
//   Badge pill: glass + "🏅 Army Officer's Mother's Homemade Pickles"
//   Hindi H1: "माँ का प्यार, घर का अचार" — font-hindi, 3.5-4.5rem, 700, white + FCD34D accent
//   Subtitle: "Maa Ka Pyaar, Ghar Ka Achar" — font-display italic white/80
//   Body: fserif 15.5px white/72 — brand story in 2 sentences
//   CTAs: [Shop Now →] gold gradient btn + [Our Story] ghost btn
//   Stats: 3 stat items (15+ varieties / 100% Natural / 0 Preservatives) — FCD34D numbers
//
// RIGHT:
//   Floating jar card (CSS, no image required) with animation-float
//   Floating badges: "🌿 100% Natural" top-right, "FSSAI ✓ Certified" bottom-left
//
// Rajasthani SVG Pattern:
//   <pattern> with circles + 8-pointed stars, stroke white, opacity 6%
```

### TrustBar
```tsx
// White bg, border-bottom, py-5
// 6-column grid (collapse to 3 col mobile)
// Items with icon (emoji 22px) + title (font-hindi 12.5px bold) + sub (font-hindi 10.5px muted)
// Items:
//   🧪 Zero Preservatives / No chemicals, ever
//   🫙 Cold Press Oils / Kachi ghani wooden press
//   ⭐ FSSAI Certified / Safe & trusted
//   🧂 Rock & Black Salt / No table salt used
//   🌿 24 Whole Spices / Sun-dried & freshly ground
//   💎 Afghani Hing / Premium ₹35,000/kg
```

### ProductCard
```tsx
interface ProductCardProps {
  product: Product     // MongoDB product document
  addToCart: fn
}

// Structure:
// ┌─────────────────────────────────┐
// │  Colored header (product.color) │ h-[150px]
// │    [Badge top-left]             │
// │    [Emoji/Icon center 52px]     │
// │    [No Preservatives ✓ bottom]  │
// └─────────────────────────────────┘
// │  Product Name (font-display)    │
// │  Hindi name • Subtitle (muted)  │
// │  Description (fserif 12.5px)    │
// │  SELECT SIZE label              │
// │  [100g] [250g] [500g] [1kg]    │ variant pills
// │  ₹149        [+ Cart] / [✓]    │
// └─────────────────────────────────┘

// States:
//   Hover: translateY(-6px) + box-shadow
//   Variant pill: default/selected/hover
//   Add button: crimson → green on success (1.6s timeout)
//
// Colors for product headers:
//   Chhuhara Adrak:    bg #7C2D12
//   Adrak Haldi Nimbu: bg #713F12
//   Organic Gulkand:   bg #831843
//   Dry Masala Aam:    bg #78350F
//   Lehsun Ka Achar:   bg #991B1B
//   Nimbu Chatpata:    bg #713F12
//   Kaccha Mango:      bg #14532D
//   Bharwa Mirch:      bg #7F1D1D
//   Kair Ka Achar:     bg #451A03
//   Kathal Ka Achar:   bg #365314
//   Cold Press Oils:   bg varies by oil
```

### SectionHeader (reusable component)
```tsx
interface SectionHeaderProps {
  eyebrow: string      // e.g., "OUR ACHAAR COLLECTION"
  title: string        // e.g., "Signature Homemade Pickles"
  subtitle?: string
  align?: 'center' | 'left'
}
// Eyebrow: font-hindi text-xs font-bold text-cp-crimson uppercase tracking-widest mb-2
// Title: font-display text-3xl md:text-4xl font-extrabold text-cp-text sec-title-underline
// Subtitle: font-serif text-[15.5px] text-cp-text-muted mt-4 max-w-[500px] mx-auto
```

### OurStory Section
```tsx
// Dark charcoal bg gradient
// Rajasthani jali SVG pattern on right side at opacity 4%
// 2-col grid:
//   LEFT: Story card with army motif, quote, decorative corner borders
//   RIGHT: Story text, heading, 2 paragraphs, 4 fact tiles (Women/FSSAI/Zero Chemicals/Location)
// Heading: font-display 36px 800 white, italic saffron accent word
// Body: font-serif 15.5px white/72 lineHeight 1.8
// Fact tiles: glass bg, border white/9, icon + bold label + muted sublabel
```

### PremiumIngredients Section
```tsx
// White bg
// 4-column grid of ingredient cards
// Each card:
//   Border: 1.5px solid {color}20, hover → full color border
//   Bg: linear-gradient(155deg, white, {color}06)
//   Content: icon (38px) + name (font-display) + subtitle (colored) + detail (muted)
//   Hover: translateY(-4px) + shadow
// Ingredients:
//   🌿 Afghani, Tajiki & Uzbegi Hing — green #166534
//   🫙 Kachi Ghani Mustard Oil — brown #92400E
//   🌶️ 24 Exotic Whole Spices — crimson #B91C1C
//   🧂 Rock Salt & Black Salt — blue #1E40AF
```

### OilsSection
```tsx
// 4-column grid of oil product cards
// Each card: colored header (product bg) + name + sub + price + "Add to Cart"
// Header h: 120px with oil emoji centered
// Hover: same as ProductCard
```

### CartDrawer
```tsx
// position: fixed, right-0, h-screen, w-[380px] (mobile: 100vw)
// Slides in from right: transform translateX(0/100%)
// Backdrop overlay
// Header: "Your Cart" + item count + close X
// Item list: scrollable flex column
//   Each item: product colored circle (48px icon) + name + weight × qty + price + Remove
// Footer (when cart not empty):
//   Subtotal line
//   "Add ₹X more for free delivery" nudge (if < ₹499)
//   [Proceed to Checkout →] gold gradient btn
//   [Continue Shopping] outline btn
```

### Footer
```tsx
// Dark charcoal bg (#1C1917)
// 4-column grid:
//   Col 1 (2fr): Brand + full name + Hindi tagline + 2-line description + certification pills
//   Col 2: Our Products links
//   Col 3: Company links
//   Col 4: Contact (name, phones, address)
// Bottom bar: copyright + FSSAI number
// Font: Mukta for all footer text
// Brand name: font-display text-2xl font-extrabold text-cp-saffron-muted
```

---

## Buttons

### Primary (Crimson)
```css
background: #B91C1C;
color: white;
border: 2px solid #B91C1C;
border-radius: 6–8px;
padding: 10px 20px;
font-family: Mukta;
font-weight: 600;
letter-spacing: 0.04em;
transition: all 0.2s;

Hover: background #7F1D1D, border-color #7F1D1D
```

### CTA (Saffron Gold Gradient)
```css
background: linear-gradient(135deg, #D97706, #F59E0B);
color: white;
border: none;
border-radius: 8px;
padding: 13–14px 28–32px;
font-family: Mukta;
font-weight: 700;
letter-spacing: 0.05em;

Hover: gradient darkens + translateY(-1px) + orange glow shadow
```

### Outline (Crimson)
```css
background: transparent;
color: #B91C1C;
border: 2px solid #B91C1C;
border-radius: 8px;

Hover: fill crimson + text white
```

### Ghost (for dark sections)
```css
background: rgba(255,255,255,0.12);
color: white;
border: 2px solid rgba(255,255,255,0.38);
backdrop-filter: blur(4px);

Hover: slightly more opaque background
```

---

## Badges

### No Preservatives (always green)
```
bg: rgba(22,101,52,0.88) or #DCFCE7
text: white or #166534
font: Mukta 10px 600 | text: "No Preservatives ✓"
position: absolute, bottom-right of product card header
```

### Product Badges (Bestseller, New, Organic, Seasonal, Rare, Spicy)
```
bg: badge-specific color (see ProductCard colors)
text: white
font: Mukta 10–11px 700
position: absolute, top-left of product card header
border-radius: 100px (pill shape)
padding: 2px 9px
```

### Certification Pills (FSSAI, Udhyam, BNI)
```
Used in footer and About page
border: 1px solid rgba(255,255,255,0.2) [on dark] or cp-border [on light]
text: muted
border-radius: 100px
padding: 4px 12px
font: Mukta 12px
```

---

## Decorative Elements

### Rajasthani Jali Pattern
SVG `<pattern>` with diamond lattice + inner circles. Used as:
- Hero section background at opacity 6%
- Story section right panel at opacity 4%
- Footer subtle pattern at opacity 2%

```svg
<pattern id="jali" width="40" height="40" patternUnits="userSpaceOnUse">
  <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="white" stroke-width="1"/>
  <circle cx="20" cy="20" r="7" fill="none" stroke="white" stroke-width="0.5"/>
</pattern>
```

### Rajasthani Star/Medallion Pattern
```svg
<pattern id="rajasthani" width="60" height="60" patternUnits="userSpaceOnUse">
  <circle cx="30" cy="30" r="22" fill="none" stroke="white" stroke-width="1"/>
  <circle cx="30" cy="30" r="10" fill="none" stroke="white" stroke-width="0.5"/>
  <path d="M30 8 L34 22 L48 22 L36 30 L40 44 L30 37 L20 44 L24 30 L12 22 L26 22 Z" 
        fill="none" stroke="white" stroke-width="0.5"/>
</pattern>
```

### Section Title Underline
```css
/* Gradient line under H2 headings */
width: 56px;
height: 3px;
background: linear-gradient(90deg, #B91C1C, #D97706);
margin: 12px auto 0;  /* centered */
border-radius: 2px;
```

### Bottom Wave Divider (Hero → TrustBar)
```svg
<svg viewBox="0 0 1440 56" preserveAspectRatio="none" height="56" width="100%">
  <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="#FDF8F0"/>
</svg>
```

### Decorative Corner Borders (Story section card)
```css
/* Top-left corner */
position: absolute; top: -14px; left: -14px;
width: 56px; height: 56px;
border: 3px solid #D97706;
border-radius: 4px;
opacity: 0.55;

/* Bottom-right corner */
position: absolute; bottom: -14px; right: -14px;
width: 56px; height: 56px;
border: 3px solid #B91C1C;
border-radius: 4px;
opacity: 0.55;
```

---

## Animations

| Name | Keyframes | Usage |
|---|---|---|
| `float` | translateY(0→-8px→0) 3.5s infinite | Hero jar illustration |
| `marquee` | translateX(0→-50%) 28s linear infinite | Announcement bar |
| `fade-up` | opacity+translateY 0.65s forwards | Hero content, section entries |
| `cart-bounce` | scale(1→1.3→0.9→1) 0.3s | Cart count badge on add |

---

## Product Card Color Map

Each product in the database should have a `themeColor` field for the card header background:

| Product | themeColor |
|---|---|
| Chhuhara Adrak | `#7C2D12` |
| Adrak Haldi Nimbu | `#713F12` |
| Organic Gulkand | `#831843` |
| Dry Masala Aam | `#78350F` |
| Lehsun Ka Achar | `#991B1B` |
| Nimbu Chatpata | `#78350F` |
| Kaccha Mango | `#14532D` |
| Bharwa Mirch | `#7F1D1D` |
| Kair Ka Achar | `#451A03` |
| Kathal Ka Achar | `#365314` |
| Cold Press Mustard Oil | `#78350F` |
| Cold Press Peanut Oil | `#92400E` |
| Cold Press Sesame Oil | `#451A03` |
| Cold Press Coconut Oil | `#14532D` |
| Special Tea Masala | `#1C1917` |
| Organic Baked Rice Chips | `#365314` |
| Khatta Meetha Nimbu | `#713F12` |

---

## Responsive Breakpoints

```
sm:  640px   — Mobile landscape
md:  768px   — Tablet
lg:  1024px  — Small desktop
xl:  1280px  — Desktop
2xl: 1536px  — Large desktop
```

### Mobile Adjustments
- Hero: grid → single column, hero-hindi font-size 2.5rem
- TrustBar: 6-col → 3-col grid (2 rows)
- ProductGrid: 1-col → 2-col
- CartDrawer: width 380px → 100vw
- Header: full nav → hamburger drawer
- OurStory: 2-col → single column
- Footer: 4-col → 2-col → 1-col
