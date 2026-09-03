import mongoose, { Schema, Document } from 'mongoose';

export interface IRawMaterial extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  itemCode: string;
  category: 'Spices' | 'Kernels' | 'Oil' | 'Salt' | 'Packaging' | 'Other';
  unit: 'kg' | 'g' | 'L' | 'ml' | 'pieces';
  currentStock: number;
  lowStockThreshold: number;
  purchaseCost: number;
  supplierId?: mongoose.Types.ObjectId;
  batchNumber?: string;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RawMaterialSchema = new Schema<IRawMaterial>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    itemCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Spices', 'Kernels', 'Oil', 'Salt', 'Packaging', 'Other'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'L', 'ml', 'pieces'],
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },
    purchaseCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RawMaterialSchema.index({ category: 1, isActive: 1 });
RawMaterialSchema.index({ currentStock: 1 });
RawMaterialSchema.index({ name: 'text' });

export default mongoose.models.RawMaterial || mongoose.model<IRawMaterial>('RawMaterial', RawMaterialSchema);
