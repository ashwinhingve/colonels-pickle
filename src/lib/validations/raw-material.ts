import * as z from 'zod';

export const rawMaterialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  itemCode: z.string().min(1, 'Item code is required').toUpperCase(),
  category: z.enum(['Spices', 'Kernels', 'Oil', 'Salt', 'Packaging', 'Other']),
  unit: z.enum(['kg', 'g', 'L', 'ml', 'pieces']),
  currentStock: z.number().min(0, 'Current stock must be non-negative').default(0),
  lowStockThreshold: z.number().min(0, 'Low stock threshold must be non-negative').default(10),
  purchaseCost: z.number().min(0, 'Purchase cost must be non-negative').default(0),
  supplierId: z.string().optional(),
  batchNumber: z.string().optional(),
  expiryDate: z
    .union([z.string().datetime(), z.date()])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  isActive: z.boolean().default(true),
});

export type RawMaterialFormData = z.infer<typeof rawMaterialSchema>;

// Partial schema for updates
export const rawMaterialUpdateSchema = rawMaterialSchema.partial();
