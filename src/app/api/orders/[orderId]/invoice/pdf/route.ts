import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import '@/models/OrderItem';
import '@/models/Address';
import { getOrCreateInvoiceNumber } from '@/lib/invoice/getOrCreateInvoiceNumber';
import { generateInvoicePDF, PopulatedOrderForInvoice } from '@/lib/pdf/invoice-generator';

/**
 * GET /api/orders/[orderId]/invoice/pdf
 * Generate and return a downloadable PDF invoice for an order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Get session
    const session = await getSession();
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { orderId } = await params;

    // Connect to database
    await connectDB();

    // orderId can be either MongoDB ObjectId or orderNumber
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(orderId);
    const query: any = isObjectId ? { _id: orderId } : { orderNumber: orderId };
    if (session.user.role !== 'admin') {
      query.userId = session.user.id;
    }

    const order = (await Order.findOne(query)
      .populate('userId', 'name email')
      .populate('shippingAddressId')
      .populate('items')
      .lean()) as any;

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    // Get or create invoice number
    const invoiceNumber = await getOrCreateInvoiceNumber(order._id);

    // Prepare order data for PDF generation
    // Add invoiceNumber to the order object
    const orderWithInvoiceNumber = {
      ...order,
      invoiceNumber,
    } as PopulatedOrderForInvoice;

    // Generate PDF buffer
    const pdfBuffer = await generateInvoicePDF(orderWithInvoiceNumber);

    // Sanitize invoice number for filename (replace / with -)
    const sanitizedInvoiceNumber = invoiceNumber.replace(/\//g, '-');
    const filename = `invoice-${sanitizedInvoiceNumber}.pdf`;

    // Return PDF with proper headers
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Failed to generate PDF invoice:', error);
    return new NextResponse('Failed to generate PDF invoice', { status: 500 });
  }
}
