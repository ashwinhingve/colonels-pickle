import QRCode from 'qrcode';

/**
 * Shared UPI payment-QR helper, used by both the PDF invoice generator and the
 * HTML print/view invoice so "Print" and "Download PDF" always show the same
 * payment QR for the same order.
 *
 * VPA (Virtual Payment Address) format: alphanumeric/./-/_ local part, then
 * "@", then a bank/PSP handle — e.g. "9717243306@ptsbi", "colonelspickle@okhdfcbank".
 */
const VPA_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{1,64}$/;

export function isValidUpiVpa(vpa: string | undefined | null): vpa is string {
  return typeof vpa === 'string' && VPA_REGEX.test(vpa.trim());
}

/**
 * Build a `upi://pay` deep link for the exact invoice amount. Returns null
 * (rather than a broken link) when the configured VPA is missing/invalid or
 * the amount isn't a positive finite number — callers should skip rendering
 * a QR entirely in that case instead of showing a QR that can't be paid.
 */
export function buildUpiPaymentUri(params: {
  upiId: string | undefined | null;
  payeeName: string;
  amount: number;
  note: string;
}): string | null {
  const { upiId, payeeName, amount, note } = params;

  if (!isValidUpiVpa(upiId)) return null;
  if (!Number.isFinite(amount) || amount <= 0) return null;

  return `upi://pay?pa=${encodeURIComponent(upiId.trim())}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
}

/** Render a `upi://pay` URI to a PNG QR code buffer. */
export async function renderUpiQrPng(upiUri: string): Promise<Buffer> {
  return QRCode.toBuffer(upiUri, {
    type: 'png',
    width: 150,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

/**
 * Convenience wrapper: build + render in one call. Returns null if the UPI
 * config/amount is invalid so the caller can render a "not configured" note
 * instead of a broken QR image.
 */
export async function generateUpiQrForPayment(params: {
  upiId: string | undefined | null;
  payeeName: string;
  amount: number;
  note: string;
}): Promise<{ uri: string; png: Buffer } | null> {
  const uri = buildUpiPaymentUri(params);
  if (!uri) return null;
  try {
    const png = await renderUpiQrPng(uri);
    return { uri, png };
  } catch (error) {
    console.warn('Could not generate UPI QR code:', error);
    return null;
  }
}
