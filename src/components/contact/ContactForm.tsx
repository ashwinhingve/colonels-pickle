"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus("error");
      setFeedback("Please enter your name.");
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("success");
      setFeedback(data.message || "We'll get back to you within 24 hours");
      setForm({ name: "", phone: "", city: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setFeedback(err.message || "Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-cp-border bg-white px-4 py-2.5 font-sans text-sm text-cp-text focus:border-cp-crimson focus:outline-none";

  return (
    <div className="rounded-2xl border border-cp-border bg-white p-8">
      <h2 className="font-display text-2xl font-bold text-cp-text">
        Send an Inquiry
      </h2>

      {status === "success" ? (
        <div className="mt-6 rounded-lg bg-cp-green-light p-6 text-center">
          <p className="font-display text-lg font-bold text-cp-green">
            Thank you!
          </p>
          <p className="mt-1 font-serif text-sm text-cp-text-muted">
            {feedback}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="font-sans text-sm font-semibold text-cp-text">
              Name <span className="text-cp-crimson">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
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
              Message
            </label>
            <textarea
              value={form.message}
              onChange={update("message")}
              rows={4}
              placeholder="Which products are you interested in?"
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
            {status === "submitting" ? "Sending…" : "Send Inquiry"}
          </button>
        </form>
      )}

      <p className="mt-5 font-serif text-sm text-cp-text-muted">
        Prefer WhatsApp? We respond faster there.{" "}
        <a
          href="https://wa.me/919350406289"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-cp-green hover:underline"
        >
          Chat now →
        </a>
      </p>
      <p className="mt-3 rounded-lg bg-cp-saffron-light px-4 py-2 font-sans text-xs font-medium text-cp-brown-dark">
        Min order: 6 jars of 100g or 2 jars of 250g of any variety
      </p>
    </div>
  );
}

export default ContactForm;
