"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const BUSINESS_TYPES = ["Kirana", "Supermarket", "Online", "Other"];

export function WholesaleForm() {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    city: "",
    businessType: "Kirana",
    monthlyVolume: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const update =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ownerName.trim() || !form.businessName.trim()) {
      setStatus("error");
      setFeedback("Business name and owner name are required.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setStatus("error");
      setFeedback("Please enter a valid 10-digit phone number.");
      return;
    }

    setStatus("submitting");
    setFeedback("");
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.ownerName,
          phone: form.phone,
          productInterest: form.businessType,
          estimatedQuantity: form.monthlyVolume,
          message: `Business: ${form.businessName} | City: ${form.city} | ${form.message}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("success");
      setFeedback(
        "Application received! Our team will contact you within 2 working days."
      );
      setForm({
        businessName: "",
        ownerName: "",
        phone: "",
        city: "",
        businessType: "Kirana",
        monthlyVolume: "",
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setFeedback(err.message || "Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-cp-border bg-white px-4 py-2.5 font-sans text-sm text-cp-text focus:border-cp-crimson focus:outline-none";

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cp-border bg-white p-8 text-center">
        <p className="font-display text-xl font-bold text-cp-green">
          Thank you!
        </p>
        <p className="mt-2 font-serif text-sm text-cp-text-muted">{feedback}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-cp-border bg-white p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-sans text-sm font-semibold text-cp-text">
            Business Name <span className="text-cp-crimson">*</span>
          </label>
          <input
            type="text"
            value={form.businessName}
            onChange={update("businessName")}
            required
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-cp-text">
            Owner Name <span className="text-cp-crimson">*</span>
          </label>
          <input
            type="text"
            value={form.ownerName}
            onChange={update("ownerName")}
            required
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-cp-text">
            Phone <span className="text-cp-crimson">*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={update("phone")}
            required
            placeholder="10-digit mobile number"
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-cp-text">
            City
          </label>
          <input
            type="text"
            value={form.city}
            onChange={update("city")}
            className={`mt-1 ${inputClass}`}
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-cp-text">
            Type of Business
          </label>
          <select
            value={form.businessType}
            onChange={update("businessType")}
            className={`mt-1 ${inputClass}`}
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-cp-text">
            Monthly Volume (estimate)
          </label>
          <input
            type="text"
            value={form.monthlyVolume}
            onChange={update("monthlyVolume")}
            placeholder="e.g. 50 kg / month"
            className={`mt-1 ${inputClass}`}
          />
        </div>
      </div>
      <div>
        <label className="font-sans text-sm font-semibold text-cp-text">
          Message
        </label>
        <textarea
          value={form.message}
          onChange={update("message")}
          rows={4}
          className={`mt-1 ${inputClass} resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="font-sans text-sm text-cp-crimson">{feedback}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-cp-crimson px-6 py-3 font-sans text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-cp-crimson-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}

export default WholesaleForm;
