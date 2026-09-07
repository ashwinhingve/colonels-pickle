import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Supplier from '../src/models/Supplier';
import RawMaterial from '../src/models/RawMaterial';
import StockMovement from '../src/models/StockMovement';
import Product from '../src/models/Product';
import User from '../src/models/User';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

/**
 * Seed realistic inventory demo data — suppliers, raw materials, and a full
 * stock-movement history (opening balance, purchases, production consumption,
 * one stocktake adjustment) so the inventory dashboard shows genuine,
 * internally-consistent numbers instead of empty tables.
 *
 * Re-runnable: clears RawMaterial/Supplier/StockMovement(raw_material) each
 * time and rebuilds from scratch. Does not touch Product documents except to
 * set/clear their supplierId link.
 *
 * Usage: npx tsx scripts/seed-inventory.ts
 */

interface MovementPlan {
  type: 'in' | 'out' | 'adjustment';
  reason: 'purchase' | 'production' | 'manual_adjustment';
  quantity: number;
  notes: string;
  batchNumber?: string;
  unitCost?: number;
  daysAgo: number;
}

interface RawMaterialPlan {
  name: string;
  itemCode: string;
  category: 'Spices' | 'Kernels' | 'Oil' | 'Salt' | 'Packaging' | 'Other';
  unit: 'kg' | 'g' | 'L' | 'ml' | 'pieces';
  lowStockThreshold: number;
  purchaseCost: number;
  supplier: 'ashwin' | 'packaging';
  movements: MovementPlan[];
}

const suppliersData = [
  {
    key: 'ashwin' as const,
    name: 'Ashwin Hingve',
    contactPerson: 'Ashwin Hingve',
    phone: '9829012345',
    email: 'ashwin.trading@example.com',
    address: 'Chandpole Bazar, Jaipur, Rajasthan',
    notes: 'Primary raw-material supplier — whole spices, mustard oil, salts, and Afghani hing.',
    isActive: true,
  },
  {
    key: 'packaging' as const,
    name: 'Jaipur Glass & Packaging Co.',
    contactPerson: 'Suresh Sharma',
    phone: '9414098765',
    email: 'orders@jaipurglasspack.example.com',
    address: 'Sanganer Industrial Area, Jaipur, Rajasthan',
    notes: 'Glass jars, lids, and packaging consumables.',
    isActive: true,
  },
];

const rawMaterialsData: RawMaterialPlan[] = [
  {
    name: 'Kachi Ghani Mustard Oil',
    itemCode: 'RM-MUSTARD-OIL',
    category: 'Oil',
    unit: 'L',
    lowStockThreshold: 20,
    purchaseCost: 185,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 100, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'in', reason: 'purchase', quantity: 50, notes: 'Purchase receipt — PO-2026-014', batchNumber: 'PO-2026-014', unitCost: 185, daysAgo: 20 },
      { type: 'out', reason: 'production', quantity: 80, notes: 'Consumed in achaar production batch #B-0142', daysAgo: 5 },
    ],
  },
  {
    name: 'Raw Mango (Kaccha Aam)',
    itemCode: 'RM-RAW-MANGO',
    category: 'Other',
    unit: 'kg',
    lowStockThreshold: 50,
    purchaseCost: 35,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 300, notes: 'Opening stock balance — seasonal bulk purchase', daysAgo: 40 },
      { type: 'out', reason: 'production', quantity: 220, notes: 'Consumed in mango achaar production batch #B-0140', daysAgo: 8 },
    ],
  },
  {
    name: 'Red Chilli Powder (Lal Mirch)',
    itemCode: 'RM-CHILLI-POWDER',
    category: 'Spices',
    unit: 'kg',
    lowStockThreshold: 10,
    purchaseCost: 220,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 40, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'in', reason: 'purchase', quantity: 20, notes: 'Purchase receipt — PO-2026-015', batchNumber: 'PO-2026-015', unitCost: 225, daysAgo: 18 },
      { type: 'out', reason: 'production', quantity: 45, notes: 'Consumed across multiple achaar production batches', daysAgo: 6 },
      { type: 'adjustment', reason: 'manual_adjustment', quantity: 13, notes: 'Stocktake correction — physical count found 2kg short (spillage during handling)', daysAgo: 1 },
    ],
  },
  {
    name: 'Turmeric Powder (Haldi)',
    itemCode: 'RM-TURMERIC-POWDER',
    category: 'Spices',
    unit: 'kg',
    lowStockThreshold: 8,
    purchaseCost: 180,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 25, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 20, notes: 'Consumed across multiple achaar production batches', daysAgo: 7 },
    ],
  },
  {
    name: 'Fenugreek Seeds (Methi Dana)',
    itemCode: 'RM-FENUGREEK-SEEDS',
    category: 'Kernels',
    unit: 'kg',
    lowStockThreshold: 5,
    purchaseCost: 140,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 15, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 8, notes: 'Consumed in achaar masala mix', daysAgo: 10 },
    ],
  },
  {
    name: 'Mustard Seeds (Rai)',
    itemCode: 'RM-MUSTARD-SEEDS',
    category: 'Kernels',
    unit: 'kg',
    lowStockThreshold: 10,
    purchaseCost: 95,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 30, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'in', reason: 'purchase', quantity: 10, notes: 'Purchase receipt — PO-2026-016', batchNumber: 'PO-2026-016', unitCost: 95, daysAgo: 15 },
      { type: 'out', reason: 'production', quantity: 25, notes: 'Consumed across multiple achaar production batches', daysAgo: 6 },
    ],
  },
  {
    name: 'Fennel Seeds (Saunf)',
    itemCode: 'RM-FENNEL-SEEDS',
    category: 'Kernels',
    unit: 'kg',
    lowStockThreshold: 5,
    purchaseCost: 160,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 12, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 9, notes: 'Consumed in achaar masala mix', daysAgo: 9 },
    ],
  },
  {
    name: 'Rock Salt (Sendha Namak)',
    itemCode: 'RM-ROCK-SALT',
    category: 'Salt',
    unit: 'kg',
    lowStockThreshold: 15,
    purchaseCost: 28,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 60, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 40, notes: 'Consumed across multiple achaar production batches', daysAgo: 7 },
    ],
  },
  {
    name: 'Black Salt (Kala Namak)',
    itemCode: 'RM-BLACK-SALT',
    category: 'Salt',
    unit: 'kg',
    lowStockThreshold: 10,
    purchaseCost: 45,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 25, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 18, notes: 'Consumed across multiple achaar production batches', daysAgo: 6 },
    ],
  },
  {
    name: 'Afghani Hing (Asafoetida)',
    itemCode: 'RM-AFGHANI-HING',
    category: 'Other',
    unit: 'kg',
    lowStockThreshold: 1,
    purchaseCost: 30000,
    supplier: 'ashwin',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 2, notes: 'Opening stock balance — premium import, small quantity due to cost', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 1.6, notes: 'Consumed across multiple achaar production batches', daysAgo: 4 },
    ],
  },
  {
    name: 'Glass Jars (250g/500g)',
    itemCode: 'RM-GLASS-JARS',
    category: 'Packaging',
    unit: 'pieces',
    lowStockThreshold: 200,
    purchaseCost: 12,
    supplier: 'packaging',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 1000, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 1000, notes: 'Used for packaging finished achaar batches — restock needed', daysAgo: 3 },
    ],
  },
  {
    name: 'Jar Lids & Caps',
    itemCode: 'RM-JAR-LIDS',
    category: 'Packaging',
    unit: 'pieces',
    lowStockThreshold: 200,
    purchaseCost: 3,
    supplier: 'packaging',
    movements: [
      { type: 'in', reason: 'purchase', quantity: 1000, notes: 'Opening stock balance', daysAgo: 45 },
      { type: 'out', reason: 'production', quantity: 850, notes: 'Used for packaging finished achaar batches', daysAgo: 3 },
    ],
  },
];

async function run() {
  try {
    console.log('Seeding inventory demo data (suppliers, raw materials, stock movements)...\n');

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set. Check .env.local');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const admin = (await User.findOne({ role: 'admin' })) || (await User.findOne({ email: process.env.ADMIN_EMAIL }));
    if (!admin) {
      throw new Error(
        'No admin user found in the database. Log in as the admin at least once (so a User document exists) before running this seed script.'
      );
    }

    // ── Reset previous inventory demo data ──────────────────────────────
    await StockMovement.deleteMany({ itemType: 'raw_material' });
    await RawMaterial.deleteMany({});
    await Supplier.deleteMany({});
    await Product.updateMany({}, { $unset: { supplierId: '' } });

    // ── Suppliers ─────────────────────────────────────────────────────────
    const supplierDocs = await Supplier.insertMany(
      suppliersData.map(({ key, ...doc }) => doc)
    );
    const supplierIdByKey: Record<string, mongoose.Types.ObjectId> = {};
    supplierDocs.forEach((doc, i) => {
      supplierIdByKey[suppliersData[i].key] = doc._id;
    });
    console.log(`Suppliers seeded: ${supplierDocs.length}`);

    // ── Raw materials + stock movement ledger ───────────────────────────
    let totalMovements = 0;
    for (const plan of rawMaterialsData) {
      const rawMaterial = await RawMaterial.create({
        name: plan.name,
        itemCode: plan.itemCode,
        category: plan.category,
        unit: plan.unit,
        currentStock: 0,
        lowStockThreshold: plan.lowStockThreshold,
        purchaseCost: plan.purchaseCost,
        supplierId: supplierIdByKey[plan.supplier],
        isActive: true,
      });

      let runningStock = 0;
      for (const move of plan.movements) {
        if (move.type === 'in') runningStock += move.quantity;
        else if (move.type === 'out') runningStock -= move.quantity;
        else runningStock = move.quantity; // adjustment sets the absolute value
        runningStock = Math.round(runningStock * 1000) / 1000; // avoid float artifacts (e.g. 2 - 1.6)

        const createdAt = new Date(Date.now() - move.daysAgo * 24 * 60 * 60 * 1000);

        await StockMovement.create({
          itemType: 'raw_material',
          itemId: rawMaterial._id,
          movementType: move.type,
          quantity: move.quantity,
          unitCost: move.unitCost,
          reason: move.reason,
          batchNumber: move.batchNumber,
          balanceAfter: runningStock,
          performedBy: admin._id,
          notes: move.notes,
          createdAt,
          updatedAt: createdAt,
        });
        totalMovements++;
      }

      rawMaterial.currentStock = runningStock;
      await rawMaterial.save();
    }
    console.log(`Raw materials seeded: ${rawMaterialsData.length}`);
    console.log(`Stock movements seeded: ${totalMovements}`);

    // ── Link a couple of existing products to their raw-material supplier ──
    const ashwinId = supplierIdByKey['ashwin'];
    const linkedProducts = await Product.find({ category: { $in: ['achaar', 'oils'] } })
      .sort({ createdAt: 1 })
      .limit(2);
    for (const product of linkedProducts) {
      product.supplierId = ashwinId;
      await product.save();
    }
    console.log(`Products linked to a supplier: ${linkedProducts.map((p) => p.name).join(', ') || 'none found'}`);

    // ── Summary ───────────────────────────────────────────────────────────
    const lowStock = await RawMaterial.find({
      $expr: { $and: [{ $gt: ['$currentStock', 0] }, { $lte: ['$currentStock', '$lowStockThreshold'] }] },
    });
    const outOfStock = await RawMaterial.find({ currentStock: 0 });

    console.log('\nSeed Summary:');
    console.log(`  Suppliers: ${supplierDocs.length}`);
    console.log(`  Raw materials: ${rawMaterialsData.length}`);
    console.log(`  Stock movements: ${totalMovements}`);
    console.log(`  Low stock items: ${lowStock.map((r) => r.name).join(', ') || 'none'}`);
    console.log(`  Out of stock items: ${outOfStock.map((r) => r.name).join(', ') || 'none'}`);
    console.log('\nSeeding completed!');
  } catch (error: any) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
