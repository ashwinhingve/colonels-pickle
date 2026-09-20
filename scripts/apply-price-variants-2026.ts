import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import mongoose from 'mongoose';
import Product from '../src/models/Product';

/**
 * Apply the 2026 five-tier price lineup (100g / 150g / 250g / 375g / 500g — no
 * 1kg) supplied by the client.
 *
 * - REBUILDS the `variants` array of 14 existing products to the 5 new sizes,
 *   at the client's prices, and resets each product's top-level `price` to its
 *   100g tier. The 100g/250g/500g variant ids stay identical to today; 150g &
 *   375g are added and 1kg is dropped.
 * - CREATES "Nimbu Mirchi" (Lemon & Green Chilli Pickle) as a new, visible
 *   product with the standard tier — provisional copy, images to follow.
 * - Kair Ka Achar is re-priced but LEFT HIDDEN (isActive:false).
 * - Never deletes/re-inserts, so order / review / wishlist `_id` references and
 *   product images stay intact.
 * - Existing per-variant stock is preserved; new sizes inherit the 100g stock.
 *
 * Writes a before -> after audit log to the OS temp dir.
 *
 * Usage: npx tsx scripts/apply-price-variants-2026.ts
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

type Tiers = Record<string, number>; // weight label -> price

// Ordered new size lineup.
const WEIGHTS = ['100g', '150g', '250g', '375g', '500g'] as const;

// Client's authoritative 2026 price list.
const PREMIUM: Tiers = { '100g': 199, '150g': 289, '250g': 449, '375g': 669, '500g': 889 };
const STANDARD: Tiers = { '100g': 109, '150g': 159, '250g': 249, '375g': 359, '500g': 459 };
const LOW: Tiers = { '100g': 99, '150g': 149, '250g': 229, '375g': 339, '500g': 439 };
const MID: Tiers = { '100g': 119, '150g': 175, '250g': 289, '375g': 439, '500g': 559 };

// Existing products to re-tier (slug -> tier). Kair & Nimbu Mirchi are handled
// separately below (create-if-missing).
const TARGETS: { slug: string; tiers: Tiers }[] = [
  { slug: 'organic-gulkand', tiers: PREMIUM },
  { slug: 'chhuhara-adrak', tiers: PREMIUM },
  { slug: 'dry-masala-aam', tiers: STANDARD },
  { slug: 'aam-ka-achar', tiers: STANDARD },
  { slug: 'bharwa-lal-mirch', tiers: STANDARD },
  { slug: 'bharwa-bhajiya', tiers: STANDARD },
  { slug: 'amla-ka-achar', tiers: STANDARD },
  { slug: 'nimbu-chatpata', tiers: STANDARD },
  { slug: 'khatta-meetha-nimbu', tiers: STANDARD },
  { slug: 'mixed-chatpata', tiers: LOW },
  { slug: 'tikhi-mirchi', tiers: LOW },
  { slug: 'lehsun-ka-achar', tiers: MID },
  { slug: 'kathal-ka-achar', tiers: MID },
];

function weightNorm(weight: string): string {
  return weight.replace(/[^a-z0-9]/gi, '').toUpperCase();
}

/** Build the 5 new variant subdocs for a product, preserving stock where possible. */
function buildVariants(slug: string, productSku: string, tiers: Tiers, existing: any[] = []) {
  const baseStock =
    existing.find((v) => v.name === '100g')?.stock ?? existing[0]?.stock ?? 100;
  return WEIGHTS.map((w) => {
    const norm = weightNorm(w);
    const prior = existing.find((v) => v.name === w);
    return {
      id: `${slug}-${norm}`.toLowerCase(),
      name: w,
      sku: `${productSku}-${norm}`,
      price: tiers[w],
      stock: prior?.stock ?? baseStock,
      isActive: true,
    };
  });
}

// Kair Ka Achar — HIDDEN draft (isActive:false). Created only if absent.
const KAIR = {
  name: 'Kair Ka Achar',
  slug: 'kair-ka-achar',
  sku: 'CP-KAIR-KA-ACHAR',
  description:
    'Kair Ka Achar (Rajasthani Desert Berry Pickle). Draft — hidden until ingredients and product photos are confirmed.',
  shortDescription: 'Rajasthani Desert Berry Pickle',
  category: 'achaar',
  price: PREMIUM['100g'],
  stock: 100,
  images: [],
  tags: ['achaar', 'kair', 'desert', 'berry'],
  specifications: [{ key: 'No Preservatives', value: 'Yes', order: 0 }],
  variants: buildVariants('kair-ka-achar', 'CP-KAIR-KA-ACHAR', PREMIUM),
  hasVariants: true,
  isActive: false, // HIDDEN
  isFeatured: false,
  seo: {
    metaTitle: 'Kair Ka Achar',
    metaDescription: 'Rajasthani Desert Berry Pickle',
    keywords: ['kair ka achar', 'achaar', 'colonels pickle'],
  },
};

// New product: Nimbu Mirchi (Lemon & Green Chilli Pickle).
const NIMBU_MIRCHI = {
  name: 'Nimbu Mirchi',
  slug: 'nimbu-mirchi',
  sku: 'CP-NIMBU-MIRCHI',
  description:
    'Nimbu Mirchi (Lemon & Green Chilli Pickle). Provisional listing — final ingredients, description and product photos to follow.',
  shortDescription: 'Lemon & Green Chilli Pickle',
  category: 'achaar',
  price: STANDARD['100g'],
  stock: 100,
  images: [],
  tags: ['achaar', 'nimbu', 'mirchi', 'lemon', 'chilli'],
  specifications: [{ key: 'No Preservatives', value: 'Yes', order: 0 }],
  variants: buildVariants('nimbu-mirchi', 'CP-NIMBU-MIRCHI', STANDARD),
  hasVariants: true,
  isActive: true,
  isFeatured: false,
  seo: {
    metaTitle: 'Nimbu Mirchi',
    metaDescription: 'Lemon & Green Chilli Pickle',
    keywords: ['nimbu mirchi', 'lemon chilli pickle', 'achaar', 'colonels pickle'],
  },
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
        isActive: p.isActive,
        variants: p.variants.map((v: any) => ({ name: v.name, price: v.price, stock: v.stock })),
      };

      p.variants = buildVariants(t.slug, p.sku, t.tiers, p.variants);
      p.price = t.tiers['100g'];
      p.hasVariants = true;
      p.markModified('variants');
      await p.save();

      const after = {
        name: p.name,
        price: p.price,
        isActive: p.isActive,
        variants: p.variants.map((v: any) => ({ name: v.name, price: v.price, stock: v.stock })),
      };
      console.log(`✓ ${t.slug} → ${WEIGHTS.map((w) => `${w}:${t.tiers[w]}`).join('  ')}`);
      audit.push({ slug: t.slug, status: 'updated', before, after });
    }

    // Kair — re-tier if present (keep whatever isActive it has, i.e. hidden),
    // else create it hidden.
    const existingKair: any = await Product.findOne({ slug: KAIR.slug });
    if (existingKair) {
      existingKair.variants = buildVariants(KAIR.slug, existingKair.sku, PREMIUM, existingKair.variants);
      existingKair.price = PREMIUM['100g'];
      existingKair.hasVariants = true;
      existingKair.markModified('variants');
      await existingKair.save();
      console.log(`✓ ${KAIR.slug} re-tiered (isActive:${existingKair.isActive} — unchanged)`);
      audit.push({ slug: KAIR.slug, status: 'updated', isActive: existingKair.isActive });
    } else {
      await Product.create(KAIR as any);
      console.log(`✓ ${KAIR.slug} created as HIDDEN draft (isActive:false)`);
      audit.push({ slug: KAIR.slug, status: 'created_hidden' });
    }

    // Nimbu Mirchi — create (or re-tier if it somehow already exists).
    const existingNM: any = await Product.findOne({ slug: NIMBU_MIRCHI.slug });
    if (existingNM) {
      existingNM.variants = buildVariants(NIMBU_MIRCHI.slug, existingNM.sku, STANDARD, existingNM.variants);
      existingNM.price = STANDARD['100g'];
      existingNM.hasVariants = true;
      existingNM.markModified('variants');
      await existingNM.save();
      console.log(`✓ ${NIMBU_MIRCHI.slug} already existed — re-tiered`);
      audit.push({ slug: NIMBU_MIRCHI.slug, status: 'updated_existing' });
    } else {
      await Product.create(NIMBU_MIRCHI as any);
      console.log(`✓ ${NIMBU_MIRCHI.slug} created (visible, standard tier)`);
      audit.push({ slug: NIMBU_MIRCHI.slug, status: 'created' });
    }

    const auditPath = join(tmpdir(), 'cp-price-variants-2026-audit.json');
    try {
      writeFileSync(auditPath, JSON.stringify(audit, null, 2));
      console.log(`\n📄 Audit (before→after) written to ${auditPath}`);
    } catch {}
    console.log(`✅ Done — ${audit.length} products processed.`);
  } catch (error: any) {
    console.error('❌ Price update failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

run();
