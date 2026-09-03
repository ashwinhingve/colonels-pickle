import * as z from 'zod';

// Mongo ObjectId validation: simple hex string check (24 characters)
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const stockMovementSchema = z.object({
  itemType: z.enum(['raw_material', 'product']),
  itemId: z.string().regex(mongoIdRegex, 'Invalid MongoDB ObjectId format'),
  movementType: z.enum(['in', 'out', 'adjustment']),
  quantity: z.number().min(0, 'Quantity must be non-negative'),
  reason: z.enum(['purchase', 'sale', 'production', 'manual_adjustment', 'return']),
  unitCost: z.number().min(0, 'Unit cost must be non-negative').optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type StockMovementFormData = z.infer<typeof stockMovementSchema>;
