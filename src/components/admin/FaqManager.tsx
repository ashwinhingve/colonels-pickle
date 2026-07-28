'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

const EMPTY_FORM = {
  question: '',
  answer: '',
  category: '',
  isActive: true,
};

function FaqForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
  title,
  categories,
}: {
  form: typeof EMPTY_FORM;
  onChange: (f: typeof EMPTY_FORM) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  title: string;
  categories: string[];
}) {
  return (
    <div className="border-2 border-cp-crimson rounded-xl p-5 bg-cp-crimson/5">
      <h3 className="font-semibold text-gray-800 mb-5">{title}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Category *
            </label>
            <Input
              value={form.category}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
              placeholder="e.g., Products & Ingredients"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Question *
          </label>
          <Input
            value={form.question}
            onChange={(e) => onChange({ ...form, question: e.target.value })}
            placeholder="Enter the FAQ question..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Answer *
          </label>
          <textarea
            value={form.answer}
            onChange={(e) => onChange({ ...form, answer: e.target.value })}
            placeholder="Enter the FAQ answer..."
            rows={4}
            className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cp-crimson resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-5">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="bg-cp-crimson hover:bg-cp-crimson-dark text-white"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" /> Save FAQ
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function FaqManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    try {
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFaqs(data.faqs || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch FAQs');
      console.error('Failed to fetch FAQs:', err);
    } finally {
      setLoading(false);
    }
  }

  const categories = Array.from(new Set(faqs.map((f) => f.category))).sort();

  async function handleAdd() {
    if (!addForm.question.trim() || !addForm.answer.trim() || !addForm.category.trim()) {
      alert('Question, answer, and category are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFaqs([...faqs, data.faq]);
      setAddForm({ ...EMPTY_FORM });
      setShowAdd(false);
      setError(null);
    } catch (err: any) {
      alert(err.message || 'Failed to add FAQ');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      alert('Question and answer are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFaqs(faqs.map((f) => (f._id === id ? data.faq : f)));
      setEditingId(null);
      setError(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update FAQ');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setFaqs(faqs.filter((f) => f._id !== id));
      setError(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete FAQ');
    }
  }

  async function toggleActive(faq: FAQ) {
    try {
      const res = await fetch(`/api/admin/faqs/${faq._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFaqs(faqs.map((f) => (f._id === faq._id ? data.faq : f)));
      setError(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 mx-auto border-[3px] border-cp-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage frequently asked questions displayed on the FAQ page
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-cp-crimson hover:bg-cp-crimson-dark text-white"
          disabled={showAdd}
        >
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <FaqForm
          form={addForm}
          onChange={setAddForm}
          onSave={handleAdd}
          onCancel={() => {
            setShowAdd(false);
            setAddForm({ ...EMPTY_FORM });
          }}
          saving={saving}
          title="New FAQ"
          categories={categories}
        />
      )}

      {/* FAQs List */}
      {faqs.length === 0 && !showAdd ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 font-medium">No FAQs yet</p>
          <p className="text-sm text-gray-400 mt-1">Click &quot;Add FAQ&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id}>
              {editingId === faq._id ? (
                <FaqForm
                  form={editForm}
                  onChange={setEditForm}
                  onSave={() => handleUpdate(faq._id)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                  title={`Editing FAQ`}
                  categories={categories}
                />
              ) : (
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    faq.isActive
                      ? 'border-gray-200 bg-white hover:border-cp-crimson/50'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-cp-crimson uppercase tracking-widest">
                        {faq.category}
                      </span>
                      <span className="text-xs text-gray-400">#{faq.order + 1}</span>
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">{faq.question}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => toggleActive(faq)}
                      className={`p-2 rounded-lg transition-colors ${
                        faq.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={faq.isActive ? 'Hide on FAQ page' : 'Show on FAQ page'}
                    >
                      {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(faq._id);
                        setEditForm({
                          question: faq.question,
                          answer: faq.answer,
                          category: faq.category,
                          isActive: faq.isActive,
                        });
                      }}
                      className="p-2 rounded-lg hover:bg-cp-crimson/10 text-cp-crimson transition-colors"
                      title="Edit FAQ"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        FAQs marked as hidden will not appear on the FAQ page.
      </p>
    </div>
  );
}
