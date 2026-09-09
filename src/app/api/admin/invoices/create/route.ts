import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import Product, { IProduct } from '@/models/Product';
import User from '@/models/User';
import Address from '@/models/Address';
import AdminActivity from '@/models/AdminActivity';
import { calculateOrderGST } from '@/lib/gst';
import { getOrCreateInvoiceNumber } from '@/lib/invoice/getOrCreateInvoiceNumber';
import { logStockMovement } from '@/lib/inventory/logStockMovement';

/**
 * POST /api/admin/invoices/create
 * Create a manual/offline order + invoice (walk-in or wholesale sale that
 * didn't go through online checkout). Mirrors the checkout create-order +
 * payment-confirmation flow, but collapsed into one step since the sale
 * already happened — stock is decremented and the invoice number is
 * assigned immediately rather than waiting for a payment webhook.
 */
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;
    const session = adminCheck.session;

    const body = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }

    if (!body.customer || (!body.customer.userId && !body.customer.name)) {
      return NextResponse.json({ error: 'Customer (existing userId or name for a new customer) is required' }, { status: 400 });
    }

    const addr = body.shippingAddress;
    if (!addr?.fullName || !addr?.phoneNumber || !addr?.addressLine1 || !addr?.city || !addr?.state || !addr?.postalCode) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    const paymentMethod = body.paymentMethod || 'cod';
    const paymentStatus = body.paymentStatus === 'pending' ? 'pending' : 'paid';
    const validPaymentMethods = ['cod', 'card', 'upi', 'netbanking', 'wallet'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    for (const item of body.items) {
      if (!item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: 'Every line item needs a quantity of at least 1' }, { status: 400 });
      }
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return NextResponse.json({ error: 'Invalid product reference' }, { status: 400 });
      }
      if (item.variantId && typeof item.variantId !== 'string') {
        return NextResponse.json({ error: 'Invalid variant reference' }, { status: 400 });
      }
    }
    if (body.customer.userId && !mongoose.Types.ObjectId.isValid(body.customer.userId)) {
      return NextResponse.json({ error: 'Invalid customer reference' }, { status: 400 });
    }

    await connectDB();

    const mongoSession = await mongoose.startSession();
    let order!: any;
    let invoiceNumber!: string;
    const stockDecrements: Array<{ productId: string; variantId?: string; quantity: number; balanceAfter: number }> = [];

    try {
      await mongoSession.withTransaction(async () => {
        // ── Resolve or create the customer ────────────────────────────
        let user;
        if (body.customer.userId) {
          user = await User.findById(body.customer.userId).session(mongoSession);
          if (!user) {
            throw new HttpError(404, 'Customer not found');
          }
        } else {
          if (!body.customer.phoneNumber && !body.customer.email) {
            throw new HttpError(400, 'A phone number or email is required to create a new customer');
          }
          [user] = await User.create(
            [
              {
                name: body.customer.name,
                email: body.customer.email || undefined,
                phoneNumber: body.customer.phoneNumber || undefined,
                role: 'client',
              },
            ],
            { session: mongoSession }
          );
        }

        // ── Address for this invoice ───────────────────────────────────
        const [shippingAddress] = await Address.create(
          [
            {
              userId: user._id,
              type: 'shipping',
              fullName: addr.fullName,
              phoneNumber: addr.phoneNumber,
              addressLine1: addr.addressLine1,
              addressLine2: addr.addressLine2 || undefined,
              city: addr.city,
              state: addr.state,
              postalCode: addr.postalCode,
              country: addr.country || 'India',
            },
          ],
          { session: mongoSession }
        );

        // ── Resolve products, mirroring checkout/create-order ──────────
        const uniqueProductIds = [...new Set(body.items.map((item: any) => item.productId))];
        const products = await Product.find({ _id: { $in: uniqueProductIds } }).session(mongoSession);

        if (products.length !== uniqueProductIds.length) {
          throw new HttpError(404, 'Some products were not found');
        }

        for (const item of body.items) {
          const product = products.find((p) => p._id.toString() === item.productId);
          if (!product) continue;

          if (item.variantId) {
            const variant = product.variants.find(
              (v: any) => v.id === item.variantId || v.name === item.variantId || v.sku === item.variantId
            );
            if (!variant) {
              throw new HttpError(404, `Variant not found for ${product.name}`);
            }
            if (variant.stock < item.quantity) {
              throw new HttpError(400, `Insufficient stock for ${product.name} - ${variant.name}`);
            }
          } else if (product.stock < item.quantity) {
            throw new HttpError(400, `Insufficient stock for ${product.name}`);
          }
        }

        let subtotal = 0;
        const orderItemDrafts: any[] = [];
        const gstItems: Array<{ inclusivePrice: number; quantity: number; gstRate: number }> = [];

        for (const item of body.items) {
          const product = products.find((p) => p._id.toString() === item.productId);
          if (!product) continue;

          let resolvedPrice = product.price;
          let resolvedSku = product.sku;
          let resolvedName = product.name;
          const resolvedGstRate: number = product.gstRate ?? 5;

          if (item.variantId) {
            const variant = product.variants.find(
              (v: any) => v.id === item.variantId || v.name === item.variantId || v.sku === item.variantId
            );
            if (variant) {
              resolvedPrice = variant.price;
              resolvedSku = variant.sku;
              resolvedName = `${product.name} - ${variant.name}`;
            }
          }

          const itemSubtotal = resolvedPrice * item.quantity;
          subtotal += itemSubtotal;

          gstItems.push({ inclusivePrice: resolvedPrice, quantity: item.quantity, gstRate: resolvedGstRate });

          orderItemDrafts.push({
            productId: product._id,
            variantId: item.variantId || null,
            gstRate: resolvedGstRate,
            hsnCode: product.hsnCode || '2001',
            productName: resolvedName,
            productSku: resolvedSku,
            productImage: (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) || '',
            quantity: item.quantity,
            priceAtPurchase: resolvedPrice,
            subtotal: itemSubtotal,
          });
        }

        const shippingCost = Number(body.shippingCost) > 0 ? Number(body.shippingCost) : 0;
        const discountAmount = Math.min(Math.max(Number(body.discountAmount) || 0, 0), subtotal);

        const gstBreakdown = calculateOrderGST(gstItems, shippingAddress.state || '');
        const { taxAmount, cgst, sgst, igst, isIntraState } = gstBreakdown;

        const totalAmount = Math.max(0, subtotal + shippingCost - discountAmount);

        // ── Create the order + line items ──────────────────────────────
        [order] = await Order.create(
          [
            {
              userId: user._id,
              items: [],
              subtotal,
              shippingCost,
              taxAmount,
              cgst,
              sgst,
              igst,
              isIntraState,
              discountAmount,
              totalAmount,
              orderStatus: 'confirmed',
              paymentMethod,
              paymentStatus,
              shippingAddressId: shippingAddress._id,
              billingAddressId: shippingAddress._id,
              notes: body.notes || 'Manually created invoice (offline/walk-in sale).',
            },
          ],
          { session: mongoSession }
        );

        const createdOrderItems = await OrderItem.insertMany(
          orderItemDrafts.map((item) => ({ ...item, orderId: order._id })),
          { session: mongoSession }
        );
        order.items = createdOrderItems.map((item) => item._id);
        await order.save({ session: mongoSession });

        invoiceNumber = await getOrCreateInvoiceNumber(order._id, mongoSession);

        // ── Decrement stock immediately (no payment webhook will fire) ──
        for (const item of body.items) {
          let updated: IProduct | null;
          if (item.variantId) {
            updated = await Product.findOneAndUpdate(
              {
                _id: item.productId,
                stock: { $gte: item.quantity },
                variants: { $elemMatch: { id: item.variantId, stock: { $gte: item.quantity } } },
              },
              { $inc: { 'variants.$.stock': -item.quantity, stock: -item.quantity } },
              { new: true, session: mongoSession }
            );
          } else {
            updated = await Product.findOneAndUpdate(
              { _id: item.productId, stock: { $gte: item.quantity } },
              { $inc: { stock: -item.quantity } },
              { new: true, session: mongoSession }
            );
          }

          if (!updated) {
            throw new HttpError(409, `Stock changed concurrently for one of the items — please retry`);
          }

          stockDecrements.push({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            balanceAfter: updated.stock,
          });
        }
      });
    } catch (error: any) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      throw error;
    } finally {
      await mongoSession.endSession();
    }

    // ── Best-effort audit trail (append-only ledger + activity log) ─────
    // Runs after the transaction commits — matches the pattern used for
    // payment-webhook stock movements (src/app/api/payment/callback/route.ts):
    // these are non-critical logs, not the source of truth for stock.
    for (const decrement of stockDecrements) {
      await logStockMovement({
        productId: decrement.productId,
        movementType: 'out',
        quantity: decrement.quantity,
        reason: 'sale',
        balanceAfter: decrement.balanceAfter,
        performedBy: session.user.id,
        reference: order.orderNumber,
        notes: `Manual invoice ${invoiceNumber!}`,
      });
    }

    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'manual_invoice_created',
        entityType: 'order',
        entityId: order._id,
        details: { orderNumber: order.orderNumber, invoiceNumber: invoiceNumber!, totalAmount: order.totalAmount },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        invoiceNumber: invoiceNumber!,
        totalAmount: order.totalAmount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Manual invoice creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice', details: error.message },
      { status: 500 }
    );
  }
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
