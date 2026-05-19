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
  // ── Achaar (jars) ──
  "adrak-ka-achar": { themeColor: "#78350F", nameHindi: "अदरक का अचार", icon: "🫚" },
  "chhuhara-adrak": { themeColor: "#7C2D12", nameHindi: "छुहारा अदरक", icon: "🫙", badge: "Bestseller", badgeColor: "#B45309" },
  "mixed-khatta-meetha": { themeColor: "#365314", nameHindi: "मिक्स खट्टा मीठा", icon: "🥗" },
  "nimbu-chatpata": { themeColor: "#713F12", nameHindi: "नींबू चटपटा", icon: "🍋" },
  "khatta-meetha-nimbu": { themeColor: "#78350F", nameHindi: "खट्टा मीठा नींबू", icon: "🍋" },
  "bharwa-lal-mirch": { themeColor: "#7F1D1D", nameHindi: "भरवां लाल मिर्च", icon: "🌶️", badge: "🌶 Spicy", badgeColor: "#B91C1C" },
  "aam-ka-achar": { themeColor: "#14532D", nameHindi: "आम का अचार", icon: "🥭", badge: "Summer Special", badgeColor: "#166534" },
  "dry-masala-aam": { themeColor: "#78350F", nameHindi: "ड्राई मसाला आम", icon: "🥭", badge: "Seasonal", badgeColor: "#B45309" },
  "amla-ka-achar": { themeColor: "#365314", nameHindi: "आंवला का अचार", icon: "🫐", badge: "Immunity Boost", badgeColor: "#166534" },
  "mixed-chatpata": { themeColor: "#713F12", nameHindi: "मिक्स चटपटा", icon: "🥣" },
  "kathal-ka-achar": { themeColor: "#365314", nameHindi: "कटहल का अचार", icon: "🌿" },
  "lasoda-achar": { themeColor: "#451A03", nameHindi: "लसोड़ा (गुंदा) अचार", icon: "🫙", badge: "Rare", badgeColor: "#B45309" },
  "tikhi-mirchi": { themeColor: "#14532D", nameHindi: "तीखी मिर्ची", icon: "🌶️", badge: "🌶 Very Spicy", badgeColor: "#B91C1C" },
  "lehsun-ka-achar": { themeColor: "#991B1B", nameHindi: "लहसुन का अचार", icon: "🧄" },
  "bharwa-bhajiya": { themeColor: "#365314", nameHindi: "भरवां भजिया", icon: "🫛" },
  "adrak-haldi-nimbu": { themeColor: "#713F12", nameHindi: "अदरक हल्दी नींबू", icon: "🌿", badge: "New", badgeColor: "#166534" },

  // ── Organic & More ──
  "organic-gulkand": { themeColor: "#9D174D", nameHindi: "गुलकंद", icon: "🌹", badge: "Organic", badgeColor: "#166534" },
  "organic-rice-chips": { themeColor: "#92400E", nameHindi: "राइस चिप्स", icon: "🍘", badge: "Snack", badgeColor: "#B45309" },

  // ── Masala (pouches) ──
  "bharwa-lal-mirch-masala": { themeColor: "#7F1D1D", nameHindi: "भरवां लाल मिर्च अचार मसाला", icon: "🌶️" },
  "tikhi-hari-mirch-masala": { themeColor: "#14532D", nameHindi: "तीखी हरी मिर्च अचार मसाला", icon: "🌿" },
  "kathal-ka-masala": { themeColor: "#365314", nameHindi: "कटहल का अचार मसाला", icon: "🫙" },
  "aam-ka-masala": { themeColor: "#78350F", nameHindi: "आम का अचार मसाला", icon: "🥭" },
  "lehsun-ka-masala": { themeColor: "#991B1B", nameHindi: "लहसुन का अचार मसाला", icon: "🧄" },
  "chai-ka-masala": { themeColor: "#1C1917", nameHindi: "चाय का मसाला", icon: "☕" },
};

export function getProductTheme(slug?: string): ProductTheme {
  if (!slug) return DEFAULT_THEME;
  return PRODUCT_THEME_MAP[slug] ?? DEFAULT_THEME;
}
