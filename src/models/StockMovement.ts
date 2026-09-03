import mongoose, { Schema, Document } from 'mongoose';

/**
 * StockMovement — Append-Only Audit Ledger
 *
 * This collection records ALL stock movements (raw materials and finished products) in a write-once,
 * immutable audit trail. Each document represents a single transaction that cannot be undone or edited.
 *
 * APPEND-ONLY CONTRACT:
 * - Only `.create()` and insert-style operations are allowed (e.g., `insertOne`, bulk inserts)
 * - NEVER call `.updateOne()`, `.findByIdAndUpdate()`, `.save()` on existing documents, `.deleteOne()`, or any mutation
 * - Corrections must be recorded as new documents with `movementType: 'adjustment'` and appropriate reason
 * - This ensures an unalterable audit trail for compliance, reconciliation, and debugging
 *
 * The `itemModel` field is automatically synced from `itemType` via a pre-save hook to prevent inconsistency.
 * This ensures `refPath` populate() always resolves the correct model (RawMaterial or Product).
 */

export interface IStockMovement extends Document {
  _id: mongoose.Types.ObjectId;
  itemType: 'raw_material' | 'product';
  itemId: mongoose.Types.ObjectId;
  itemModel: 'RawMaterial' | 'Product';
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  unitCost?: number;
  reason: 'purchase' | 'sale' | 'production' | 'manual_adjustment' | 'return';
  reference?: string;
  batchNumber?: string;
  balanceAfter: number;
  performedBy: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>(
  {
    itemType: {
      type: String,
      required: true,
      enum: ['raw_material', 'product'],
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'itemModel',
    },
    itemModel: {
      type: String,
      required: true,
      enum: ['RawMaterial', 'Product'],
    },
    movementType: {
      type: String,
      required: true,
      enum: ['in', 'out', 'adjustment'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitCost: {
      type: Number,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
      enum: ['purchase', 'sale', 'production', 'manual_adjustment', 'return'],
    },
    reference: {
      type: String,
      trim: true,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
StockMovementSchema.index({ itemId: 1, createdAt: -1 });
StockMovementSchema.index({ reason: 1 });
StockMovementSchema.index({ itemType: 1 });

// Pre-save hook: Auto-sync itemModel from itemType to prevent inconsistency
// This ensures refPath populate() always resolves the correct model
const ITEM_TYPE_TO_MODEL: Record<string, 'RawMaterial' | 'Product'> = {
  raw_material: 'RawMaterial',
  product: 'Product',
};

StockMovementSchema.pre('save', function (next) {
  this.itemModel = ITEM_TYPE_TO_MODEL[this.itemType as keyof typeof ITEM_TYPE_TO_MODEL];
  next();
});

export default mongoose.models.StockMovement || mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
