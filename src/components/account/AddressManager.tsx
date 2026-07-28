"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";

interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

type FormState = Omit<Address, "_id" | "isDefault"> & { isDefault: boolean };

const EMPTY_FORM: FormState = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const inputCls =
  "w-full rounded-lg border border-cp-border bg-white px-3.5 py-2.5 font-sans text-sm text-cp-text outline-none transition-colors focus:border-cp-crimson";

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/addresses");
      if (!res.ok) throw new Error("Failed to load addresses");
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load your addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (a: Address) => {
    setEditingId(a._id);
    setForm({
      fullName: a.fullName,
      phoneNumber: a.phoneNumber,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2 || "",
      city: a.city,
      state: a.state,
      postalCode: a.postalCode,
      country: a.country || "India",
      isDefault: !!a.isDefault,
    });
    setFormError(null);
    setShowForm(true);
  };

  const update = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
      setFormError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(form.postalCode)) {
      setFormError("Enter a valid 6-digit PIN code.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        editingId ? `/api/addresses/${editingId}` : "/api/addresses",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save address");
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError("Could not delete the address. Please try again.");
    }
  };

  const makeDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError("Could not update the default address.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-cp-border bg-white py-16">
        <Loader2 className="h-6 w-6 animate-spin text-cp-crimson" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-cp-crimson/30 bg-cp-crimson-light px-4 py-3 font-sans text-sm text-cp-crimson-dark">
          {error}
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed border-cp-border bg-white px-6 py-14 text-center">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-cp-text-light" />
          <p className="font-display text-lg font-bold text-cp-text">No saved addresses yet</p>
          <p className="mt-1 font-serif text-sm text-cp-text-muted">
            Add an address to check out faster next time.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cp-crimson px-5 py-2.5 font-sans text-sm font-bold text-white transition-colors hover:bg-cp-crimson-dark"
          >
            <Plus className="h-4 w-4" /> Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a._id}
              className="rounded-2xl border border-cp-border bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-[15px] font-bold text-cp-text">{a.fullName}</p>
                    {a.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cp-green-light px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-cp-green">
                        <Star className="h-3 w-3 fill-current" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 font-serif text-sm leading-relaxed text-cp-text-muted">
                    {a.addressLine1}
                    {a.addressLine2 ? `, ${a.addressLine2}` : ""}, {a.city}, {a.state} {a.postalCode}
                    {a.country && a.country !== "India" ? `, ${a.country}` : ""}
                  </p>
                  <p className="mt-1 font-sans text-sm text-cp-text-muted">📞 +91 {a.phoneNumber}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(a)}
                    aria-label="Edit address"
                    className="rounded-md p-2 text-cp-text-muted transition-colors hover:bg-cp-cream hover:text-cp-crimson"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(a._id)}
                    aria-label="Delete address"
                    className="rounded-md p-2 text-cp-text-muted transition-colors hover:bg-cp-crimson-light hover:text-cp-crimson"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {!a.isDefault && (
                <button
                  type="button"
                  onClick={() => makeDefault(a._id)}
                  className="mt-3 font-sans text-xs font-semibold text-cp-crimson hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}

          {!showForm && (
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-cp-border px-5 py-3 font-sans text-sm font-bold text-cp-text-muted transition-colors hover:border-cp-crimson hover:text-cp-crimson"
            >
              <Plus className="h-4 w-4" /> Add Another Address
            </button>
          )}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <form
          onSubmit={submit}
          className="mt-4 space-y-4 rounded-2xl border border-cp-border bg-white p-5"
        >
          <p className="font-display text-lg font-bold text-cp-text">
            {editingId ? "Edit Address" : "Add New Address"}
          </p>

          {formError && (
            <div className="rounded-lg border border-cp-crimson/30 bg-cp-crimson-light px-4 py-2.5 font-sans text-sm text-cp-crimson-dark">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              className={inputCls}
              placeholder="Full name *"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="Mobile number *"
              inputMode="numeric"
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
              required
            />
          </div>
          <input
            className={inputCls}
            placeholder="Address line 1 (house, street) *"
            value={form.addressLine1}
            onChange={(e) => update("addressLine1", e.target.value)}
            required
          />
          <input
            className={inputCls}
            placeholder="Address line 2 (area, landmark)"
            value={form.addressLine2}
            onChange={(e) => update("addressLine2", e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              className={inputCls}
              placeholder="City *"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="State *"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="PIN code *"
              inputMode="numeric"
              value={form.postalCode}
              onChange={(e) => update("postalCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />
          </div>

          <label className="flex items-center gap-2 font-sans text-sm text-cp-text">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => update("isDefault", e.target.checked)}
              className="h-4 w-4 accent-cp-crimson"
            />
            Set as default delivery address
          </label>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-cp-crimson px-6 py-2.5 font-sans text-sm font-bold text-white transition-colors hover:bg-cp-crimson-dark disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Save Changes" : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormError(null);
              }}
              className="rounded-lg border border-cp-border px-6 py-2.5 font-sans text-sm font-bold text-cp-text-muted transition-colors hover:bg-cp-cream"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddressManager;
