import { createHmac, timingSafeEqual } from 'node:crypto';

export function validSignature(raw: string, signature: string | null, secret: string) {
  if (!secret || !signature || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(raw).digest();
  return timingSafeEqual(expected, Buffer.from(signature.slice(7), 'hex'));
}

export function safeSecretEqual(actual: string, expected: string) {
  if (!expected || !actual) return false;
  const a = Buffer.from(actual); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const deliveryRanks: Record<string, number> = { accepted: 0, sent: 1, delivered: 2, read: 3 };
