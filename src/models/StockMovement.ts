import mongoose, { Schema, Document } from 'mongoose';

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

export default mongoose.models.StockMovement || mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
