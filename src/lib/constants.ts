// Application Constants

export const SITE_NAME = "Colonel's Pickle";
export const SITE_DESCRIPTION = "Maa Ka Pyaar, Ghar Ka Achar — authentic homemade pickles, cold press oils & natural products.";

// Brand
export const BRAND = {
  name: "Colonel's Pickle",
  nameFull: "Colonel's Pickle® by Ridhwika Agro Organics",
  tagline: "Maa Ka Pyaar, Ghar Ka Achar",
  taglineHindi: "माँ का प्यार, घर का अचार",
  fssai: "12226026000060",
  address: {
    line1: "B-6/374, Vaishali Nagar",
    line2: "",
    city: "Jaipur",
    state: "Rajasthan",
    pin: "302020",
  },
  phones: ["9717243306", "9416845689", "9350406289"],
  email: "colonelspickle@proton.me",
  instagram: {
    handle: "@colonels.pickle",
    url: "https://instagram.com/colonels.pickle",
  },
  social: {
    beacons: "https://beacons.ai/colonelspickle",
    gmaps: "https://maps.app.goo.gl/FCraoQErzuMnHLBz9",
  },
  certifications: ["FSSAI", "Udyam", "Trademark", "GST"],
  usp: [
    "No Artificial Preservatives",
    "No Artificial Colours or Flavours",
    "24 Exotic Whole Spices",
    "Kachi Ghani Cold Press Mustard Oil",
    "Rock Salt & Black Salt Only",
    "Afghani Hing (₹30,000/kg)",
    "Traditional Mother's Recipe",
    "FSSAI Certified",
  ],
} as const;

/**
 * Official government registrations — verified against the client's certificate PDFs.
 * Displayed in the footer + the homepage "Verified Authentic" trust section so
 * customers can independently confirm the brand's legitimacy.
 */
export const REGISTRATIONS = [
  {
    key: "fssai",
    icon: "🛡️",
    label: "FSSAI Licensed",
    fullName: "Food Safety & Standards Authority of India",
    number: "12226026000060",
    detail: "State License · valid till 12 Jan 2027",
    // Shown as a public trust badge (footer/homepage/about); safe to display everywhere.
    publicTrust: true,
  },
  {
    key: "udyam",
    icon: "🏛️",
    label: "Udyam Registered",
    fullName: "Ministry of MSME · Udyam Registration",
    number: "UDYAM-RJ-17-0307560",
    detail: "Registered Micro Enterprise (Manufacturing)",
    // Legal/company detail — shown only on the Terms & Conditions page, not as sitewide decoration.
    publicTrust: false,
  },
  {
    key: "trademark",
    icon: "®️",
    label: "Trademark Registered",
    fullName: "Trade Marks Registry, Govt. of India",
    number: "6202243",
    detail: "Registered Trademark · Class 29 (Pickles)",
    publicTrust: true,
  },
  {
    key: "gst",
    icon: "🧾",
    label: "GST Registered",
    fullName: "Goods & Services Tax · Govt. of India",
    number: "08BFKPD8446R1ZM",
    detail: "GSTIN · Rajasthan",
    // Legal/company detail — shown only on the Terms & Conditions page (and invoices), not as sitewide decoration.
    publicTrust: false,
  },
] as const;

/** Subset of REGISTRATIONS safe to show as sitewide trust badges (footer/homepage/about). */
export const PUBLIC_REGISTRATIONS = REGISTRATIONS.filter((r) => r.publicTrust);

// Product Categories
export const PRODUCT_CATEGORIES = [
  "Achaar",
  "Cold Press Oils",
  "Gulkand",
  "Masale & More",
] as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const RECIPES_PER_PAGE = 9;

// Currency
export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";

// Shipping — single sitewide free-delivery threshold (pan-India)
export const FREE_DELIVERY_THRESHOLD = 999;
export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_COST = 49;

// Product Review
export const MAX_REVIEW_LENGTH = 500;
export const MIN_REVIEW_LENGTH = 10;

// Image Sizes
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 200, height: 200 },
  SMALL: { width: 400, height: 400 },
  MEDIUM: { width: 800, height: 800 },
  LARGE: { width: 1200, height: 1200 },
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://beacons.ai/colonelspickle",
  INSTAGRAM: "https://beacons.ai/colonelspickle",
  TWITTER: "https://beacons.ai/colonelspickle",
};

// Contact Info
export const CONTACT_EMAIL = "colonelspickle@proton.me";
export const CONTACT_PHONE = "+91-9717243306";

// Admin & storage — env-driven (first address in ADMIN_EMAIL); business email as safe fallback
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.split(",")[0]?.trim() || "ridhwika.agro.organics@gmail.com";
export const CART_STORAGE_KEY = "cp-cart-storage";

// Announcement bar (marquee) items
export const ANNOUNCEMENTS = [
  "🌿 No Artificial Preservatives · No Chemicals · No Vinegar",
  "🛡️ FSSAI Licensed · Trademark® Registered",
  "🫙 15+ Authentic Varieties",
  "🚚 Free Delivery on Orders ₹999+ · Pan India",
  "📞 +91 9350406289",
  "🌶️ Afghani · Tajikistani · Uzbeki Hing",
  "📦 Min Order: 6×100g or 2×250g Jars",
  "🎖️ Made with pride by the mother of an Indian Army Colonel",
] as const;

// Promotional offers
export const OFFERS = {
  bulk1kg: "Buy 1kg Get 15% Discount",
  bulk5kg: "Buy 5kg Get 20% Discount",
  freeDelivery: "Free delivery, pan-India, on orders above ₹999",
} as const;

// Minimum order quantities (units) by jar size
export const MIN_ORDER = {
  jar100g: 6,
  jar250g: 2,
} as const;

// External links
export const WHATSAPP_URL = "https://wa.me/919350406289";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/FCraoQErzuMnHLBz9";
export const INSTAGRAM_URL = "https://instagram.com/colonels.pickle";
export const BEACONS_URL = "https://beacons.ai/colonelspickle";

// Bank Details for UPI QR Code and Invoice Display
export const BANK_DETAILS = {
  accountName: 'RIDHWIKA AGRO ORGANICS',
  bankName: 'State Bank of India',
  branch: 'SBI Shivgyan Enclave, Nirman Nagar, Jaipur, Rajasthan – 302019',
  accountNumber: '42855337064',
  ifsc: 'SBIN0032054',
  upiId: '9717243306@ptsbi',
} as const;
