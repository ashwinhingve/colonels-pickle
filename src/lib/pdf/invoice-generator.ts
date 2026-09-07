import PDFDocument from 'pdfkit';
import { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { BRAND, REGISTRATIONS, BANK_DETAILS } from '@/lib/constants';
import { extractGST } from '@/lib/gst';
import { generateUpiQrForPayment } from '@/lib/payment/upiQr';
import { numberToIndianWords } from '@/lib/utils/numberToWords';
import Order from '@/models/Order';
import User from '@/models/User';
import SiteSettings from '@/models/SiteSettings';

interface BusinessProfile {
  gstin: string;
  fssai: string;
  pan?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  gstin: REGISTRATIONS.find((reg) => reg.key === 'gst')?.number || '08BFKPD8446R1ZM',
  fssai: REGISTRATIONS.find((reg) => reg.key === 'fssai')?.number || BRAND.fssai,
  addressLine1: BRAND.address.line1,
  addressLine2: BRAND.address.line2 || undefined,
  city: BRAND.address.city,
  state: BRAND.address.state,
  postalCode: BRAND.address.pin,
};

/**
 * Bank/UPI details and business profile (GSTIN/FSSAI/address) are admin-editable
 * (SiteSettings.paymentSettings / SiteSettings.businessProfile). Constants are
 * kept only as a fallback for the rare case a settings doc predates these
 * fields (should never happen post-migration, since the schema itself
 * defaults every subfield to the same values).
 */
async function getInvoiceSettings(): Promise<{
  paymentDetails: typeof BANK_DETAILS;
  businessProfile: BusinessProfile;
}> {
  try {
    const settings = await SiteSettings.findOne({ key: 'global' }).lean() as any;
    return {
      paymentDetails: settings?.paymentSettings || BANK_DETAILS,
      businessProfile: settings?.businessProfile
        ? { ...DEFAULT_BUSINESS_PROFILE, ...settings.businessProfile }
        : DEFAULT_BUSINESS_PROFILE,
    };
  } catch (error) {
    console.warn('Could not fetch site settings from DB, using constants fallback:', error);
    return { paymentDetails: BANK_DETAILS, businessProfile: DEFAULT_BUSINESS_PROFILE };
  }
}

/**
 * Invoice data structure — ensures all required fields are present before PDF generation.
 * Order must have been populated and have invoiceNumber already assigned.
 */
export interface PopulatedOrderForInvoice {
  _id: string | Types.ObjectId;
  orderNumber: string;
  invoiceNumber: string; // REQUIRED — must be set by caller before calling this function
  createdAt: Date;
  userId: {
    _id?: string | Types.ObjectId;
    name: string;
    email: string;
  };
  shippingAddressId: {
    _id?: string | Types.ObjectId;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    phoneNumber: string;
  };
  items: Array<{
    _id?: string | Types.ObjectId;
    productName: string;
    productSku: string;
    gstRate: number;
    hsnCode?: string;
    priceAtPurchase: number;
    quantity: number;
  }>;
  subtotal: number;
  taxAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  isIntraState: boolean;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
}

/**
 * Generate a GST-compliant invoice PDF buffer.
 *
 * Behavior:
 * - Throws if invoiceNumber is missing (programming error by caller)
 * - Uses stored order totals for summary (not recomputed via calculateOrderGST)
 * - Computes per-line amounts via extractGST for accuracy
 * - Gracefully skips logo if file cannot be read
 * - Encodes UPI QR code for payment
 *
 * @param order - Populated order object with invoiceNumber already set
 * @returns Promise resolving to PDF buffer
 */
export async function generateInvoicePDF(
  order: PopulatedOrderForInvoice
): Promise<Buffer> {
  // Validate required fields
  if (!order.invoiceNumber || order.invoiceNumber.trim() === '') {
    throw new Error(
      `Order ${order.orderNumber} is missing invoiceNumber. ` +
        'Invoice numbers must be assigned by calling getOrCreateInvoiceNumber() before PDF generation.'
    );
  }

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const buffers: Buffer[] = [];

  // Collect output into buffers
  doc.on('data', buffers.push.bind(buffers));

  return new Promise(async (resolve, reject) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    doc.on('error', reject);

    try {
      await renderInvoicePDF(doc, order);
      doc.end();
    } catch (error) {
      doc.destroy();
      reject(error);
    }
  });
}

/**
 * Render invoice content into the PDF document.
 * Modular rendering function separated for clarity and testability.
 */
async function renderInvoicePDF(
  doc: PDFKit.PDFDocument,
  order: PopulatedOrderForInvoice
): Promise<void> {
  const { paymentDetails, businessProfile } = await getInvoiceSettings();
  const gstin = businessProfile.gstin;

  // ===== HEADER BAND =====
  // Logo (left) — full official crest + wordmark
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      doc.image(logoBuffer, 40, 40, { width: 50, height: 50 });
    }
  } catch (error) {
    // Silently skip logo if file cannot be read
    console.warn('Could not load logo for invoice:', error);
  }

  // Company heading (center-left area, next to logo)
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .text("COLONEL'S PICKLE", 100, 45, { width: 300 });
  doc
    .fontSize(10)
    .font('Helvetica')
    .text('by Ridhwika Agro Organics', 100, 65);
  doc
    .fontSize(9)
    .font('Helvetica-Oblique')
    .text('HOME MADE – Maa Ka Pyaar, Ghar Ka Achar', 100, 78);

  // Business address & contact (right side)
  const addressX = 400;
  doc.fontSize(9).font('Helvetica');
  doc.text(businessProfile.addressLine1, addressX, 45);
  doc.text(`${businessProfile.city}, ${businessProfile.state} – ${businessProfile.postalCode}`, addressX, 57);
  doc.text(`Phone: ${BRAND.phones[0]}`, addressX, 69);
  doc.text(`Email: ${BRAND.email}`, addressX, 81);

  // Divider line
  doc
    .moveTo(40, 100)
    .lineTo(555, 100)
    .stroke();

  // ===== TAX INVOICE TITLE =====
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('TAX INVOICE', { align: 'center', width: 515 });
  doc
    .fontSize(8)
    .font('Helvetica')
    .text('ORIGINAL FOR RECIPIENT', { align: 'right' });

  // GSTIN / FSSAI labels
  doc.fontSize(9).text(`GSTIN: ${gstin}    FSSAI: ${businessProfile.fssai}`, 40, doc.y + 5);

  // ===== INVOICE METADATA =====
  const metaY = doc.y + 15;
  doc.fontSize(9).font('Helvetica');
  doc.text(`Invoice No.: ${order.invoiceNumber}`, 40, metaY);
  doc.text(
    `Invoice Date: ${formatDateDDMMMYYYY(order.createdAt)}`,
    40,
    metaY + 15
  );

  // ===== CUSTOMER DETAILS =====
  const custY = metaY + 40;
  doc.fontSize(10).font('Helvetica-Bold').text('CUSTOMER DETAILS', 40, custY);

  doc.fontSize(9).font('Helvetica');
  doc.text(`Name: ${order.userId.name}`, 40, custY + 18);
  doc.text(`Email: ${order.userId.email || 'N/A'}`, 40, custY + 30);

  // Address block
  const addrLine = [
    order.shippingAddressId.addressLine1,
    order.shippingAddressId.addressLine2,
    `${order.shippingAddressId.city}, ${order.shippingAddressId.state} ${order.shippingAddressId.postalCode}`,
  ]
    .filter(Boolean)
    .join('\n');

  doc.text(`Address:\n${addrLine}`, 40, custY + 42);
  doc.text(`Phone: ${order.shippingAddressId.phoneNumber}`, 40, doc.y + 5);
  doc.text(`Place of Supply: ${order.shippingAddressId.state}`, 40, doc.y + 10);

  // ===== LINE ITEMS TABLE =====
  const tableY = doc.y + 20;
  const colWidths = {
    srNo: 30,
    product: 150,
    hsn: 50,
    qty: 35,
    rate: 60,
    disc: 50,
    taxable: 65,
    taxPct: 40,
    taxAmt: 60,
    total: 65,
  };

  // Table header
  doc.fontSize(8).font('Helvetica-Bold');
  const headerY = tableY;
  doc.rect(40, headerY, 515, 15).fillAndStroke('white', '#cccccc');
  doc.fillColor('black');
  doc.text('Sr.', 40, headerY + 3, { width: colWidths.srNo, align: 'center' });
  doc.text('Product Name', 70, headerY + 3, {
    width: colWidths.product,
    align: 'left',
  });
  doc.text('HSN/SAC', 220, headerY + 3, { width: colWidths.hsn, align: 'center' });
  doc.text('Qty', 270, headerY + 3, { width: colWidths.qty, align: 'center' });
  doc.text('Rate', 305, headerY + 3, { width: colWidths.rate, align: 'right' });
  doc.text('Disc.', 365, headerY + 3, { width: colWidths.disc, align: 'right' });
  doc.text('Taxable', 415, headerY + 3, {
    width: colWidths.taxable,
    align: 'right',
  });
  doc.text('Tax%', 480, headerY + 3, { width: colWidths.taxPct, align: 'right' });

  // Tax amount header (CGST+SGST or IGST based on intrastate flag)
  const taxHeader = order.isIntraState ? 'CGST+SGST' : 'IGST';
  doc.text(taxHeader, 520, headerY + 3, {
    width: colWidths.taxAmt,
    align: 'right',
  });

  // Items rows
  let currentY = headerY + 15;
  let totalQty = 0;
  let totalDiscount = 0;
  let totalTaxableValue = 0;
  let totalTaxAmount = 0;

  doc.fontSize(8).font('Helvetica');

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    const srNo = i + 1;

    // Extract per-line tax breakdown
    const { base: taxableAmount, gst: itemTaxAmount } = extractGST(
      item.priceAtPurchase,
      item.gstRate
    );
    const lineTotalTaxable = taxableAmount * item.quantity;
    const lineTotalTax = itemTaxAmount * item.quantity;
    const lineTotal = lineTotalTaxable + lineTotalTax;

    // Accumulate totals
    totalQty += item.quantity;
    totalTaxableValue += lineTotalTaxable;
    totalTaxAmount += lineTotalTax;

    // Render row
    doc.text(String(srNo), 40, currentY, {
      width: colWidths.srNo,
      align: 'center',
    });
    doc.text(item.productName, 70, currentY, {
      width: colWidths.product,
      align: 'left',
    });
    doc.text(item.hsnCode || '2001', 220, currentY, { width: colWidths.hsn, align: 'center' });
    doc.text(String(item.quantity), 270, currentY, {
      width: colWidths.qty,
      align: 'center',
    });
    doc.text(`₹${formatINR(item.priceAtPurchase)}`, 305, currentY, {
      width: colWidths.rate,
      align: 'right',
    });
    doc.text('₹0', 365, currentY, { width: colWidths.disc, align: 'right' });
    doc.text(`₹${formatINR(lineTotalTaxable)}`, 415, currentY, {
      width: colWidths.taxable,
      align: 'right',
    });
    doc.text(`${item.gstRate}%`, 480, currentY, {
      width: colWidths.taxPct,
      align: 'right',
    });
    doc.text(`₹${formatINR(lineTotalTax)}`, 520, currentY, {
      width: colWidths.taxAmt,
      align: 'right',
    });

    currentY += 12;
  }

  // Totals row
  const totalsY = currentY + 5;
  doc
    .rect(40, totalsY - 2, 515, 15)
    .fillAndStroke('white', '#cccccc');
  doc.fillColor('black').font('Helvetica-Bold');

  doc.text('TOTAL', 40, totalsY + 2, {
    width: colWidths.srNo + colWidths.product - 30,
    align: 'right',
  });
  doc.text(String(totalQty), 270, totalsY + 2, {
    width: colWidths.qty,
    align: 'center',
  });
  doc.text('', 305, totalsY + 2, { width: colWidths.rate, align: 'right' });
  doc.text('₹0', 365, totalsY + 2, { width: colWidths.disc, align: 'right' });
  doc.text(`₹${formatINR(totalTaxableValue)}`, 415, totalsY + 2, {
    width: colWidths.taxable,
    align: 'right',
  });
  doc.text('', 480, totalsY + 2, { width: colWidths.taxPct, align: 'right' });
  doc.text(`₹${formatINR(totalTaxAmount)}`, 520, totalsY + 2, {
    width: colWidths.taxAmt,
    align: 'right',
  });

  // ===== TOTALS SUMMARY SECTION =====
  const summaryY = totalsY + 25;
  doc.fontSize(9).font('Helvetica');

  doc.text('Taxable Value:', 40, summaryY);
  doc.text(`₹${formatINR(order.subtotal - order.taxAmount)}`, 480, summaryY, {
    width: 75,
    align: 'right',
  });

  let lineY = summaryY + 12;

  if (order.isIntraState) {
    doc.text('CGST:', 40, lineY);
    doc.text(`₹${formatINR(order.cgst)}`, 480, lineY, { width: 75, align: 'right' });
    lineY += 12;

    doc.text('SGST:', 40, lineY);
    doc.text(`₹${formatINR(order.sgst)}`, 480, lineY, { width: 75, align: 'right' });
    lineY += 12;
  } else {
    doc.text('IGST:', 40, lineY);
    doc.text(`₹${formatINR(order.igst)}`, 480, lineY, { width: 75, align: 'right' });
    lineY += 12;
  }

  if (order.shippingCost > 0) {
    doc.text('Shipping:', 40, lineY);
    doc.text(`₹${formatINR(order.shippingCost)}`, 480, lineY, { width: 75, align: 'right' });
    lineY += 12;
  }

  if (order.discountAmount > 0) {
    doc.text('Discount:', 40, lineY);
    doc.text(`-₹${formatINR(order.discountAmount)}`, 480, lineY, { width: 75, align: 'right' });
    lineY += 12;
  }

  const grandTotalY = lineY + 12;

  doc.fontSize(11).font('Helvetica-Bold');
  doc.text('Grand Total:', 40, grandTotalY);
  doc.text(`₹${formatINR(order.totalAmount)}`, 480, grandTotalY, {
    width: 75,
    align: 'right',
  });

  // ===== AMOUNT IN WORDS =====
  const wordsY = grandTotalY + 20;
  doc.fontSize(9).font('Helvetica');
  doc.text('Amount in Words:', 40, wordsY);
  doc.text(numberToIndianWords(order.totalAmount), 40, wordsY + 12, {
    width: 515,
  });

  // ===== BANK DETAILS & UPI QR CODE =====
  const bankY = wordsY + 40;
  doc.fontSize(10).font('Helvetica-Bold').text('Bank Details', 40, bankY);

  doc.fontSize(9).font('Helvetica');
  doc.text(`Account Name: ${paymentDetails.accountName}`, 40, bankY + 18);
  doc.text(`Bank: ${paymentDetails.bankName}`, 40, bankY + 28);
  doc.text(`Branch: ${paymentDetails.branch}`, 40, bankY + 38);
  doc.text(`Account No.: ${paymentDetails.accountNumber}`, 40, bankY + 48);
  doc.text(`IFSC: ${paymentDetails.ifsc}`, 40, bankY + 58);
  doc.text(`UPI: ${paymentDetails.upiId}`, 40, bankY + 68);

  // Generate UPI QR code — skips cleanly (no broken image) if the configured
  // UPI ID is missing/invalid or the amount isn't a valid positive number.
  const upiQr = await generateUpiQrForPayment({
    upiId: paymentDetails.upiId,
    payeeName: paymentDetails.accountName,
    amount: order.totalAmount,
    note: `Invoice ${order.invoiceNumber}`,
  });

  if (upiQr) {
    doc.image(upiQr.png, 450, bankY + 18, { width: 90, height: 90 });
  } else {
    doc.fontSize(8).font('Helvetica').text('UPI payment not configured', 450, bankY + 50, {
      width: 90,
      align: 'center',
    });
  }

  // ===== FOOTER =====
  const footerY = bankY + 100;
  doc
    .fontSize(8)
    .font('Helvetica')
    .text(
      'E. & O.E. — Certified that the particulars given above are true and correct.',
      40,
      footerY
    );

  doc.text('For Colonel\'s Pickle by Ridhwika Agro Organics', 420, footerY, {
    width: 100,
    align: 'center',
  });
  doc.text('Authorised Signatory', 420, footerY + 40, {
    width: 100,
    align: 'center',
  });

  // Footer divider
  doc
    .moveTo(40, footerY - 5)
    .lineTo(555, footerY - 5)
    .stroke();

  // Compliance note
  doc
    .fontSize(7)
    .font('Helvetica-Oblique')
    .text(
      'This is a computer-generated invoice and does not require a physical signature.',
      40,
      doc.y + 10
    );
}

/**
 * Format amount as INR with 2 decimal places using en-IN locale.
 */
function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date as DD-MMM-YYYY (e.g., "22-Aug-2026").
 */
function formatDateDDMMMYYYY(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
