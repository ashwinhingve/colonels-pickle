'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ThresholdEditorProps {
  currentThreshold: number;
}

export default function ThresholdEditor({ currentThreshold }: ThresholdEditorProps) {
  const router = useRouter();
  const [threshold, setThreshold] = useState(String(currentThreshold));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const parsedThreshold = parseInt(threshold, 10);

      if (isNaN(parsedThreshold) || parsedThreshold < 0) {
        setMessage({ type: 'error', text: 'Please enter a valid non-negative number' });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/inventory/threshold', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: parsedThreshold }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update threshold' });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Low stock threshold updated successfully' });

      // Refresh the page after 1 second to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Threshold Value (units)
          </label>
          <input
            type="number"
            min="0"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
