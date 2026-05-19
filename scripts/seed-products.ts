import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Product from '../src/models/Product';
import Category from '../src/models/Category';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

/**
 * Seed the official Colonel's Pickle catalogue.
 *
 * Card visuals (colour / Hindi name / badge) live in the frontend map
 * `src/lib/productTheme.ts` keyed by slug — the Mongoose model is frozen, so
 * only true schema fields are written here.
 *
 * Usage: npx tsx scripts/seed-products.ts
 */

interface SeedVariant {
  weight: string;
  price: number;
}

interface SeedProduct {
  name: string;
  slug: string;
  subtitle: string;
  category: 'achaar' | 'masala' | 'oils';
  isFeatured: boolean;
  noPreservatives: boolean;
  variants: SeedVariant[];
  ingredients: string;
}

const categoriesData = [
  { name: 'Achaar Collection', slug: 'achaar', order: 1, isActive: true },
  { name: 'Achaar Masale', slug: 'masala', order: 2, isActive: true },
  { name: 'Cold Press Oils', slug: 'oils', order: 3, isActive: true },
];

const JAR_V = (a: number, b: number, c: number, d: number): SeedVariant[] => [
  { weight: '100g', price: a },
  { weight: '250g', price: b },
  { weight: '500g', price: c },
  { weight: '1kg', price: d },
];

const POUCH_V = (a: number, b: number, c: number): SeedVariant[] => [
  { weight: '100g', price: a },
  { weight: '250g', price: b },
  { weight: '500g', price: c },
];

const seedData: SeedProduct[] = [
  // ── ACHAAR (jars) ──
  {
    name: 'Adrak Ka Achar', slug: 'adrak-ka-achar', subtitle: 'Fresh Ginger Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Ginger (Adrak) processed with 15-17 spices including Cumin, Rock Salt, Coriander Seeds, Black Pepper, Red Chilli Powder, Asafoetida, Turmeric, Mango Powder, Red Mustard Seeds, Yellow Mustard Seeds, Colonel's Spl. Spices",
  },
  {
    name: 'Chhuhara Adrak', slug: 'chhuhara-adrak', subtitle: 'Dry Ginger & Date Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(149, 349, 649, 1298),
    ingredients:
      'Fresh Ginger (Adrak), Dry Dates (Chhuhara), Fresh Lime Juice processed with Fennel (Saunf), Black Pepper Powder, Black Salt, Asafoetida (Afghani Hing), Rock Salt, Jaggery Mix',
  },
  {
    name: 'Mixed Khatta Meetha', slug: 'mixed-khatta-meetha', subtitle: 'Mixed Sweet & Sour Pickle',
    category: 'achaar', isFeatured: false, noPreservatives: true, variants: JAR_V(99, 229, 439, 878),
    ingredients:
      "Fresh Carrot, Fresh Raddish, Fresh Cauliflower, Fresh Green Chilly, Fresh Ginger, Fresh Raw Turmeric, Lotus Stem, Fresh Lemon processed with 15-17 spices: Cumin, Celery, Fennel, Fenugreek Seeds, Red Chilli Powder, Asafoetida, Yellow Mustard Seeds, Rock Salt, Colonel's Spl Spices, Jaggery Mix",
  },
  {
    name: 'Nimbu Chatpata', slug: 'nimbu-chatpata', subtitle: 'Tangy Lemon Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Lemon (Nimbu) processed with 10-12 spices: Cumin, Dry Ginger, Celery, Nigella Seeds, Fennel, Hot Spices, Red Pepper Powder, Black Pepper Powder, Black Salt, Asafoetida (Afghani Hing), Rock Salt, Colonel's Spl-Spices, Jaggery Mix",
  },
  {
    name: 'Khatta Meetha Nimbu', slug: 'khatta-meetha-nimbu', subtitle: 'Sweet & Sour Lemon Pickle',
    category: 'achaar', isFeatured: false, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Lemon processed with 10-12 spices: Cumin, Dry Ginger, Celery, Nigella Seeds, Fennel, Hot Spices, Red Pepper Powder, Black Pepper Powder, Black Salt, Asafoetida, Rock Salt, Colonel's Spl. Spices, Jaggery Mix",
  },
  {
    name: 'Bharwa Lal Mirch', slug: 'bharwa-lal-mirch', subtitle: 'Stuffed Red Chilli Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Coarse Red Chilly processed with 15-17 spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Fennel, Cumin, Coriander Seeds, Nigella Seeds, Celery, Asafoetida, Turmeric, Rock Salt, Mango Powder, Colonel's Spl Spices, Yellow Mustard Seeds",
  },
  {
    name: 'Aam Ka Achar', slug: 'aam-ka-achar', subtitle: 'Raw Mango Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Unripe Mango (Kacchi Ambi) processed with 15-17 spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Celery, Fennel, Cumin, Nigella Seeds, Asafoetida, Turmeric, Rock Salt, Colonel's Spl & Spices, Red Chilli Powder, Yellow Mustard Seeds",
  },
  {
    name: 'Dry Masala Aam', slug: 'dry-masala-aam', subtitle: 'Dry Mango Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Unripe Mango processed with 15-17 spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Fennel, Cumin, Nigella Seeds, Asafoetida, Turmeric, Diggi Mirch, Rock Salt, Colonel's Spl. Spices, Red Chilli Powder, Yellow Mustard Seeds",
  },
  {
    name: 'Amla Ka Achar', slug: 'amla-ka-achar', subtitle: 'Indian Gooseberry Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(99, 229, 439, 878),
    ingredients:
      "Amla (Indian Gooseberry), Fresh Ginger, Fresh Raw Turmeric processed with 15-17 spices: Cumin, Celery, Fennel, Fenugreek Seeds, Yellow Mustard Seeds, Rock Salt, Nigella Seeds, Diggi Mirch, Asafoetida, Colonel's Spl. Spices, Red Chilli Powder",
  },
  {
    name: 'Mixed Chatpata', slug: 'mixed-chatpata', subtitle: 'Mixed Tangy Pickle',
    category: 'achaar', isFeatured: false, noPreservatives: true, variants: JAR_V(99, 229, 439, 878),
    ingredients:
      "Fresh Carrot, Fresh Raddish, Fresh Cauliflower, Fresh Green Chilly, Fresh Ginger, Fresh Raw Turmeric, Lotus Stem, Fresh Lemon processed with 15-17 spices: Cumin, Celery, Fennel, Fenugreek Seeds, Asafoetida, Yellow Mustard Seeds, Rock Salt, Colonel's Spl. Spices, Red Chilli Powder",
  },
  {
    name: 'Kathal Ka Achar', slug: 'kathal-ka-achar', subtitle: 'Jackfruit Pickle',
    category: 'achaar', isFeatured: false, noPreservatives: true, variants: JAR_V(119, 289, 559, 1118),
    ingredients:
      "Fresh Unriped Jack Fruit processed with 15-17 spices: Cumin, Rock Salt, Coriander Seeds, Black Pepper, Red Chilli Powder, Diggi Mirch, Colonel's Spl-Spices, Turmeric, Asafoetida, Mango Powder, Red Mustard Seeds, Yellow Mustard Seeds",
  },
  {
    name: 'Lasoda Achar', slug: 'lasoda-achar', subtitle: 'Indian Glue Berry Pickle',
    category: 'achaar', isFeatured: false, noPreservatives: true, variants: JAR_V(99, 229, 439, 878),
    ingredients:
      "Lasoda (Indian Glue Berry) processed in 15-17 spices: Cumin, Nigella Seeds, Celery, Fennel, Fenugreek Seeds, Yellow Mustard Seeds, Rock Salt, Asafoetida, Diggi Mirch, Colonel's Spl. Spices, Red Chilli Powder",
  },
  {
    name: 'Tikhi Mirchi', slug: 'tikhi-mirchi', subtitle: 'Spicy Green Chilli Pickle',
    category: 'achaar', isFeatured: false, noPreservatives: true, variants: JAR_V(99, 229, 439, 878),
    ingredients:
      "Fresh Green Chilly processed with 15-17 spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Fennel, Cumin, Coriander Seeds, Rock Salt, Asafoetida, Nigella Seeds, Celery, Colonel's Spl Spices, Yellow Mustard Seeds",
  },
  {
    name: 'Lehsun Ka Achar', slug: 'lehsun-ka-achar', subtitle: 'Garlic Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(119, 289, 559, 1118),
    ingredients:
      "Fresh Garlic with Large Cloves processed with 15-17 spices: Cumin, Rock Salt, Coriander Seeds, Black Pepper, Red Chilli Powder, Diggi Mirch, Colonel's Spl-Spices, Turmeric, Asafoetida, Mango Powder, Red Mustard Seeds, Yellow Mustard Seeds",
  },
  {
    name: 'Bharwa Bhajiya', slug: 'bharwa-bhajiya', subtitle: 'Stuffed Banana Pepper Pickle',
    category: 'achaar', isFeatured: false, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Banana Pepper (Moti Hari Mirch) processed with 15-17 spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Fennel, Yellow Mustard Seeds, Cumin, Coriander Seeds, Nigella Seeds, Celery, Asafoetida, Turmeric, Rock Salt, Mango Powder, Colonel's Spl. Spices",
  },
  {
    name: 'Adrak Haldi Nimbu', slug: 'adrak-haldi-nimbu', subtitle: 'Ginger Turmeric Lemon Pickle',
    category: 'achaar', isFeatured: true, noPreservatives: true, variants: JAR_V(109, 249, 459, 918),
    ingredients:
      "Fresh Ginger, Fresh Raw Turmeric, Fresh Lemon, Fresh Green Chilly processed with 15-17 spices: Cumin, Nigella Seeds, Celery, Fennel, Fenugreek Seeds, Yellow Mustard Seeds, Red Chilli Powder, Asafoetida (Afghani Hing), Rock Salt, Colonel's Spl. Spices",
  },

  // ── MASALA (pouches) ──
  {
    name: 'Bharwa Lal Mirch Masala', slug: 'bharwa-lal-mirch-masala', subtitle: 'Stuffed Red Chilli Pickle Spice Mix',
    category: 'masala', isFeatured: false, noPreservatives: false, variants: POUCH_V(99, 229, 439),
    ingredients:
      "24 Spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Fennel, Cumin, Coriander Seeds, Nigella Seeds, Celery, Asafoetida, Turmeric, Rock Salt, Mango Powder, Colonel's Spl-spices, Yellow Mustard Seeds. Traditional Mother's Recipe. Whole spices dried and grinded at home.",
  },
  {
    name: 'Tikhi Hari Mirch Masala', slug: 'tikhi-hari-mirch-masala', subtitle: 'Spicy Green Chilli Pickle Spice Mix',
    category: 'masala', isFeatured: false, noPreservatives: false, variants: POUCH_V(99, 229, 439),
    ingredients:
      "24 Spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Fennel, Cumin, Coriander Seeds, Rock Salt, Asafoetida, Nigella Seeds, Celery, Colonel's Spl-spices, Yellow Mustard Seeds. Traditional Mother's Recipe.",
  },
  {
    name: 'Kathal Ka Masala', slug: 'kathal-ka-masala', subtitle: 'Jackfruit Pickle Spice Mix',
    category: 'masala', isFeatured: false, noPreservatives: false, variants: POUCH_V(99, 229, 439),
    ingredients:
      "24 Spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Celery, Fennel, Cumin, Nigella Seeds, Asafoetida, Turmeric, Rock Salt, Colonel's Spl-spices, Red Chilli Powder, Yellow Mustard Seeds. Traditional Mother's Recipe.",
  },
  {
    name: 'Aam Ka Masala', slug: 'aam-ka-masala', subtitle: 'Mango Pickle Spice Mix',
    category: 'masala', isFeatured: false, noPreservatives: false, variants: POUCH_V(99, 229, 439),
    ingredients:
      "24 Spices: Fenugreek Seeds, Mustard Seeds, Red Mustard Seeds, Celery, Fennel, Cumin, Nigella Seeds, Asafoetida, Turmeric, Rock Salt, Colonel's Spl-spices, Red Chilli Powder, Yellow Mustard Seeds. Traditional Mother's Recipe.",
  },
  {
    name: 'Lehsun Ka Masala', slug: 'lehsun-ka-masala', subtitle: 'Garlic Pickle Spice Mix',
    category: 'masala', isFeatured: false, noPreservatives: false, variants: POUCH_V(99, 229, 439),
    ingredients:
      "24 Spices: Cumin, Rock Salt, Coriander Seeds, Black Pepper, Red Chilli Powder, Diggi Mirch, Colonel's Spl-spices, Turmeric, Asafoetida, Mango Powder, Red Mustard Seeds, Yellow Mustard Seeds. Traditional Mother's Recipe.",
  },
  {
    name: 'Chai Ka Masala', slug: 'chai-ka-masala', subtitle: "Colonel's Signature Chai Masala",
    category: 'masala', isFeatured: false, noPreservatives: false,
    variants: [
      { weight: '50g', price: 79 },
      { weight: '100g', price: 149 },
      { weight: '250g', price: 299 },
    ],
    ingredients:
      "Ginger Powder (Saunth), Cinnamon (Dalchini), Cardamom (Elaichi), Fennel Seeds (Saunf), Clove (Laung), Black Pepper (Kali Mirch), Black Cardamom (Kali Elaichi), Nutmeg (Jaifal). Traditional Mother's Recipe.",
  },
];

function skuFor(slug: string): string {
  return `CP-${slug.toUpperCase()}`;
}

function weightNorm(weight: string): string {
  return weight.replace(/[^a-z0-9]/gi, '').toUpperCase();
}

function toProductDoc(p: SeedProduct) {
  const productSku = skuFor(p.slug);
  const variants = p.variants.map((v) => ({
    id: `${p.slug}-${weightNorm(v.weight)}`.toLowerCase(),
    name: v.weight,
    sku: `${productSku}-${weightNorm(v.weight)}`,
    price: v.price,
    stock: 100,
    isActive: true,
  }));

  const specifications = [
    { key: 'Ingredients', value: p.ingredients, order: 0 },
  ];
  if (p.noPreservatives) {
    specifications.push({ key: 'No Preservatives', value: 'Yes', order: 1 });
  }

  return {
    name: p.name,
    slug: p.slug,
    sku: productSku,
    description: `${p.subtitle}. Ingredients: ${p.ingredients}`,
    shortDescription: p.subtitle,
    category: p.category,
    price: p.variants[0].price,
    stock: 100,
    images: [],
    tags: [p.category, ...p.name.toLowerCase().split(' ')],
    specifications,
    variants,
    hasVariants: true,
    isActive: true,
    isFeatured: p.isFeatured,
    seo: {
      metaTitle: p.name,
      metaDescription: p.subtitle,
      keywords: [p.name, p.category, 'colonels pickle'],
    },
  };
}

async function run() {
  try {
    console.log("🚀 Seeding the official Colonel's Pickle catalogue...\n");

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set. Check .env.local');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    await Category.deleteMany({});
    await Category.insertMany(categoriesData);
    console.log(`🗂️  Categories seeded: ${categoriesData.length}`);

    await Product.deleteMany({});
    const docs = seedData.map(toProductDoc);
    await Product.insertMany(docs);

    const total = await Product.countDocuments({ isActive: true });
    const featured = await Product.countDocuments({ isActive: true, isFeatured: true });

    console.log('\n📊 Seed Summary:');
    console.log(`   📦 Products inserted: ${docs.length}`);
    console.log(`   ⭐ Featured: ${featured}`);
    console.log(`   ✅ Active products in DB: ${total}\n`);
    console.log('✅ Seeding completed!');
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

run();
