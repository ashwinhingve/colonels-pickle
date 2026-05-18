# Colonel's Pickle — Complete Product Catalog

All product data for seeding the MongoDB database via `scripts/seed-products.ts`.

---

## Categories

```typescript
const CATEGORIES = [
  { slug: 'achaar', name: 'Achaar Collection', nameHindi: 'अचार संग्रह', description: 'Authentic homemade pickles crafted with traditional recipes and premium ingredients.', sortOrder: 1 },
  { slug: 'cold-press-oils', name: 'Cold Press Oils', nameHindi: 'कोल्ड प्रेस तेल', description: 'Pure wooden-press extracted oils — unrefined, unprocessed, full of natural goodness.', sortOrder: 2 },
  { slug: 'gulkand', name: 'Gulkand & Preserves', nameHindi: 'गुलकंद', description: 'Organic rose petal preserves from Pushkar farms.', sortOrder: 3 },
  { slug: 'masale-more', name: 'Masale & More', nameHindi: 'मसाले और अधिक', description: 'Special masalas, rice chips, and other artisan products.', sortOrder: 4 },
]
```

---

## Complete Product List

### 1. Chhuhara Adrak Achar
```typescript
{
  name: "Chhuhara Adrak",
  nameHindi: "छुहारा अदरक",
  slug: "chhuhara-adrak",
  subtitle: "Dry Ginger & Date Pickle",
  tagline: "Ghar Ka Achar • No Preservatives",
  category: "achaar",
  badge: "Bestseller",
  badgeColor: "#B45309",
  themeColor: "#7C2D12",
  description: "Authentic sun-dried dates (chhuhara) combined with fresh ginger (adrak) and our signature 24-spice masala, all prepared in cold-pressed wooden mustard oil. A unique combination that delivers robust warmth and sweetness in every bite.",
  shortDescription: "Dry ginger & date pickle — a Colonel's Pickle signature.",
  ingredients: "Chhuhara (Dry Dates), Fresh Ginger, 24 Whole Spices (Methi Dana, Sarson Dana, Mustard Seeds, Saunf, Jeera, Coriander Seeds, Nigella Seeds, Ajwain, Hing, and others), Cold Press Mustard Oil, Rock Salt, Black Salt",
  shelfLife: "18 months from date of packing",
  storage: "Store in a dry, cool & clean place. Do not use wet spoon/utensils/bare hands.",
  certifications: ["FSSAI"],
  fssaiNumber: "12223026002188",
  noPreservatives: true,
  noArtificialColor: true,
  noArtificialFlavour: true,
  variants: [
    { weight: "100g", price: 149, mrp: 149, sku: "CA-100" },
    { weight: "250g", price: 349, mrp: 349, sku: "CA-250" },
    { weight: "500g", price: 649, mrp: 649, sku: "CA-500" },
    { weight: "1kg",  price: 1298, mrp: 1298, sku: "CA-1000" },
  ],
  isFeatured: true,
  isActive: true,
  sortOrder: 1,
  seoTitle: "Chhuhara Adrak Achar — Colonel's Pickle Homemade Date Ginger Pickle",
  seoDescription: "Authentic homemade Chhuhara Adrak pickle with 24 spices, cold press mustard oil, no preservatives. Buy Colonel's Pickle — Maa Ka Pyaar Ghar Ka Achar.",
}
```

### 2. Adrak Haldi Nimbu Achar
```typescript
{
  name: "Adrak Haldi Nimbu",
  nameHindi: "अदरक हल्दी नींबू",
  slug: "adrak-haldi-nimbu",
  subtitle: "Ginger Turmeric Lemon Pickle",
  tagline: "A Spoonful of Health and Flavor",
  category: "achaar",
  badge: "New",
  badgeColor: "#166534",
  themeColor: "#713F12",
  description: "A health-forward pickle combining the anti-inflammatory power of raw turmeric (haldi) with the digestive benefits of ginger (adrak) and the tang of fresh lemon (nimbu). Prepared with 24 natural spices and wooden-press mustard oil — no artificial additives of any kind.",
  shortDescription: "Ginger, turmeric, and lemon — healthy and flavorful.",
  ingredients: "Fresh Ginger, Raw Turmeric, Lemon, 24 Whole Spices (Methi Dana, Sarson Dana, Saunf, Jeera, Coriander Seeds, Nigella Seeds, Ajwain, Hing, and Colonel's Spl. Spices), Cold Press Mustard Oil, Rock Salt, Black Salt",
  shelfLife: "18 months from date of packing",
  storage: "Store in a dry, cool & clean place. Shake well before serving.",
  noPreservatives: true,
  noArtificialColor: true,
  noArtificialFlavour: true,
  variants: [
    { weight: "100g", price: 109, mrp: 109, sku: "AHN-100" },
    { weight: "250g", price: 249, mrp: 249, sku: "AHN-250" },
    { weight: "500g", price: 459, mrp: 459, sku: "AHN-500" },
    { weight: "1kg",  price: 918, mrp: 918, sku: "AHN-1000" },
  ],
  isFeatured: true,
  isActive: true,
  sortOrder: 2,
}
```

### 3. Organic Gulkand
```typescript
{
  name: "Organic Gulkand",
  nameHindi: "ऑर्गेनिक गुलकंद",
  slug: "organic-gulkand",
  subtitle: "Homemade Organic Rose Petal Preserve",
  tagline: "Sweet. Floral. Desi.",
  category: "gulkand",
  badge: "Organic",
  badgeColor: "#9D174D",
  themeColor: "#831843",
  description: "Pure rose petals sourced from certified organic rose farms in Pushkar, Rajasthan — sun-cooked slowly with natural sweetness into a rich floral preserve. No artificial colours, no preservatives, no vinegar. A classic Indian superfood known for its cooling properties and digestive benefits.",
  shortDescription: "Organic rose petal preserve from Pushkar farms.",
  ingredients: "Organic Rose Petals (from Pushkar organic farms), Natural Sugar/Mishri, Rose Water",
  shelfLife: "18 months from date of packing",
  noPreservatives: true,
  noArtificialColor: true,
  noArtificialFlavour: true,
  variants: [
    { weight: "100g",  price: 149, mrp: 149, sku: "GK-100" },
    { weight: "250g",  price: 299, mrp: 299, sku: "GK-250" },
  ],
  isFeatured: true,
  isActive: true,
  sortOrder: 3,
}
```

### 4. Dry Masala Aam
```typescript
{
  name: "Dry Masala Aam",
  nameHindi: "सूखा मसाला आम",
  slug: "dry-masala-aam",
  subtitle: "Dry Mango Pickle",
  tagline: "Ghar Ka Achar — The Taste of Summer",
  category: "achaar",
  badge: "Seasonal",
  badgeColor: "#B45309",
  themeColor: "#78350F",
  description: "Traditional dry mango pickle crafted with Colonel's special masala blend. Raw mangoes sun-dried and marinated with 24 whole spices in cold-pressed mustard oil — the authentic taste of summer that keeps all year long.",
  shortDescription: "Sun-dried mango with Colonel's special 24-spice masala.",
  ingredients: "Raw Mango (Kaccha Aam), 24 Whole Spices, Cold Press Mustard Oil, Rock Salt, Black Salt, Hing",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 119, mrp: 119, sku: "DMA-100" },
    { weight: "250g", price: 269, mrp: 269, sku: "DMA-250" },
    { weight: "500g", price: 499, mrp: 499, sku: "DMA-500" },
    { weight: "1kg",  price: 949, mrp: 949, sku: "DMA-1000" },
  ],
  isFeatured: true,
  isActive: true,
  sortOrder: 4,
}
```

### 5. Lehsun Ka Achar
```typescript
{
  name: "Lehsun Ka Achar",
  nameHindi: "लहसुन का अचार",
  slug: "lehsun-ka-achar",
  subtitle: "Garlic Pickle",
  tagline: "Ghar Ka Achar — Bold & Pungent",
  category: "achaar",
  badge: "",
  themeColor: "#991B1B",
  description: "Robust whole garlic cloves marinated in a rich masala base with kachi ghani cold-pressed mustard oil. Pungent, bold, and deeply flavored — this is the garlic pickle you've been missing from home.",
  shortDescription: "Whole garlic cloves in rich masala and cold press mustard oil.",
  ingredients: "Garlic (Lehsun), 24 Whole Spices, Cold Press Mustard Oil, Rock Salt, Black Salt, Hing",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 119, mrp: 119, sku: "LKA-100" },
    { weight: "250g", price: 269, mrp: 269, sku: "LKA-250" },
    { weight: "500g", price: 499, mrp: 499, sku: "LKA-500" },
    { weight: "1kg",  price: 949, mrp: 949, sku: "LKA-1000" },
  ],
  isFeatured: false,
  isActive: true,
  sortOrder: 5,
}
```

### 6. Nimbu Chatpata
```typescript
{
  name: "Nimbu Chatpata",
  nameHindi: "नींबू चटपटा",
  slug: "nimbu-chatpata",
  subtitle: "Tangy Lemon Pickle",
  tagline: "Ghar Ka Achar — Chatpata & Tangy",
  category: "achaar",
  badge: "",
  themeColor: "#713F12",
  description: "A classic North Indian lemon pickle with the perfect balance of sour lemon, black salt, and 15+ whole spices. Made with whole lemons, slow-pickled in natural mustard oil — no vinegar, no shortcuts.",
  shortDescription: "Classic tangy lemon pickle with rock and black salt.",
  ingredients: "Lemon (Nimbu), 15+ Whole Spices, Cold Press Mustard Oil, Rock Salt, Black Salt, Red Chilli, Hing",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 109, mrp: 109, sku: "NC-100" },
    { weight: "250g", price: 249, mrp: 249, sku: "NC-250" },
    { weight: "500g", price: 459, mrp: 459, sku: "NC-500" },
  ],
  isFeatured: false,
  isActive: true,
  sortOrder: 6,
}
```

### 7. Kaccha Mango (Aam Ka Achar)
```typescript
{
  name: "Kaccha Mango",
  nameHindi: "कच्चा मैंगो अचार",
  slug: "kaccha-mango",
  subtitle: "Raw Mango Pickle",
  tagline: "Home Made — Pure Ghar Ka Swad",
  category: "achaar",
  badge: "Summer Special",
  badgeColor: "#166534",
  themeColor: "#14532D",
  description: "Fresh raw mango chunks slow-pickled in aromatic whole spices and cold-pressed mustard oil. Each batch uses freshly sourced raw mangoes — the mango pickle recipe your nani made with the same purity and love.",
  shortDescription: "Fresh raw mango slow-pickled with whole spices.",
  ingredients: "Raw Mango (Kaccha Aam), 24 Whole Spices, Cold Press Mustard Oil, Rock Salt, Black Salt, Fenugreek Seeds, Fennel Seeds, Mustard Seeds",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 109, mrp: 109, sku: "KM-100" },
    { weight: "250g", price: 249, mrp: 249, sku: "KM-250" },
    { weight: "500g", price: 459, mrp: 459, sku: "KM-500" },
    { weight: "1kg",  price: 899, mrp: 899, sku: "KM-1000" },
  ],
  isFeatured: true,
  isActive: true,
  sortOrder: 7,
}
```

### 8. Bharwa Mirch (Stuffed Red Chilli Pickle)
```typescript
{
  name: "Bharwa Mirch",
  nameHindi: "भरवां मिर्च",
  slug: "bharwa-mirch",
  subtitle: "Stuffed Red Chilli Pickle",
  tagline: "Bold, Fiery, Unforgettable",
  category: "achaar",
  badge: "🌶 Spicy",
  badgeColor: "#B91C1C",
  themeColor: "#7F1D1D",
  description: "Whole fresh red chillies hand-stuffed with our signature 24-spice masala and marinated in cold-pressed mustard oil. Visible in the production photos — each chilli is individually prepared with care. Bold, fiery, and completely authentic.",
  shortDescription: "Hand-stuffed red chillies with signature 24-spice masala.",
  ingredients: "Fresh Red Chilli (Lal Mirch), 24 Whole Spices (Colonel's Special Masala), Cold Press Mustard Oil, Rock Salt, Black Salt, Hing",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 129, mrp: 129, sku: "BM-100" },
    { weight: "250g", price: 289, mrp: 289, sku: "BM-250" },
    { weight: "500g", price: 529, mrp: 529, sku: "BM-500" },
  ],
  isFeatured: false,
  isActive: true,
  sortOrder: 8,
}
```

### 9. Kair Ka Achar (Desert Berry Pickle)
```typescript
{
  name: "Kair Ka Achar",
  nameHindi: "कैर का अचार",
  slug: "kair-ka-achar",
  subtitle: "Rajasthani Desert Berry Pickle",
  tagline: "A Rare Rajasthani Delicacy",
  category: "achaar",
  badge: "Rare",
  badgeColor: "#B45309",
  themeColor: "#451A03",
  description: "Kair (also called Teent) is a rare desert berry found in the arid regions of Rajasthan. This unique pickle is almost impossible to find outside Rajasthan and represents Colonel's Pickle's deep Rajasthani roots. A true connoisseur's pickle.",
  shortDescription: "Rare Rajasthani desert berry (kair/teent) pickle.",
  ingredients: "Kair/Teent (Desert Berry), 24 Whole Spices, Cold Press Mustard Oil, Rock Salt, Black Salt",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 149, mrp: 149, sku: "KKA-100" },
    { weight: "250g", price: 349, mrp: 349, sku: "KKA-250" },
  ],
  isFeatured: false,
  isActive: true,
  sortOrder: 9,
}
```

### 10. Kathal Ka Achar (Jackfruit Pickle)
```typescript
{
  name: "Kathal Ka Achar",
  nameHindi: "कटहल का अचार",
  slug: "kathal-ka-achar",
  subtitle: "Jackfruit Pickle",
  tagline: "Ghar Ka Achar — Traditional & Rare",
  category: "achaar",
  badge: "",
  themeColor: "#365314",
  description: "Tender jackfruit (kathal) chunks slow-pickled in a robust spice base with cold-pressed mustard oil. A prized and somewhat rare traditional pickle — crafted in small batches as this seasonal ingredient becomes available.",
  shortDescription: "Tender jackfruit pickle in a robust spice base.",
  ingredients: "Raw Jackfruit (Kathal), 24 Whole Spices, Cold Press Mustard Oil, Rock Salt, Black Salt, Hing",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 129, mrp: 129, sku: "KA-100" },
    { weight: "250g", price: 299, mrp: 299, sku: "KA-250" },
    { weight: "500g", price: 549, mrp: 549, sku: "KA-500" },
  ],
  isFeatured: false,
  isActive: true,
  sortOrder: 10,
}
```

### 11. Khatta Meetha Nimbu
```typescript
{
  name: "Khatta Meetha Nimbu",
  nameHindi: "खट्टा मीठा नींबू",
  slug: "khatta-meetha-nimbu",
  subtitle: "Sweet & Sour Lemon Pickle",
  tagline: "The Sweet Side of Nimbu",
  category: "achaar",
  badge: "",
  themeColor: "#713F12",
  description: "A sweet-sour take on the classic lemon pickle — lemon pieces with jaggery, spices, and mustard oil. Perfect for those who like their nimbu with a touch of sweetness.",
  shortDescription: "Sweet and sour lemon pickle with jaggery.",
  ingredients: "Lemon, Jaggery (Gur), Whole Spices, Cold Press Mustard Oil, Rock Salt",
  noPreservatives: true,
  variants: [
    { weight: "100g", price: 119, mrp: 119, sku: "KMN-100" },
    { weight: "250g", price: 269, mrp: 269, sku: "KMN-250" },
  ],
  isActive: true,
  sortOrder: 11,
}
```

---

## Cold Press Oils

### 12. Cold Press Mustard Oil
```typescript
{
  name: "Cold Press Mustard Oil",
  nameHindi: "कोल्ड प्रेस सरसों तेल",
  slug: "cold-press-mustard-oil",
  subtitle: "Kachi Ghani — Wooden Press Extra Virgin",
  category: "cold-press-oils",
  badge: "Pure",
  themeColor: "#78350F",
  description: "The same wooden cold-press mustard oil we use in every jar of our pickles — now available for your kitchen. Unrefined, cold-pressed with a traditional wooden ghani, retaining all natural pungency and nutrients. Approximately ₹300/litre.",
  variants: [
    { weight: "500ml", price: 160, mrp: 160, sku: "MO-500" },
    { weight: "1 Litre", price: 300, mrp: 300, sku: "MO-1L" },
    { weight: "5 Litres", price: 1400, mrp: 1400, sku: "MO-5L" },
  ],
  isActive: true,
  sortOrder: 12,
}
```

### 13. Cold Press Peanut Oil
```typescript
{
  name: "Cold Press Peanut Oil",
  nameHindi: "कोल्ड प्रेस मूंगफली तेल",
  slug: "cold-press-peanut-oil",
  subtitle: "Extra Virgin Groundnut Oil",
  category: "cold-press-oils",
  themeColor: "#92400E",
  description: "Pure groundnut oil extracted by cold wooden press — full of natural flavor, no chemical processing. Rich in monounsaturated fats and vitamin E.",
  variants: [
    { weight: "500ml", price: 200, mrp: 200, sku: "PO-500" },
    { weight: "1 Litre", price: 380, mrp: 380, sku: "PO-1L" },
  ],
  isActive: true,
  sortOrder: 13,
}
```

### 14. Cold Press Sesame Oil
```typescript
{
  name: "Cold Press Sesame Oil",
  nameHindi: "कोल्ड प्रेस तिल तेल",
  slug: "cold-press-sesame-oil",
  subtitle: "Til Ka Tel — Pure Cold Pressed",
  category: "cold-press-oils",
  themeColor: "#451A03",
  description: "Aromatic sesame (til) oil, cold-pressed to retain its distinctive nutty flavor. Rich in antioxidants and sesamin. Perfect for cooking and as a finishing oil.",
  variants: [
    { weight: "250ml", price: 130, mrp: 130, sku: "SO-250" },
    { weight: "500ml", price: 250, mrp: 250, sku: "SO-500" },
    { weight: "1 Litre", price: 480, mrp: 480, sku: "SO-1L" },
  ],
  isActive: true,
  sortOrder: 14,
}
```

### 15. Cold Press Coconut Oil
```typescript
{
  name: "Cold Press Coconut Oil",
  nameHindi: "कोल्ड प्रेस नारियल तेल",
  slug: "cold-press-coconut-oil",
  subtitle: "Virgin — Unrefined Natural",
  category: "cold-press-oils",
  themeColor: "#14532D",
  description: "Pure unrefined virgin coconut oil, cold-pressed from fresh coconuts. Rich in MCTs with natural coconut aroma. Use for cooking, haircare, and skincare.",
  variants: [
    { weight: "250ml", price: 110, mrp: 110, sku: "CO-250" },
    { weight: "500ml", price: 210, mrp: 210, sku: "CO-500" },
    { weight: "1 Litre", price: 420, mrp: 420, sku: "CO-1L" },
  ],
  isActive: true,
  sortOrder: 15,
}
```

---

## Masale & More

### 16. Special Tea Masala
```typescript
{
  name: "Special Tea Masala",
  nameHindi: "स्पेशल चाय मसाला",
  slug: "special-tea-masala",
  subtitle: "Colonel's Signature Chai Masala",
  category: "masale-more",
  themeColor: "#1C1917",
  description: "A carefully curated blend of whole spices including ginger, cardamom, cloves, cinnamon, and black pepper — ground fresh to make every cup of chai an experience.",
  variants: [
    { weight: "50g",  price: 89,  mrp: 89,  sku: "TM-50" },
    { weight: "100g", price: 149, mrp: 149, sku: "TM-100" },
    { weight: "250g", price: 349, mrp: 349, sku: "TM-250" },
  ],
  isActive: true,
  sortOrder: 16,
}
```

### 17. Organic Baked Rice Chips
```typescript
{
  name: "Organic Baked Rice Chips",
  nameHindi: "ऑर्गेनिक बेक्ड राइस चिप्स",
  slug: "organic-baked-rice-chips",
  subtitle: "Healthy Baked — Not Fried",
  category: "masale-more",
  badge: "Healthy",
  badgeColor: "#166534",
  themeColor: "#365314",
  description: "Light, crispy baked rice chips made from organic rice. No deep frying, no artificial flavors. A guilt-free snack with natural spice seasoning.",
  variants: [
    { weight: "100g", price: 79,  mrp: 79,  sku: "RC-100" },
    { weight: "200g", price: 149, mrp: 149, sku: "RC-200" },
  ],
  isActive: true,
  sortOrder: 17,
}
```

### 18. Achaar Ke Masale
```typescript
{
  name: "Achaar Ke Masale",
  nameHindi: "अचार के मसाले",
  slug: "achaar-ke-masale",
  subtitle: "Colonel's Special Pickle Spice Blend",
  category: "masale-more",
  themeColor: "#B91C1C",
  description: "Our proprietary 24-spice blend used in all Colonel's Pickle products — now available for home use. Make your own achaar with the same masala that goes into every jar we produce.",
  variants: [
    { weight: "100g", price: 129, mrp: 129, sku: "AKM-100" },
    { weight: "250g", price: 299, mrp: 299, sku: "AKM-250" },
    { weight: "500g", price: 549, mrp: 549, sku: "AKM-500" },
  ],
  isActive: true,
  sortOrder: 18,
}
```

---

## Key Ingredient Details (for About/Ingredients page)

```typescript
const PREMIUM_INGREDIENTS = [
  {
    name: "Afghani, Tajiki & Uzbegi Hing",
    nameHindi: "अफगानी, ताजिकी और उज्बेगी हींग",
    subtitle: "Premium Asafoetida",
    price: "~₹35,000/kg",
    detail: "The world's finest asafoetida, sourced directly from Central Asia. The quality of hing defines the character of every pickle.",
    color: "#166534",
  },
  {
    name: "Kachi Ghani Cold Press Mustard Oil",
    nameHindi: "कच्ची घानी सरसों तेल",
    subtitle: "Traditional Wooden Press Extraction",
    price: "~₹300/litre",
    detail: "Cold-pressed using traditional wooden ghani (press). Fully unrefined, preserving all natural pungency and nutrients. No chemical extraction ever.",
    color: "#92400E",
  },
  {
    name: "24 Exotic Whole Spices",
    nameHindi: "24 देशी मसाले",
    subtitle: "Sun-Dried, Roasted & Ground Fresh",
    detail: "Including Fenugreek Seeds (Methi Dana), Mustard Seeds (Sarson), Red Mustard Seeds (Lal Sarson), Fennel (Saunf), Cumin (Jeera), Coriander Seeds (Dhania), Nigella Seeds (Kalonji), Celery (Ajwain), Asafoetida (Hing), and Colonel's Special Spices.",
    color: "#B91C1C",
  },
  {
    name: "Rock Salt & Black Salt",
    nameHindi: "सेंधा नमक और काला नमक",
    subtitle: "Sendha Namak & Kala Namak",
    detail: "Only mineral-rich rock salt and digestion-friendly black salt are used. Never iodized table salt. This is a non-negotiable standard.",
    color: "#1E40AF",
  },
]
```

---

## Pricing Summary

| Product | 100g | 250g | 500g | 1kg |
|---|---|---|---|---|
| Chhuhara Adrak | ₹149 | ₹349 | ₹649 | ₹1,298 |
| Adrak Haldi Nimbu | ₹109 | ₹249 | ₹459 | ₹918 |
| Organic Gulkand | ₹149 | ₹299 | — | — |
| Dry Masala Aam | ₹119 | ₹269 | ₹499 | ₹949 |
| Lehsun Ka Achar | ₹119 | ₹269 | ₹499 | ₹949 |
| Nimbu Chatpata | ₹109 | ₹249 | ₹459 | — |
| Kaccha Mango | ₹109 | ₹249 | ₹459 | ₹899 |
| Bharwa Mirch | ₹129 | ₹289 | ₹529 | — |
| Kair Ka Achar | ₹149 | ₹349 | — | — |
| Kathal Ka Achar | ₹129 | ₹299 | ₹549 | — |
| Khatta Meetha Nimbu | ₹119 | ₹269 | — | — |
| Tea Masala | ₹89/50g | ₹149/100g | ₹349/250g | — |
| Rice Chips | ₹79/100g | ₹149/200g | — | — |
| Achaar Masale | ₹129 | ₹299 | ₹549 | — |

| Oil | 250ml | 500ml | 1 Litre | 5 Litres |
|---|---|---|---|---|
| Mustard Oil | — | ₹160 | ₹300 | ₹1,400 |
| Peanut Oil | — | ₹200 | ₹380 | — |
| Sesame Oil | ₹130 | ₹250 | ₹480 | — |
| Coconut Oil | ₹110 | ₹210 | ₹420 | — |

---

## Image Cloudinary Structure

```
colonels-pickle/
  products/
    chhuhara-adrak/
      jar-front.jpg       ← product label facing camera
      jar-side.jpg
      process-1.jpg       ← production photo
      process-2.jpg
    adrak-haldi-nimbu/
      jar-front.jpg
      ...
    organic-gulkand/
      jar-250g.jpg
      jar-100g.jpg
      roses.jpg           ← raw ingredient photo
    ...
  hero/
    hero-jar.jpg
    hero-production.jpg
  story/
    team-photo.jpg        ← team group photo from warehouse
    warehouse.jpg
  ingredients/
    hing.jpg
    mustard-oil.jpg
    spices.jpg
```

The client has 65+ product photos and 25 videos. Upload all to Cloudinary under the above structure.
Each product should have minimum: 1 primary jar photo + 1 process/ingredient photo.
