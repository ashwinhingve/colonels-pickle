import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';
import mongoose from 'mongoose';
import Product from '../src/models/Product';

/**
 * Non-destructive price reconciliation to the authoritative CRM "Prices" sheet.
 *
 * - Updates ONLY variant prices + the top-level price of the 14 unambiguous
 *   4-tier achaar jars that map 1:1 to the CRM sheet (100g/250g/500g/1kg).
 * - Renames "Tikhi Mirchi" -> "Tikhi Hari Mirchi" to match the CRM name
 *   (slug/SKU left unchanged so URLs & links stay valid).
 * - Adds "Kair Ka Achar" as a HIDDEN draft (isActive:false) if absent.
 * - Never deletes or re-inserts products, so _id references from orders /
 *   reviews / wishlist remain intact.
 * - Products NOT covered by the CRM sheet (masalas, rice chips, Gulkand,
 *   oils, Adrak Ka Achar, Mixed Khatta Meetha) are intentionally left as-is
 *   and reported in the checklist — no guessing on their prices.
 *
 * Writes an audit log (before -> after) to scratchpad.
 *
 * Usage: npx tsx scripts/reconcile-prices.ts
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

type Tiers = Record<string, number>; // weight label -> price

interface Target {
  slug: string;
  name?: string; // set only when renaming
  tiers: Tiers; // must match existing variant.name labels exactly
}

// CRM Prices sheet (authoritative). All are 4-tier jars: 100g/250g/500g/1kg.
const STD: Tiers = { '100g': 109, '250g': 249, '500g': 459, '1kg': 899 };
const MID: Tiers = { '100g': 119, '250g': 289, '500g': 559, '1kg': 1099 };
const PREMIUM: Tiers = { '100g': 199, '250g': 449, '500g': 879, '1kg': 1729 };

const TARGETS: Target[] = [
  { slug: 'aam-ka-achar', tiers: STD },
  { slug: 'adrak-haldi-nimbu', tiers: STD },
  { slug: 'amla-ka-achar', tiers: STD },
  { slug: 'bharwa-bhajiya', tiers: STD },
  { slug: 'bharwa-lal-mirch', tiers: STD },
  { slug: 'chhuhara-adrak', tiers: PREMIUM },
  { slug: 'dry-masala-aam', tiers: STD },
  { slug: 'kathal-ka-achar', tiers: MID },
  { slug: 'khatta-meetha-nimbu', tiers: STD },
  { slug: 'lasoda-achar', tiers: STD },
  { slug: 'lehsun-ka-achar', tiers: MID },
  { slug: 'mixed-chatpata', tiers: STD },
  { slug: 'nimbu-chatpata', tiers: STD },
  { slug: 'tikhi-mirchi', name: 'Tikhi Hari Mirchi', tiers: STD },
];

// Kair Ka Achar — added HIDDEN (isActive:false) until client confirms.
const KAIR = {
  name: 'Kair Ka Achar',
  slug: 'kair-ka-achar',
  sku: 'CP-KAIR-KA-ACHAR',
  description:
    'Kair Ka Achar (Rajasthani Desert Berry Pickle). Draft — pending confirmation of availability, ingredients and images.',
  shortDescription: 'Rajasthani Desert Berry Pickle',
  category: 'achaar',
  price: 199,
  stock: 100,
  images: [],
  tags: ['achaar', 'kair', 'ka', 'achar'],
  specifications: [{ key: 'No Preservatives', value: 'Yes', order: 0 }],
  variants: [
    { id: 'kair-ka-achar-100g', name: '100g', sku: 'CP-KAIR-KA-ACHAR-100G', price: 199, stock: 100, isActive: true },
    { id: 'kair-ka-achar-250g', name: '250g', sku: 'CP-KAIR-KA-ACHAR-250G', price: 449, stock: 100, isActive: true },
    { id: 'kair-ka-achar-500g', name: '500g', sku: 'CP-KAIR-KA-ACHAR-500G', price: 879, stock: 100, isActive: true },
    { id: 'kair-ka-achar-1kg', name: '1kg', sku: 'CP-KAIR-KA-ACHAR-1KG', price: 1729, stock: 100, isActive: true },
  ],
  hasVariants: true,
  isActive: false, // HIDDEN draft
  isFeatured: false,
  seo: { metaTitle: 'Kair Ka Achar', metaDescription: 'Rajasthani Desert Berry Pickle', keywords: ['kair ka achar', 'achaar', 'colonels pickle'] },
};

async function run() {
  const audit: any[] = [];
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not set. Check .env.local');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    for (const t of TARGETS) {
      const p: any = await Product.findOne({ slug: t.slug });
      if (!p) {
        console.log(`⚠️  NOT FOUND: ${t.slug} — skipped`);
        audit.push({ slug: t.slug, status: 'not_found' });
        continue;
      }
      const before = {
        name: p.name,
        price: p.price,
        variants: p.variants.map((v: any) => ({ name: v.name, price: v.price })),
      };

      let changed = false;
      // update variant prices by weight label
      for (const v of p.variants) {
        const target = t.tiers[v.name];
        if (typeof target === 'number' && v.price !== target) {
          v.price = target;
          changed = true;
        }
      }
      // top-level price = 100g tier (fallback: first variant)
      const newTop = t.tiers['100g'] ?? p.variants[0]?.price;
      if (typeof newTop === 'number' && p.price !== newTop) {
        p.price = newTop;
        changed = true;
      }
      // rename if requested
      if (t.name && p.name !== t.name) {
        p.name = t.name;
        changed = true;
      }

      if (changed) {
        p.markModified('variants');
        await p.save();
        console.log(`✓ ${t.slug} updated`);
      } else {
        console.log(`• ${t.slug} already correct`);
      }
      audit.push({
        slug: t.slug,
        status: changed ? 'updated' : 'unchanged',
        before,
        after: {
          name: p.name,
          price: p.price,
          variants: p.variants.map((v: any) => ({ name: v.name, price: v.price })),
        },
      });
    }

    // Kair — add hidden draft if missing
    const existingKair = await Product.findOne({ slug: KAIR.slug });
    if (existingKair) {
      console.log(`• ${KAIR.slug} already exists — left untouched`);
      audit.push({ slug: KAIR.slug, status: 'exists' });
    } else {
      await Product.create(KAIR as any);
      console.log(`✓ ${KAIR.slug} added as HIDDEN draft (isActive:false)`);
      audit.push({ slug: KAIR.slug, status: 'added_hidden' });
    }

    const auditPath = join(__dirname, '..', '..', 'price-reconcile-audit.json');
    try {
      writeFileSync(join(process.cwd(), 'price-reconcile-audit.json'), JSON.stringify(audit, null, 2));
    } catch {}
    console.log(`\n📄 Audit written (before→after) for ${audit.length} products.`);
    console.log('✅ Reconciliation completed.');
    void auditPath;
  } catch (error: any) {
    console.error('❌ Reconciliation failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

run();
