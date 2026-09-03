import * as z from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().optional(),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstin: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

// Partial schema for updates
export const supplierUpdateSchema = supplierSchema.partial();
