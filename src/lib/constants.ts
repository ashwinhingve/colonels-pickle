// Application Constants

export const SITE_NAME = "Colonel's Pickle";
export const SITE_DESCRIPTION = "Maa Ka Pyaar, Ghar Ka Achar — authentic homemade pickles, cold press oils & natural products.";

// Brand
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
} as const;

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

// Shipping
export const FREE_DELIVERY_THRESHOLD = 499;
export const FREE_SHIPPING_THRESHOLD = 499;
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
export const CONTACT_EMAIL = "colonelspickle@gmail.com";
export const CONTACT_PHONE = "+91-9717243306";

// Admin & storage
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "colonelspickle@gmail.com";
export const CART_STORAGE_KEY = "cp-cart-storage";

// Announcement bar (marquee) items
export const ANNOUNCEMENTS = [
  "🌿 No Artificial Preservatives",
  "⭐ FSSAI Certified",
  "🫙 15+ Authentic Varieties",
  "🚚 Pan India Delivery",
  "💰 Free Delivery on Orders ₹499+",
  "📞 +91 9717243306",
] as const;
