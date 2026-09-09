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
import { logStockMovement } from '@/lib/inventory/logStockMovement';

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * GET /api/admin/invoices/[orderId]
 * Fetch a manually-created invoice/order for the edit form to prefill.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { orderId } = await params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid order reference' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phoneNumber')
      .populate('shippingAddressId')
      .populate('items')
      .lean();

    if (!order) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching invoice for edit:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice', details: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/invoices/[orderId]
 * Edit a manually-created invoice — only while it's still `pending` payment.
 * Once an invoice is marked `paid` it is locked; corrections go through the
 * Void action (src/app/api/admin/invoices/[orderId]/void/route.ts) followed
 * by creating a fresh invoice, matching real bookkeeping practice for issued
 * tax invoices. The invoice number itself is never changed by this route.
 *
 * Approach: restore stock for every existing line item, delete the old line
 * items, then re-run the same resolve/validate/decrement logic as invoice
 * creation for the new item list — all inside one transaction. This keeps the
 * stock math simple and correct without needing to diff old vs. new items.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;
  const session = adminCheck.session;

  try {
    const { orderId } = await params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid order reference' }, { status: 400 });
    }

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
    }
    if (body.customer.userId && !mongoose.Types.ObjectId.isValid(body.customer.userId)) {
      return NextResponse.json({ error: 'Invalid customer reference' }, { status: 400 });
    }

    await connectDB();

    const mongoSession = await mongoose.startSession();
    let order!: any;
    const stockDecrements: Array<{ productId: string; quantity: number; balanceAfter: number }> = [];
    const stockRestorations: Array<{ productId: string; quantity: number; balanceAfter: number }> = [];

    try {
      await mongoSession.withTransaction(async () => {
        const existingOrder = await Order.findById(orderId).session(mongoSession);
        if (!existingOrder) {
          throw new HttpError(404, 'Invoice not found');
        }
        if (existingOrder.paymentStatus !== 'pending') {
          throw new HttpError(409, 'Only invoices with a pending payment status can be edited. Void this invoice and create a new one instead.');
        }

        // ── Restore stock for every existing line item ──────────────────
        const oldItems = await OrderItem.find({ orderId: existingOrder._id }).session(mongoSession);
        for (const oldItem of oldItems) {
          let restored: IProduct | null;
          if (oldItem.variantId) {
            restored = await Product.findOneAndUpdate(
              { _id: oldItem.productId, 'variants.id': oldItem.variantId },
              { $inc: { 'variants.$.stock': oldItem.quantity, stock: oldItem.quantity } },
              { new: true, session: mongoSession }
            );
          } else {
            restored = await Product.findOneAndUpdate(
              { _id: oldItem.productId },
              { $inc: { stock: oldItem.quantity } },
              { new: true, session: mongoSession }
            );
          }
          if (restored) {
            stockRestorations.push({ productId: oldItem.productId.toString(), quantity: oldItem.quantity, balanceAfter: restored.stock });
          }
        }
        await OrderItem.deleteMany({ orderId: existingOrder._id }, { session: mongoSession });

        // ── Resolve or create the customer ───────────────────────────────
        let user;
        if (body.customer.userId) {
          user = await User.findById(body.customer.userId).session(mongoSession);
          if (!user) throw new HttpError(404, 'Customer not found');
        } else {
          if (!body.customer.phoneNumber && !body.customer.email) {
            throw new HttpError(400, 'A phone number or email is required to create a new customer');
          }
          [user] = await User.create(
            [{ name: body.customer.name, email: body.customer.email || undefined, phoneNumber: body.customer.phoneNumber || undefined, role: 'client' }],
            { session: mongoSession }
          );
        }

        const [shippingAddress] = await Address.create(
          [{
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
          }],
          { session: mongoSession }
        );

        // ── Resolve products & validate stock (now that old stock is restored) ──
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
            if (!variant) throw new HttpError(404, `Variant not found for ${product.name}`);
            if (variant.stock < item.quantity) throw new HttpError(400, `Insufficient stock for ${product.name} - ${variant.name}`);
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

        const createdOrderItems = await OrderItem.insertMany(
          orderItemDrafts.map((item) => ({ ...item, orderId: existingOrder._id })),
          { session: mongoSession }
        );

        existingOrder.userId = user._id;
        existingOrder.items = createdOrderItems.map((item) => item._id);
        existingOrder.subtotal = subtotal;
        existingOrder.shippingCost = shippingCost;
        existingOrder.taxAmount = taxAmount;
        existingOrder.cgst = cgst;
        existingOrder.sgst = sgst;
        existingOrder.igst = igst;
        existingOrder.isIntraState = isIntraState;
        existingOrder.discountAmount = discountAmount;
        existingOrder.totalAmount = totalAmount;
        existingOrder.paymentMethod = paymentMethod;
        existingOrder.shippingAddressId = shippingAddress._id;
        existingOrder.billingAddressId = shippingAddress._id;
        existingOrder.notes = body.notes || existingOrder.notes;
        await existingOrder.save({ session: mongoSession });

        // ── Decrement stock for the new item list ────────────────────────
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
            throw new HttpError(409, 'Stock changed concurrently for one of the items — please retry');
          }
          stockDecrements.push({ productId: item.productId, quantity: item.quantity, balanceAfter: updated.stock });
        }

        order = existingOrder;
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
    for (const r of stockRestorations) {
      await logStockMovement({
        productId: r.productId,
        movementType: 'in',
        quantity: r.quantity,
        reason: 'return',
        balanceAfter: r.balanceAfter,
        performedBy: session.user.id,
        reference: order.orderNumber,
        notes: `Invoice ${order.invoiceNumber} edited — reversing previous line item`,
      });
    }
    for (const d of stockDecrements) {
      await logStockMovement({
        productId: d.productId,
        movementType: 'out',
        quantity: d.quantity,
        reason: 'sale',
        balanceAfter: d.balanceAfter,
        performedBy: session.user.id,
        reference: order.orderNumber,
        notes: `Invoice ${order.invoiceNumber} edited`,
      });
    }

    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'manual_invoice_edited',
        entityType: 'order',
        entityId: order._id,
        details: { orderNumber: order.orderNumber, invoiceNumber: order.invoiceNumber, totalAmount: order.totalAmount },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber,
      totalAmount: order.totalAmount,
    });
  } catch (error: any) {
    console.error('Manual invoice edit error:', error);
    return NextResponse.json({ error: 'Failed to update invoice', details: error.message }, { status: 500 });
  }
}
