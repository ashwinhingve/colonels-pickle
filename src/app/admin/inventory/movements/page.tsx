'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  X,
  Loader2,
  TrendingDown,
  TrendingUp,
  Settings2,
} from 'lucide-react';

interface StockMovement {
  _id: string;
  itemType: 'raw_material' | 'product';
  itemId: {
    _id: string;
    name: string;
    itemCode?: string;
    sku?: string;
    currentStock?: number;
    stock?: number;
  };
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  unitCost?: number;
  reason: 'purchase' | 'sale' | 'production' | 'manual_adjustment' | 'return';
  batchNumber?: string;
  balanceAfter: number;
  performedBy: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
}

interface RawMaterial {
  _id: string;
  name: string;
  itemCode: string;
  currentStock: number;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  stock: number;
}

const MOVEMENT_TYPES = ['in', 'out', 'adjustment'];
const REASONS = ['purchase', 'sale', 'production', 'manual_adjustment', 'return'];

export default function AdminMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });

  // Filters
  const [itemTypeFilter, setItemTypeFilter] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Add/Edit form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<{
    itemType: 'raw_material' | 'product';
    itemId: string;
    movementType: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: 'purchase' | 'sale' | 'production' | 'manual_adjustment' | 'return';
    unitCost: string;
    batchNumber: string;
    notes: string;
  }>({
    itemType: 'product',
    itemId: '',
    movementType: 'in',
    quantity: 0,
    reason: 'purchase',
    unitCost: '',
    batchNumber: '',
    notes: '',
  });
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch movements
  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (itemTypeFilter) params.append('itemType', itemTypeFilter);
      if (movementTypeFilter) params.append('movementType', movementTypeFilter);
      if (reasonFilter) params.append('reason', reasonFilter);
      if (dateFromFilter) params.append('dateFrom', dateFromFilter);
      if (dateToFilter) params.append('dateTo', dateToFilter);

      const res = await fetch(`/api/admin/inventory/movements?${params}`);
      const data = await res.json();
      setMovements(data.items || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch movements:', err);
      alert('Failed to load movements');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemTypeFilter,
    movementTypeFilter,
    reasonFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  // Fetch items for dropdown based on itemType
  const fetchItems = useCallback(async (itemType: string) => {
    try {
      setLoadingItems(true);
      if (itemType === 'raw_material') {
        const res = await fetch('/api/admin/inventory/raw-materials?limit=1000');
        const data = await res.json();
        setRawMaterials(data.items || []);
      } else if (itemType === 'product') {
        const res = await fetch('/api/admin/products?limit=1000');
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoadingItems(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemTypeFilter, movementTypeFilter, reasonFilter, dateFromFilter, dateToFilter]);

  // Fetch items when form opens or itemType changes
  useEffect(() => {
    if (showAddForm) {
      fetchItems(formData.itemType);
    }
  }, [showAddForm, formData.itemType, fetchItems]);

  // Handle form submission
  async function handleAddMovement() {
    if (!formData.itemId) {
      setError('Please select an item');
      return;
    }

    if (formData.quantity < 0) {
      setError('Quantity must be non-negative');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        itemType: formData.itemType,
        itemId: formData.itemId,
        movementType: formData.movementType,
        quantity: formData.quantity,
        reason: formData.reason,
        unitCost: formData.unitCost ? parseFloat(formData.unitCost) : undefined,
        batchNumber: formData.batchNumber?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
      };

      const res = await fetch('/api/admin/inventory/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.details || 'Failed to create movement');
        return;
      }

      // Refresh movements list
      await fetchMovements();

      // Close form and reset
      setShowAddForm(false);
      setFormData({
        itemType: 'product',
        itemId: '',
        movementType: 'in',
        quantity: 0,
        reason: 'purchase',
        unitCost: '',
        batchNumber: '',
        notes: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create movement');
    } finally {
      setSaving(false);
    }
  }

  const getMovementBadgeColor = (movementType: string) => {
    switch (movementType) {
      case 'in':
        return 'bg-green-100 text-green-700';
      case 'out':
        return 'bg-red-100 text-red-700';
      case 'adjustment':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMovementIcon = (movementType: string) => {
    switch (movementType) {
      case 'in':
        return <TrendingUp className="w-3 h-3" />;
      case 'out':
        return <TrendingDown className="w-3 h-3" />;
      case 'adjustment':
        return <Settings2 className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && movements.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 mx-auto border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Audit ledger of all stock movements (append-only)
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-amber-600 to-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Movement
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap gap-3">
        <select
          value={itemTypeFilter}
          onChange={(e) => setItemTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Item Types</option>
          <option value="raw_material">Raw Material</option>
          <option value="product">Product</option>
        </select>

        <select
          value={movementTypeFilter}
          onChange={(e) => setMovementTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Movement Types</option>
          {MOVEMENT_TYPES.map((mt) => (
            <option key={mt} value={mt}>
              {mt.charAt(0).toUpperCase() + mt.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Reasons</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r.replace(/_/g, ' ').charAt(0).toUpperCase() +
                r.replace(/_/g, ' ').slice(1)}
            </option>
          ))}
        </select>

        <Input
          type="date"
          value={dateFromFilter}
          onChange={(e) => setDateFromFilter(e.target.value)}
          className="px-3 py-2 max-w-[150px]"
          placeholder="From date"
        />

        <Input
          type="date"
          value={dateToFilter}
          onChange={(e) => setDateToFilter(e.target.value)}
          className="px-3 py-2 max-w-[150px]"
          placeholder="To date"
        />
      </div>

      {/* Add Movement Form */}
      {showAddForm && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Add Manual Movement</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Type *
              </label>
              <select
                value={formData.itemType}
                onChange={(e) => {
                  const newItemType = e.target.value as 'raw_material' | 'product';
                  setFormData({
                    ...formData,
                    itemType: newItemType,
                    itemId: '', // Reset when type changes
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="product">Product</option>
                <option value="raw_material">Raw Material</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item *
              </label>
              <select
                value={formData.itemId}
                onChange={(e) =>
                  setFormData({ ...formData, itemId: e.target.value })
                }
                disabled={loadingItems}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
              >
                <option value="">
                  {loadingItems ? 'Loading...' : 'Select item'}
                </option>
                {formData.itemType === 'raw_material' ? (
                  rawMaterials.map((rm) => (
                    <option key={rm._id} value={rm._id}>
                      {rm.name} ({rm.itemCode})
                    </option>
                  ))
                ) : (
                  products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.sku})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movement Type *
              </label>
              <select
                value={formData.movementType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    movementType: e.target.value as 'in' | 'out' | 'adjustment',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {MOVEMENT_TYPES.map((mt) => (
                  <option key={mt} value={mt}>
                    {mt.charAt(0).toUpperCase() + mt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.movementType === 'adjustment' ? 'New Stock Level *' : 'Quantity *'}
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {formData.movementType === 'adjustment' && (
                <p className="text-xs text-gray-500 mt-1">
                  Set the exact stock level, not a delta
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason *
              </label>
              <select
                value={formData.reason}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reason: e.target.value as
                      | 'purchase'
                      | 'sale'
                      | 'production'
                      | 'manual_adjustment'
                      | 'return',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, ' ').charAt(0).toUpperCase() +
                      r.replace(/_/g, ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Cost (optional)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) =>
                  setFormData({ ...formData, unitCost: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number (optional)
              </label>
              <Input
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <Input
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddMovement}
              disabled={saving || !formData.itemId || formData.quantity < 0}
              size="sm"
              className="bg-gradient-to-r from-amber-600 to-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Movement'
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Movements Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Balance After
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Performed By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No movements found.
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(movement.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">
                        {movement.itemId?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {movement.itemId?.itemCode || movement.itemId?.sku || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getMovementBadgeColor(
                          movement.movementType
                        )}`}
                      >
                        {getMovementIcon(movement.movementType)}
                        {movement.movementType.charAt(0).toUpperCase() +
                          movement.movementType.slice(1)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {movement.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {movement.balanceAfter}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {movement.reason.replace(/_/g, ' ').charAt(0).toUpperCase() +
                        movement.reason.replace(/_/g, ' ').slice(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="font-medium">{movement.performedBy?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">
                        {movement.performedBy?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {movement.notes ? (
                        <span title={movement.notes} className="truncate max-w-xs">
                          {movement.notes}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{pagination.page}</span> of{' '}
            <span className="font-semibold">{pagination.pages}</span>
            {pagination.total > 0 && (
              <>
                {' '}
                (<span className="font-semibold">{pagination.total}</span> total)
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasPrev || loading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasNext || loading}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        💡 Tip: This ledger is append-only — movements cannot be edited or deleted. Corrections are recorded as new adjustment movements with full traceability.
      </p>
    </div>
  );
}
