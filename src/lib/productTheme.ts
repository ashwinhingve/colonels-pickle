// Frontend-only visual theming for product cards.
// The Mongoose Product model does not store card colours, Hindi names, or
// emoji icons, so this map supplies them keyed by product slug. Backend stays
// untouched; unknown slugs fall back to DEFAULT_THEME.

export interface ProductTheme {
  themeColor: string;
  nameHindi: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

export const DEFAULT_THEME: ProductTheme = {
  themeColor: "#B91C1C",
  nameHindi: "",
  icon: "🫙",
};

export const PRODUCT_THEME_MAP: Record<string, ProductTheme> = {
  "chhuhara-adrak": { themeColor: "#7C2D12", nameHindi: "छुहारा अदरक", icon: "🫚", badge: "Bestseller", badgeColor: "#B45309" },
  "adrak-haldi-nimbu": { themeColor: "#713F12", nameHindi: "अदरक हल्दी नींबू", icon: "🫚", badge: "New", badgeColor: "#166534" },
  "organic-gulkand": { themeColor: "#831843", nameHindi: "ऑर्गेनिक गुलकंद", icon: "🌹", badge: "Organic", badgeColor: "#9D174D" },
  "dry-masala-aam": { themeColor: "#78350F", nameHindi: "सूखा मसाला आम", icon: "🥭", badge: "Seasonal", badgeColor: "#B45309" },
  "lehsun-ka-achar": { themeColor: "#991B1B", nameHindi: "लहसुन का अचार", icon: "🧄" },
  "nimbu-chatpata": { themeColor: "#713F12", nameHindi: "नींबू चटपटा", icon: "🍋" },
  "kaccha-mango": { themeColor: "#14532D", nameHindi: "कच्चा मैंगो अचार", icon: "🥭", badge: "Summer Special", badgeColor: "#166534" },
  "bharwa-mirch": { themeColor: "#7F1D1D", nameHindi: "भरवां मिर्च", icon: "🌶️", badge: "🌶 Spicy", badgeColor: "#B91C1C" },
  "kair-ka-achar": { themeColor: "#451A03", nameHindi: "कैर का अचार", icon: "🫐", badge: "Rare", badgeColor: "#B45309" },
  "kathal-ka-achar": { themeColor: "#365314", nameHindi: "कटहल का अचार", icon: "🟢" },
  "khatta-meetha-nimbu": { themeColor: "#713F12", nameHindi: "खट्टा मीठा नींबू", icon: "🍋" },
  "cold-press-mustard-oil": { themeColor: "#78350F", nameHindi: "कोल्ड प्रेस सरसों तेल", icon: "🫗", badge: "Pure", badgeColor: "#B45309" },
  "cold-press-peanut-oil": { themeColor: "#92400E", nameHindi: "कोल्ड प्रेस मूंगफली तेल", icon: "🥜" },
  "cold-press-sesame-oil": { themeColor: "#451A03", nameHindi: "कोल्ड प्रेस तिल तेल", icon: "🫗" },
  "cold-press-coconut-oil": { themeColor: "#14532D", nameHindi: "कोल्ड प्रेस नारियल तेल", icon: "🥥" },
  "special-tea-masala": { themeColor: "#1C1917", nameHindi: "स्पेशल चाय मसाला", icon: "🍵" },
  "organic-baked-rice-chips": { themeColor: "#365314", nameHindi: "ऑर्गेनिक बेक्ड राइस चिप्स", icon: "🍘", badge: "Healthy", badgeColor: "#166534" },
  "achaar-ke-masale": { themeColor: "#B91C1C", nameHindi: "अचार के मसाले", icon: "🥄" },
};

export function getProductTheme(slug?: string): ProductTheme {
  if (!slug) return DEFAULT_THEME;
  return PRODUCT_THEME_MAP[slug] ?? DEFAULT_THEME;
}
