'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, Trash2, Loader2, CheckCircle2, FileDown, Printer } from 'lucide-react';
import { calculateOrderGST } from '@/lib/gst';

interface UserResult {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string | null;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
}

interface ProductResult {
  _id: string;
  name: string;
  sku: string;
  price: number;
  gstRate: number;
  stock: number;
  variants?: ProductVariant[];
}

interface LineItem {
  key: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  gstRate: number;
  quantity: number;
  maxStock: number;
}

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'wallet', label: 'Wallet' },
];

async function debounceSearch<T>(
  fn: () => Promise<T>,
  delayMs: number,
  timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
): Promise<void> {
  if (timerRef.current) clearTimeout(timerRef.current);
  return new Promise((resolve) => {
    timerRef.current = setTimeout(async () => {
      await fn();
      resolve();
    }, delayMs);
  });
}

export default function CreateInvoiceForm() {
  // Customer
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<UserResult[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<UserResult | null>(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phoneNumber: '' });
  const customerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Address
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Rajasthan',
    postalCode: '',
    country: 'India',
  });

  // Products
  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState<ProductResult[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const productTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ orderId: string; orderNumber: string; invoiceNumber: string; totalAmount: number } | null>(null);

  // ── Customer search ──────────────────────────────────────────────
  useEffect(() => {
    if (!customerSearch.trim() || customerMode !== 'existing') {
      setCustomerResults([]);
      return;
    }
    debounceSearch(
      async () => {
        try {
          const res = await fetch(`/api/admin/users?search=${encodeURIComponent(customerSearch)}&limit=8`);
          const data = await res.json();
          setCustomerResults(data.users || []);
        } catch {
          setCustomerResults([]);
        }
      },
      350,
      customerTimer
    );
  }, [customerSearch, customerMode]);

  const selectCustomer = (u: UserResult) => {
    setSelectedCustomer(u);
    setCustomerResults([]);
    setCustomerSearch(u.name);
    setAddress((a) => ({ ...a, fullName: u.name, phoneNumber: u.phoneNumber || a.phoneNumber }));
  };

  // ── Product search ───────────────────────────────────────────────
  useEffect(() => {
    if (!productSearch.trim()) {
      setProductResults([]);
      return;
    }
    setSearchingProducts(true);
    debounceSearch(
      async () => {
        try {
          const res = await fetch(`/api/admin/products?search=${encodeURIComponent(productSearch)}&limit=8`);
          const data = await res.json();
          setProductResults(data.products || []);
        } catch {
          setProductResults([]);
        } finally {
          setSearchingProducts(false);
        }
      },
      350,
      productTimer
    );
  }, [productSearch]);

  const addLineItem = (product: ProductResult, variant?: ProductVariant) => {
    const key = `${product._id}-${variant?.id || 'base'}`;
    setLineItems((items) => {
      const existing = items.find((i) => i.key === key);
      if (existing) {
        return items.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.quantity + 1, i.maxStock) } : i));
      }
      return [
        ...items,
        {
          key,
          productId: product._id,
          variantId: variant?.id,
          name: variant ? `${product.name} - ${variant.name}` : product.name,
          sku: variant?.sku || product.sku,
          price: variant?.price ?? product.price,
          gstRate: product.gstRate ?? 5,
          quantity: 1,
          maxStock: variant?.stock ?? product.stock,
        },
      ];
    });
    setProductSearch('');
    setProductResults([]);
  };

  const updateQuantity = (key: string, quantity: number) => {
    setLineItems((items) =>
      items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) } : i))
    );
  };

  const removeLineItem = (key: string) => {
    setLineItems((items) => items.filter((i) => i.key !== key));
  };

  // ── Live totals (mirrors server-side calculateOrderGST exactly) ──
  const subtotal = useMemo(
    () => lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [lineItems]
  );

  const gstBreakdown = useMemo(() => {
    if (lineItems.length === 0) return null;
    return calculateOrderGST(
      lineItems.map((i) => ({ inclusivePrice: i.price, quantity: i.quantity, gstRate: i.gstRate })),
      address.state || ''
    );
  }, [lineItems, address.state]);

  const totalAmount = Math.max(0, subtotal + (Number(shippingCost) || 0) - (Number(discountAmount) || 0));

  const canSubmit =
    lineItems.length > 0 &&
    address.fullName &&
    address.phoneNumber &&
    address.addressLine1 &&
    address.city &&
    address.state &&
    address.postalCode &&
    (customerMode === 'existing' ? !!selectedCustomer : !!newCustomer.name && (!!newCustomer.email || !!newCustomer.phoneNumber));

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/invoices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer:
            customerMode === 'existing'
              ? { userId: selectedCustomer?.id }
              : { name: newCustomer.name, email: newCustomer.email, phoneNumber: newCustomer.phoneNumber },
          shippingAddress: address,
          items: lineItems.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          discountAmount: Number(discountAmount) || 0,
          shippingCost: Number(shippingCost) || 0,
          paymentMethod,
          paymentStatus,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create invoice');
        return;
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Invoice created</h2>
        <p className="text-sm text-gray-500 mt-1">
          Order {result.orderNumber} · Invoice {result.invoiceNumber} · ₹
          {result.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href={`/api/orders/${result.orderId}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Printer className="w-4 h-4" />
            Print
          </a>
          <a
            href={`/api/orders/${result.orderId}/invoice/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-red-700 text-white rounded-lg text-sm font-medium hover:from-amber-700 hover:to-red-800"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setLineItems([]);
            setSelectedCustomer(null);
            setCustomerSearch('');
            setDiscountAmount(0);
            setShippingCost(0);
            setNotes('');
          }}
          className="mt-6 text-sm text-cp-crimson hover:underline"
        >
          Create another invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Customer</h3>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => setCustomerMode('existing')}
              className={`px-3 py-1.5 ${customerMode === 'existing' ? 'bg-cp-crimson text-white' : 'bg-white text-gray-600'}`}
            >
              Existing
            </button>
            <button
              type="button"
              onClick={() => setCustomerMode('new')}
              className={`px-3 py-1.5 ${customerMode === 'new' ? 'bg-cp-crimson text-white' : 'bg-white text-gray-600'}`}
            >
              New
            </button>
          </div>
        </div>

        {customerMode === 'existing' ? (
          <div className="relative">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setSelectedCustomer(null);
                }}
                placeholder="Search by name, email or phone..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {customerResults.length > 0 && !selectedCustomer && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
                {customerResults.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => selectCustomer(u)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    <div className="font-medium text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email || u.phoneNumber}</div>
                  </button>
                ))}
              </div>
            )}
            {selectedCustomer && (
              <p className="mt-2 text-xs text-green-600">
                Selected: {selectedCustomer.name} ({selectedCustomer.email || selectedCustomer.phoneNumber})
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => {
                setNewCustomer((c) => ({ ...c, name: e.target.value }));
                setAddress((a) => ({ ...a, fullName: e.target.value }));
              }}
              placeholder="Full name"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer((c) => ({ ...c, email: e.target.value }))}
              placeholder="Email (optional)"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              value={newCustomer.phoneNumber}
              onChange={(e) => {
                setNewCustomer((c) => ({ ...c, phoneNumber: e.target.value }));
                setAddress((a) => ({ ...a, phoneNumber: e.target.value }));
              }}
              placeholder="Phone number"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing / Shipping Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={address.fullName}
            onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
            placeholder="Full name"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={address.phoneNumber}
            onChange={(e) => setAddress((a) => ({ ...a, phoneNumber: e.target.value }))}
            placeholder="Phone number"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={address.addressLine1}
            onChange={(e) => setAddress((a) => ({ ...a, addressLine1: e.target.value }))}
            placeholder="Address line 1"
            className="sm:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={address.addressLine2}
            onChange={(e) => setAddress((a) => ({ ...a, addressLine2: e.target.value }))}
            placeholder="Address line 2 (optional)"
            className="sm:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
            placeholder="City"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={address.state}
            onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
            placeholder="State"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
            placeholder="Postal code"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          GST is calculated as intra-state (CGST+SGST) when the state above matches Rajasthan, otherwise IGST.
        </p>
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchingProducts && (
            <Loader2 className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
          )}
          {productResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
              {productResults.map((p) => (
                <div key={p._id} className="border-b border-gray-100 last:border-0">
                  {!p.variants || p.variants.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => addLineItem(p)}
                      disabled={p.stock < 1}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between"
                    >
                      <span>
                        <span className="font-medium text-gray-900">{p.name}</span>{' '}
                        <span className="text-xs text-gray-400">({p.sku})</span>
                      </span>
                      <span className="text-xs text-gray-500">₹{p.price} · stock {p.stock}</span>
                    </button>
                  ) : (
                    p.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => addLineItem(p, v)}
                        disabled={v.stock < 1}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between"
                      >
                        <span>
                          <span className="font-medium text-gray-900">{p.name} - {v.name}</span>{' '}
                          <span className="text-xs text-gray-400">({v.sku})</span>
                        </span>
                        <span className="text-xs text-gray-500">₹{v.price} · stock {v.stock}</span>
                      </button>
                    ))
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {lineItems.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Subtotal</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.key} className="border-t border-gray-100">
                    <td className="py-2 pr-2">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.sku} · GST {item.gstRate}%</div>
                    </td>
                    <td className="py-2 pr-2">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={1}
                        max={item.maxStock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.key, parseInt(e.target.value, 10) || 1)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="py-2 pr-2 font-medium">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.key)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Discount / Shipping / Payment */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Discount (₹)</label>
          <input
            type="number"
            min={0}
            value={discountAmount}
            onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Shipping (₹)</label>
          <input
            type="number"
            min={0}
            value={shippingCost}
            onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'pending')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="paid">Paid (collected now)</option>
            <option value="pending">Pending (bill now, collect later)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Taxable value</span>
            <span>₹{(gstBreakdown?.taxableValue ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          {gstBreakdown?.isIntraState ? (
            <>
              <div className="flex justify-between text-gray-600">
                <span>CGST</span>
                <span>₹{(gstBreakdown?.cgst ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>SGST</span>
                <span>₹{(gstBreakdown?.sgst ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-gray-600">
              <span>IGST</span>
              <span>₹{(gstBreakdown?.igst ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>₹{(Number(shippingCost) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span>-₹{(Number(discountAmount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
            <span>Grand Total</span>
            <span>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-red-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-red-800 disabled:opacity-50 transition-all"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {submitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
}
