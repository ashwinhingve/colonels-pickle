'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Building2 } from 'lucide-react';

interface BusinessProfileData {
  gstin: string;
  fssai: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

const FIELDS: Array<{ key: keyof BusinessProfileData; label: string; placeholder: string; span?: boolean }> = [
  { key: 'gstin', label: 'GSTIN', placeholder: '08BFKPD8446R1ZM' },
  { key: 'fssai', label: 'FSSAI License No.', placeholder: '12226026000060' },
  { key: 'pan', label: 'PAN (optional)', placeholder: 'ABCDE1234F' },
  { key: 'addressLine1', label: 'Registered Address Line 1', placeholder: 'B-6/374, Vaishali Nagar', span: true },
  { key: 'addressLine2', label: 'Address Line 2 (optional)', placeholder: '', span: true },
  { key: 'city', label: 'City', placeholder: 'Jaipur' },
  { key: 'state', label: 'State', placeholder: 'Rajasthan' },
  { key: 'postalCode', label: 'PIN Code', placeholder: '302020' },
];

export default function BusinessProfileManager({ initialData }: { initialData: BusinessProfileData }) {
  const router = useRouter();
  const [values, setValues] = useState<BusinessProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const update = (key: keyof BusinessProfileData, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessProfile: values }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Business profile saved. New invoices will use these details.' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Business Profile</h3>
            <p className="text-sm text-gray-500">
              GSTIN, FSSAI and registered address shown on every GST invoice
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.key} className={field.span ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={values[field.key]}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-200 flex items-center justify-between">
        {message && (
          <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
        <div className="ml-auto">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-red-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-red-800 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
