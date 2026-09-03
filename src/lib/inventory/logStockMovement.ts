import { Types } from 'mongoose';
import StockMovement from '@/models/StockMovement';

interface LogStockMovementParams {
  productId: Types.ObjectId | string;
  movementType: 'in' | 'out';
  quantity: number;
  reason: 'sale' | 'return';
  balanceAfter: number;
  performedBy: Types.ObjectId | string;
  reference?: string;
  notes?: string;
}

export async function logStockMovement(params: LogStockMovementParams): Promise<void> {
  try {
    await StockMovement.create({
      itemType: 'product',
      itemId: params.productId,
      movementType: params.movementType,
      quantity: params.quantity,
      reason: params.reason,
      balanceAfter: params.balanceAfter,
      performedBy: params.performedBy,
      reference: params.reference,
      notes: params.notes,
    });
  } catch (error) {
    console.error('logStockMovement failed (non-blocking):', error, params);
  }
}
