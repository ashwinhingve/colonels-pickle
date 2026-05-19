import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Product from '../src/models/Product';
import Category from '../src/models/Category';

// Idempotent insert of the two "Organic & More" SKUs (Gulkand, Rice Chips)
// that were missing from the catalogue. Does NOT wipe data — safe to re-run.
// Mirrors the doc shape produced by scripts/seed-products.ts -> toProductDoc.
//
// Usage: npx tsx scripts/add-extra-products.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

interface SeedVariant {
  weight: string;
  price: number;
}
interface SeedProduct {
  name: string;
  slug: string;
  subtitle: string;
  category: string;
  isFeatured: boolean;
  noPreservatives: boolean;
  variants: SeedVariant[];
  ingredients: string;
}

const extraCategory = {
  name: 'Organic & More',
  slug: 'organic',
  order: 4,
  isActive: true,
};

const extraProducts: SeedProduct[] = [
  {
    name: 'Organic Gulkand',
    slug: 'organic-gulkand',
    subtitle: 'Homemade Rose Petal Preserve',
    category: 'organic',
    isFeatured: true,
    noPreservatives: true,
    variants: [
      { weight: '250g', price: 199 },
      { weight: '500g', price: 379 },
    ],
    ingredients:
      "Fresh Rose Petals (Gulab Pankhuri), Organic Sugar / Mishri, Honey, Cardamom (Elaichi). Sun-cooked the traditional way, no artificial colours or preservatives.",
  },
  {
    name: 'Organic Rice Chips',
    slug: 'organic-rice-chips',
    subtitle: 'Crunchy Rice Snack — Achari Mango & Cream & Onion',
    category: 'organic',
    isFeatured: false,
    noPreservatives: true,
    variants: [
      { weight: '60g', price: 49 },
      { weight: '120g', price: 89 },
    ],
    ingredients:
      "Organic Rice, Edible Vegetable Oil, Iodized Salt, Spices & Condiments (Achari Mango / Cream & Onion seasoning). No artificial preservatives.",
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
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not set. Check .env.local');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const catRes = await Category.updateOne(
      { slug: extraCategory.slug },
      { $setOnInsert: extraCategory },
      { upsert: true }
    );
    console.log(
      catRes.upsertedCount
        ? `🗂️  Category created: ${extraCategory.slug}`
        : `🗂️  Category already present: ${extraCategory.slug}`
    );

    for (const p of extraProducts) {
      const existing = await Product.findOne({ slug: p.slug });
      if (existing) {
        console.log(`• ${p.slug} already exists — left untouched`);
        continue;
      }
      await Product.create(toProductDoc(p));
      console.log(`✓ ${p.slug} inserted`);
    }

    const total = await Product.countDocuments({ isActive: true });
    console.log(`\n📊 Active products in DB: ${total}`);
    console.log('✅ Done.');
  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

run();
