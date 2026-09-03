import { Types } from 'mongoose';
import Order from '@/models/Order';
import SiteSettings from '@/models/SiteSettings';

/**
 * Calculate the Indian financial year (April 1 – March 31) in YY-YY format.
 * Examples:
 *   - September 2026 → "26-27"
 *   - February 2027 → "26-27"
 *   - April 2027 → "27-28"
 *
 * @param date - The date to calculate fiscal year for (defaults to current date)
 * @returns Fiscal year in YY-YY format with zero-padding (e.g., "05-06", "26-27")
 */
export function getIndianFiscalYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based: 0 = January, 3 = April, etc.

  let fiscalYear: string;
  if (month >= 3) {
    // April (3) through December (11) → current year is the start year
    fiscalYear = `${String(year % 100).padStart(2, '0')}-${String((year + 1) % 100).padStart(2, '0')}`;
  } else {
    // January (0) through March (2) → previous year is the start year
    fiscalYear = `${String((year - 1) % 100).padStart(2, '0')}-${String(year % 100).padStart(2, '0')}`;
  }

  return fiscalYear;
}

/**
 * Get or create a unique invoice number for an order.
 * Invoice numbers follow the format: TI/{fiscalYear}/{sequence}
 * Example: TI/26-27/31
 *
 * Behavior:
 * 1. If the order already has an invoiceNumber, return it immediately.
 * 2. Otherwise, compute the current Indian fiscal year.
 * 3. Atomically claim the next sequence number for that fiscal year from SiteSettings.
 * 4. Format as TI/{fiscalYear}/{sequence} and persist to the order.
 * 5. Return the invoice number.
 *
 * Note: There is a narrow theoretical race condition at the exact fiscal-year-rollover
 * moment or the very first invoice ever, where two concurrent requests could both take
 * the fallback branch and get the same sequence number. This is an accepted low-probability
 * v1 tradeoff (invoice generation is a low-frequency, mostly-admin-triggered action).
 * Wasted numbers are not a compliance problem; only duplicates are critical.
 *
 * @param orderId - The order ID (string or ObjectId)
 * @returns The invoice number string (e.g., "TI/26-27/31")
 * @throws Error if the order doesn't exist
 */
export async function getOrCreateInvoiceNumber(
  orderId: string | Types.ObjectId
): Promise<string> {
  const objectId = new Types.ObjectId(orderId);

  // Step 1: Check if order already has an invoice number
  const existingOrder = (await Order.findById(objectId)
    .select('invoiceNumber')
    .lean()) as { invoiceNumber?: string } | null;

  if (!existingOrder) {
    throw new Error(`Order with ID ${orderId} not found`);
  }

  if (existingOrder.invoiceNumber) {
    return existingOrder.invoiceNumber;
  }

  // Step 2: Compute current Indian fiscal year
  const currentFY = getIndianFiscalYear();

  // Step 3: Atomically claim the next sequence number
  // First, try incrementing assuming the counter is already on the current fiscal year
  let siteSettings = await SiteSettings.findOneAndUpdate(
    {
      key: 'global',
      'invoiceCounter.fiscalYear': currentFY,
    },
    {
      $inc: { 'invoiceCounter.lastNumber': 1 },
    },
    { new: true }
  );

  // If no document matched (either no SiteSettings yet or fiscal year differs),
  // fall back to upsert that resets the counter for the new fiscal year
  if (!siteSettings) {
    siteSettings = await SiteSettings.findOneAndUpdate(
      { key: 'global' },
      {
        $set: {
          'invoiceCounter.fiscalYear': currentFY,
          'invoiceCounter.lastNumber': 1,
        },
      },
      { new: true, upsert: true }
    );
  }

  // Step 4: Format the invoice number
  const lastNumber = siteSettings!.invoiceCounter!.lastNumber;
  const invoiceNumber = `TI/${currentFY}/${lastNumber}`;

  // Step 5: Persist to the order with a conditional update to prevent race conditions
  const updatedOrder = await Order.findOneAndUpdate(
    {
      _id: objectId,
      invoiceNumber: { $exists: false },
    },
    {
      $set: { invoiceNumber },
    },
    { new: true }
  );

  // If the conditional update matched, we're done
  if (updatedOrder) {
    return invoiceNumber;
  }

  // If the conditional update didn't match (race: order got a number between steps 1 and now),
  // re-fetch and return the actual invoice number
  const finalOrder = (await Order.findById(objectId)
    .select('invoiceNumber')
    .lean()) as { invoiceNumber?: string } | null;

  if (!finalOrder?.invoiceNumber) {
    throw new Error(`Failed to retrieve invoice number for order ${orderId}`);
  }

  return finalOrder.invoiceNumber;
}
