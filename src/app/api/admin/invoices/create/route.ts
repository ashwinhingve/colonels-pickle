import { NextRequest, NextResponse } from 'next/server';
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

    await connectDB();

    // ── Resolve or create the customer ────────────────────────────
    let user;
    if (body.customer.userId) {
      user = await User.findById(body.customer.userId);
      if (!user) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
    } else {
      if (!body.customer.phoneNumber && !body.customer.email) {
        return NextResponse.json(
          { error: 'A phone number or email is required to create a new customer' },
          { status: 400 }
        );
      }
      user = await User.create({
        name: body.customer.name,
        email: body.customer.email || undefined,
        phoneNumber: body.customer.phoneNumber || undefined,
        role: 'client',
      });
    }

    // ── Address for this invoice ───────────────────────────────────
    const shippingAddress = await Address.create({
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
    });

    // ── Resolve products, mirroring checkout/create-order ──────────
    const uniqueProductIds = [...new Set(body.items.map((item: any) => item.productId))];
    const products = await Product.find({ _id: { $in: uniqueProductIds } });

    if (products.length !== uniqueProductIds.length) {
      return NextResponse.json({ error: 'Some products were not found' }, { status: 404 });
    }

    for (const item of body.items) {
      if (!item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: 'Every line item needs a quantity of at least 1' }, { status: 400 });
      }
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) continue;

      if (item.variantId) {
        const variant = product.variants.find((v: any) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ error: `Variant not found for ${product.name}` }, { status: 404 });
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name} - ${variant.name}` },
            { status: 400 }
          );
        }
      } else if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
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
        const variant = product.variants.find((v: any) => v.id === item.variantId);
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
    const order = await Order.create({
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
    });

    const createdOrderItems = await OrderItem.insertMany(
      orderItemDrafts.map((item) => ({ ...item, orderId: order._id }))
    );
    order.items = createdOrderItems.map((item) => item._id);
    await order.save();

    const invoiceNumber = await getOrCreateInvoiceNumber(order._id);

    // ── Decrement stock immediately (no payment webhook will fire) ──
    for (const item of body.items) {
      let updated: IProduct | null;
      if (item.variantId) {
        updated = await Product.findOneAndUpdate(
          { _id: item.productId, variants: { $elemMatch: { id: item.variantId, stock: { $gte: item.quantity } } } },
          { $inc: { 'variants.$.stock': -item.quantity, stock: -item.quantity } },
          { new: true }
        );
      } else {
        updated = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }

      if (updated) {
        await logStockMovement({
          productId: item.productId,
          movementType: 'out',
          quantity: item.quantity,
          reason: 'sale',
          balanceAfter: updated.stock,
          performedBy: session.user.id,
          reference: order.orderNumber,
          notes: `Manual invoice ${invoiceNumber}`,
        });
      }
    }

    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'manual_invoice_created',
        entityType: 'order',
        entityId: order._id,
        details: { orderNumber: order.orderNumber, invoiceNumber, totalAmount },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        invoiceNumber,
        totalAmount,
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
