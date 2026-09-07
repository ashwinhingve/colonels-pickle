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

/** Brand palette used throughout the PDF (matches src/styles/globals.css cp-* tokens). */
const COLORS = {
  heading: '#4B5D2A',
  accent: '#C05621',
  moneyTint: '#FBE5D6',
  totalsTint: '#F0C9A8',
  sectionTint: '#FBF4E7',
  text: '#2A2417',
  textMuted: '#6B6455',
  gridLine: '#E4D9C4',
} as const;

/** Cumulative x-offset of column `index` given an array of column widths. */
function colX(widths: number[], index: number, startX: number): number {
  let x = startX;
  for (let i = 0; i < index; i++) x += widths[i];
  return x;
}

/** Draws a bordered rectangle (optionally filled), then resets fill color for subsequent text. */
function drawBox(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { fillColor?: string; strokeColor?: string; lineWidth?: number } = {}
): void {
  const { fillColor, strokeColor = COLORS.gridLine, lineWidth = 0.75 } = options;
  doc.lineWidth(lineWidth);
  if (fillColor) {
    doc.rect(x, y, width, height).fillAndStroke(fillColor, strokeColor);
  } else {
    doc.rect(x, y, width, height).stroke(strokeColor);
  }
  doc.fillColor(COLORS.text);
}

const PAGE_LEFT = 40;
const PAGE_RIGHT = 555;
const PAGE_WIDTH = PAGE_RIGHT - PAGE_LEFT; // 515

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
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      doc.image(logoBuffer, PAGE_LEFT, 40, { width: 54, height: 54 });
    }
  } catch (error) {
    console.warn('Could not load logo for invoice:', error);
  }

  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .fillColor(COLORS.text)
    .text("COLONEL'S PICKLE", 104, 44, { width: 260 });
  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor(COLORS.heading)
    .text('by Ridhwika Agro Organics', 104, 65);
  doc
    .fontSize(9)
    .font('Helvetica-Oblique')
    .fillColor(COLORS.textMuted)
    .text('HOME MADE – Maa Ka Pyaar, Ghar Ka Achar', 104, 78);

  const addressX = 400;
  const addressWidth = PAGE_RIGHT - addressX;
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text);
  doc.text(businessProfile.addressLine1, addressX, 45, { width: addressWidth, align: 'right' });
  doc.text(
    `${businessProfile.city}, ${businessProfile.state} – ${businessProfile.postalCode}`,
    addressX,
    57,
    { width: addressWidth, align: 'right' }
  );
  doc.text(`Phone: ${BRAND.phones[0]}`, addressX, 69, { width: addressWidth, align: 'right' });
  doc.text(`Email: ${BRAND.email}`, addressX, 81, { width: addressWidth, align: 'right' });

  let currentY = 100;
  doc.moveTo(PAGE_LEFT, currentY).lineTo(PAGE_RIGHT, currentY).lineWidth(2).strokeColor(COLORS.accent).stroke();
  currentY += 12;

  // ===== TITLE STRIP =====
  const titleBoxHeight = 34;
  drawBox(doc, PAGE_LEFT, currentY, PAGE_WIDTH, titleBoxHeight, { fillColor: COLORS.sectionTint });
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text).text(`GSTIN: ${gstin}`, PAGE_LEFT + 8, currentY + 7);
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text).text(`FSSAI: ${businessProfile.fssai}`, PAGE_LEFT + 8, currentY + 19);
  doc.fontSize(16).font('Helvetica-Bold').fillColor(COLORS.accent)
    .text('TAX INVOICE', PAGE_LEFT, currentY + 9, { width: PAGE_WIDTH, align: 'center' });
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.textMuted)
    .text('ORIGINAL FOR RECIPIENT', PAGE_LEFT, currentY + 6, { width: PAGE_WIDTH - 8, align: 'right' });
  currentY += titleBoxHeight + 10;

  // ===== CUSTOMER DETAILS + INVOICE META (side-by-side box) =====
  const custLeftX = PAGE_LEFT + 8;
  const custLeftWidth = 260;
  const dividerX = PAGE_LEFT + 300;
  const custRightX = dividerX + 12;

  const addrText = [
    order.shippingAddressId.addressLine1,
    order.shippingAddressId.addressLine2,
    `${order.shippingAddressId.city}, ${order.shippingAddressId.state} ${order.shippingAddressId.postalCode}`,
  ]
    .filter(Boolean)
    .join('\n');

  doc.fontSize(9).font('Helvetica');
  const addrBlockHeight = doc.heightOfString(addrText, { width: custLeftWidth });
  const leftContentHeight = 14 + 12 + 12 + 12 + addrBlockHeight + 12 + 12;
  const rightContentHeight = 14 + 16 + 16;
  const custBoxHeight = Math.max(leftContentHeight, rightContentHeight) + 16;

  drawBox(doc, PAGE_LEFT, currentY, PAGE_WIDTH, custBoxHeight, { fillColor: COLORS.sectionTint });
  doc.moveTo(dividerX, currentY + 6).lineTo(dividerX, currentY + custBoxHeight - 6)
    .lineWidth(0.75).strokeColor(COLORS.gridLine).stroke();

  let ly = currentY + 10;
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.heading).text('CUSTOMER DETAILS', custLeftX, ly);
  ly += 14;
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text);
  doc.text(`Name: ${order.userId.name}`, custLeftX, ly);
  ly += 12;
  doc.text(`Email: ${order.userId.email || 'N/A'}`, custLeftX, ly);
  ly += 12;
  doc.text('Address:', custLeftX, ly);
  ly += 12;
  doc.text(addrText, custLeftX, ly, { width: custLeftWidth });
  ly += addrBlockHeight + 2;
  doc.text(`Phone: ${order.shippingAddressId.phoneNumber}`, custLeftX, ly);
  ly += 12;
  doc.text(`Place of Supply: ${order.shippingAddressId.state}`, custLeftX, ly);

  let ry = currentY + 10;
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.heading).text('INVOICE DETAILS', custRightX, ry);
  ry += 16;
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text);
  doc.text(`Invoice No.: ${order.invoiceNumber}`, custRightX, ry);
  ry += 16;
  doc.text(`Invoice Date: ${formatDateDDMMMYYYY(order.createdAt)}`, custRightX, ry);

  currentY += custBoxHeight + 12;

  // ===== LINE ITEMS TABLE =====
  // [sr, product, hsn, qty, rate, disc, taxable, taxPct, taxAmt, total] — sums to PAGE_WIDTH (515)
  // Money columns are sized generously since "Rs. 1,234.56" (used instead of "₹" — pdfkit's
  // standard Helvetica font has no glyph for the rupee sign) is wider than a single symbol.
  const colWidths = [20, 132, 38, 25, 58, 42, 65, 28, 52, 55];
  const headerRowHeight = 24;
  const totalsRowHeight = 16;
  const productColWidth = colWidths[1] - 8;

  // Row heights are measured per item so long product names (which wrap to 2+ lines)
  // never collide with the row below — a fixed row height caused exactly that bug.
  doc.fontSize(8).font('Helvetica');
  const itemRowHeights = order.items.map((item) =>
    Math.max(14, doc.heightOfString(item.productName, { width: productColWidth }) + 4)
  );
  const itemsTotalHeight = itemRowHeights.reduce((sum, h) => sum + h, 0);
  const tableHeight = headerRowHeight + itemsTotalHeight + totalsRowHeight;

  // Minimal pagination safety net: large orders shouldn't have their table split mid-row.
  if (doc.page.height - PAGE_LEFT - currentY < Math.min(tableHeight, 200)) {
    doc.addPage();
    currentY = 40;
  }

  const tableTop = currentY;
  const totalsRowY = tableTop + headerRowHeight + itemsTotalHeight;

  // --- Fills first (so grid lines and text always render on top) ---
  const moneyTintX = colX(colWidths, 6, PAGE_LEFT); // start of Taxable column
  const moneyTintWidth = PAGE_RIGHT - moneyTintX;
  doc.rect(moneyTintX, tableTop, moneyTintWidth, tableHeight).fill(COLORS.moneyTint);
  doc.rect(PAGE_LEFT, totalsRowY, PAGE_WIDTH, totalsRowHeight).fill(COLORS.totalsTint);
  doc.fillColor(COLORS.text);

  // --- Grid lines ---
  doc.lineWidth(0.75).rect(PAGE_LEFT, tableTop, PAGE_WIDTH, tableHeight).stroke(COLORS.text);
  let vx = PAGE_LEFT;
  for (let i = 0; i < colWidths.length - 1; i++) {
    vx += colWidths[i];
    doc.moveTo(vx, tableTop).lineTo(vx, tableTop + tableHeight).lineWidth(0.5).strokeColor(COLORS.gridLine).stroke();
  }
  doc.moveTo(PAGE_LEFT, tableTop + headerRowHeight).lineTo(PAGE_RIGHT, tableTop + headerRowHeight)
    .lineWidth(0.75).strokeColor(COLORS.text).stroke();
  {
    let rowLineY = tableTop + headerRowHeight;
    for (const h of itemRowHeights) {
      rowLineY += h;
      doc.moveTo(PAGE_LEFT, rowLineY).lineTo(PAGE_RIGHT, rowLineY).lineWidth(0.4).strokeColor(COLORS.gridLine).stroke();
    }
  }

  // Two-level tax header divider (merged label on top, %/Amount sub-cells below)
  const taxHeaderLabel = order.isIntraState ? 'CGST+SGST' : 'IGST';
  const taxMergeX = colX(colWidths, 7, PAGE_LEFT);
  const taxMergeWidth = colWidths[7] + colWidths[8];
  doc.moveTo(taxMergeX, tableTop + 12).lineTo(taxMergeX + taxMergeWidth, tableTop + 12)
    .lineWidth(0.5).strokeColor(COLORS.gridLine).stroke();
  doc.moveTo(taxMergeX + colWidths[7], tableTop + 12).lineTo(taxMergeX + colWidths[7], tableTop + headerRowHeight)
    .lineWidth(0.5).strokeColor(COLORS.gridLine).stroke();

  // --- Header text ---
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.text);
  const headerLabels: Array<{ idx: number; text: string; align: 'left' | 'center' | 'right' }> = [
    { idx: 0, text: 'Sr.', align: 'center' },
    { idx: 1, text: 'Product Name', align: 'left' },
    { idx: 2, text: 'HSN/SAC', align: 'center' },
    { idx: 3, text: 'Qty', align: 'center' },
    { idx: 4, text: 'Rate', align: 'right' },
    { idx: 5, text: 'Disc.', align: 'right' },
    { idx: 6, text: 'Taxable', align: 'right' },
    { idx: 9, text: 'Total', align: 'right' },
  ];
  for (const h of headerLabels) {
    const x = colX(colWidths, h.idx, PAGE_LEFT) + 3;
    doc.text(h.text, x, tableTop + 8, { width: colWidths[h.idx] - 6, align: h.align });
  }
  doc.text(taxHeaderLabel, taxMergeX, tableTop + 4, { width: taxMergeWidth, align: 'center' });
  doc.fontSize(7).font('Helvetica-Bold');
  doc.text('%', taxMergeX, tableTop + 14, { width: colWidths[7], align: 'center' });
  doc.text('Amount', taxMergeX + colWidths[7], tableTop + 14, { width: colWidths[8], align: 'center' });

  // --- Item rows ---
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.text);
  let totalQty = 0;
  let totalTaxableValue = 0;
  let totalTaxAmount = 0;
  let totalLineAmount = 0;

  let itemCursorY = tableTop + headerRowHeight;
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    const { base: taxableAmount, gst: itemTaxAmount } = extractGST(item.priceAtPurchase, item.gstRate);
    const lineTotalTaxable = taxableAmount * item.quantity;
    const lineTotalTax = itemTaxAmount * item.quantity;
    const lineTotal = lineTotalTaxable + lineTotalTax;

    totalQty += item.quantity;
    totalTaxableValue += lineTotalTaxable;
    totalTaxAmount += lineTotalTax;
    totalLineAmount += lineTotal;

    const rowY = itemCursorY + 3;
    doc.text(String(i + 1), colX(colWidths, 0, PAGE_LEFT) + 2, rowY, { width: colWidths[0] - 4, align: 'center' });
    doc.text(item.productName, colX(colWidths, 1, PAGE_LEFT) + 4, rowY, { width: colWidths[1] - 8, align: 'left' });
    doc.text(item.hsnCode || '2001', colX(colWidths, 2, PAGE_LEFT) + 2, rowY, { width: colWidths[2] - 4, align: 'center' });
    doc.text(String(item.quantity), colX(colWidths, 3, PAGE_LEFT) + 2, rowY, { width: colWidths[3] - 4, align: 'center' });
    doc.text(`Rs. ${formatINR(item.priceAtPurchase)}`, colX(colWidths, 4, PAGE_LEFT) + 2, rowY, { width: colWidths[4] - 6, align: 'right' });
    doc.text('Rs. 0.00', colX(colWidths, 5, PAGE_LEFT) + 2, rowY, { width: colWidths[5] - 6, align: 'right' });
    doc.text(`Rs. ${formatINR(lineTotalTaxable)}`, colX(colWidths, 6, PAGE_LEFT) + 2, rowY, { width: colWidths[6] - 6, align: 'right' });
    doc.text(`${item.gstRate}%`, colX(colWidths, 7, PAGE_LEFT), rowY, { width: colWidths[7] - 2, align: 'center' });
    doc.text(`Rs. ${formatINR(lineTotalTax)}`, colX(colWidths, 8, PAGE_LEFT) + 2, rowY, { width: colWidths[8] - 6, align: 'right' });
    doc.text(`Rs. ${formatINR(lineTotal)}`, colX(colWidths, 9, PAGE_LEFT) + 2, rowY, { width: colWidths[9] - 6, align: 'right' });

    itemCursorY += itemRowHeights[i];
  }

  // --- Totals row text ---
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.text);
  const totalsTextY = totalsRowY + 4;
  doc.text('TOTAL', colX(colWidths, 0, PAGE_LEFT) + 2, totalsTextY, { width: colWidths[0] + colWidths[1] - 4, align: 'right' });
  doc.text(String(totalQty), colX(colWidths, 3, PAGE_LEFT) + 2, totalsTextY, { width: colWidths[3] - 4, align: 'center' });
  doc.text(`Rs. ${formatINR(totalTaxableValue)}`, colX(colWidths, 6, PAGE_LEFT) + 2, totalsTextY, { width: colWidths[6] - 6, align: 'right' });
  doc.text(`Rs. ${formatINR(totalTaxAmount)}`, colX(colWidths, 8, PAGE_LEFT) + 2, totalsTextY, { width: colWidths[8] - 6, align: 'right' });
  doc.text(`Rs. ${formatINR(totalLineAmount)}`, colX(colWidths, 9, PAGE_LEFT) + 2, totalsTextY, { width: colWidths[9] - 6, align: 'right' });

  currentY = totalsRowY + totalsRowHeight + 14;

  // Keep the totals/bank/footer block together — avoid it being silently
  // cut off if the table pushed close to the page bottom.
  if (doc.page.height - PAGE_LEFT - currentY < 320) {
    doc.addPage();
    currentY = 40;
  }

  // ===== TOTALS SUMMARY (words + tax box, side by side) =====
  const summaryLeftWidth = 300;
  const summaryGap = 12;
  const summaryRightX = PAGE_LEFT + summaryLeftWidth + summaryGap;
  const summaryRightWidth = PAGE_WIDTH - summaryLeftWidth - summaryGap;

  const wordsText = numberToIndianWords(order.totalAmount);
  doc.fontSize(9).font('Helvetica');
  const wordsHeight = doc.heightOfString(wordsText, { width: summaryLeftWidth - 16 });

  const taxLines: Array<[string, number]> = [['Taxable Amount', order.subtotal - order.taxAmount]];
  if (order.isIntraState) {
    taxLines.push(['Add: CGST', order.cgst], ['Add: SGST', order.sgst]);
  } else {
    taxLines.push(['Add: IGST', order.igst]);
  }
  const totalTaxLine = order.isIntraState ? order.cgst + order.sgst : order.igst;
  taxLines.push(['Total Tax', totalTaxLine]);
  if (order.shippingCost > 0) taxLines.push(['Shipping', order.shippingCost]);
  if (order.discountAmount > 0) taxLines.push(['Discount', -order.discountAmount]);

  const leftContentHeight2 = 16 + wordsHeight + 10;
  const rightContentHeight2 = taxLines.length * 13 + 46;
  const summaryBoxHeight = Math.max(leftContentHeight2, rightContentHeight2, 70);

  drawBox(doc, PAGE_LEFT, currentY, summaryLeftWidth, summaryBoxHeight, { fillColor: COLORS.sectionTint });
  drawBox(doc, summaryRightX, currentY, summaryRightWidth, summaryBoxHeight, { fillColor: COLORS.sectionTint });

  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.heading)
    .text('Total in Words', PAGE_LEFT + 8, currentY + 8, { width: summaryLeftWidth - 16, align: 'center' });
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text)
    .text(wordsText, PAGE_LEFT + 8, currentY + 22, { width: summaryLeftWidth - 16, align: 'center' });

  let sy = currentY + 10;
  doc.fontSize(8.5).font('Helvetica').fillColor(COLORS.text);
  for (const [label, value] of taxLines) {
    doc.text(label, summaryRightX + 10, sy, { width: 110 });
    doc.text(`${value < 0 ? '-' : ''}Rs. ${formatINR(Math.abs(value))}`, summaryRightX + 10, sy, {
      width: summaryRightWidth - 20,
      align: 'right',
    });
    sy += 12;
  }
  sy += 4;
  doc.moveTo(summaryRightX + 10, sy).lineTo(summaryRightX + summaryRightWidth - 10, sy)
    .lineWidth(0.5).strokeColor(COLORS.gridLine).stroke();
  sy += 6;
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(COLORS.accent);
  doc.text('Total Amount After Tax', summaryRightX + 10, sy, { width: summaryRightWidth - 20 });
  sy += 13;
  doc.fontSize(13).font('Helvetica-Bold').fillColor(COLORS.accent);
  doc.text(`Rs. ${formatINR(order.totalAmount)}`, summaryRightX + 10, sy, { width: summaryRightWidth - 20, align: 'right' });

  currentY += summaryBoxHeight + 12;

  // ===== BANK DETAILS + UPI QR (fixed height — fixes the QR/footer overlap bug) =====
  const bankBoxHeight = 118;
  drawBox(doc, PAGE_LEFT, currentY, PAGE_WIDTH, bankBoxHeight, { fillColor: COLORS.sectionTint });

  const bankLeftX = PAGE_LEFT + 8;
  const bankLeftWidth = 300;
  const bankDividerX = PAGE_LEFT + 320;
  let by = currentY + 10;
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.heading).text('Bank Details', bankLeftX, by);
  by += 16;
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text);
  doc.text(`Account Name: ${paymentDetails.accountName}`, bankLeftX, by);
  by += 12;
  doc.text(`Bank: ${paymentDetails.bankName}`, bankLeftX, by, { width: bankLeftWidth });
  by += 12;
  doc.text(`Branch: ${paymentDetails.branch}`, bankLeftX, by, { width: bankLeftWidth });
  by += 24;
  doc.text(`Account No.: ${paymentDetails.accountNumber}`, bankLeftX, by);
  by += 12;
  doc.text(`IFSC: ${paymentDetails.ifsc}`, bankLeftX, by);
  by += 12;
  doc.text(`UPI: ${paymentDetails.upiId}`, bankLeftX, by);

  doc.moveTo(bankDividerX, currentY + 6).lineTo(bankDividerX, currentY + bankBoxHeight - 6)
    .lineWidth(0.75).strokeColor(COLORS.gridLine).stroke();

  const qrColX = bankDividerX + 12;
  const qrColWidth = PAGE_RIGHT - qrColX - 8;

  // Generate UPI QR code — skips cleanly (no broken image) if the configured
  // UPI ID is missing/invalid or the amount isn't a valid positive number.
  const upiQr = await generateUpiQrForPayment({
    upiId: paymentDetails.upiId,
    payeeName: paymentDetails.accountName,
    amount: order.totalAmount,
    note: `Invoice ${order.invoiceNumber}`,
  });

  if (upiQr) {
    const qrSize = 84;
    const qrX = qrColX + (qrColWidth - qrSize) / 2;
    doc.image(upiQr.png, qrX, currentY + 10, { width: qrSize, height: qrSize });
    doc.fontSize(7.5).font('Helvetica').fillColor(COLORS.textMuted)
      .text('Scan to Pay via UPI', qrColX, currentY + 10 + qrSize + 4, { width: qrColWidth, align: 'center' });
  } else {
    doc.fontSize(8).font('Helvetica').fillColor(COLORS.textMuted)
      .text('UPI payment not configured', qrColX, currentY + bankBoxHeight / 2 - 6, { width: qrColWidth, align: 'center' });
  }

  currentY += bankBoxHeight + 14;

  // Customer signature line (static — no data field needed)
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.text);
  doc.text('Customer Signature: ______________________', PAGE_LEFT, currentY);
  currentY += 24;

  // ===== FOOTER =====
  // footerY is always derived from the actual bottom of the sections above it
  // (never a hardcoded offset) — this is what prevents the QR/footer overlap.
  doc.moveTo(PAGE_LEFT, currentY).lineTo(PAGE_RIGHT, currentY).lineWidth(0.75).strokeColor(COLORS.gridLine).stroke();
  currentY += 10;

  doc.fontSize(8).font('Helvetica').fillColor(COLORS.text);
  doc.text(
    'E. & O.E. — Certified that the particulars given above are true and correct.',
    PAGE_LEFT,
    currentY,
    { width: 300 }
  );
  doc.text("For Colonel's Pickle by Ridhwika Agro Organics", 400, currentY, { width: 155, align: 'center' });
  doc.text('Authorised Signatory', 400, currentY + 30, { width: 155, align: 'center' });

  currentY += 50;
  doc.fontSize(7).font('Helvetica-Oblique').fillColor(COLORS.textMuted);
  doc.text(
    'This is a computer-generated invoice and does not require a physical signature.',
    PAGE_LEFT,
    currentY,
    { width: PAGE_WIDTH }
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
