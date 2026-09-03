'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface RawMaterial {
  _id: string;
  name: string;
  itemCode: string;
  category: 'Spices' | 'Kernels' | 'Oil' | 'Salt' | 'Packaging' | 'Other';
  unit: 'kg' | 'g' | 'L' | 'ml' | 'pieces';
  currentStock: number;
  lowStockThreshold: number;
  purchaseCost: number;
  supplierId?: {
    _id: string;
    name: string;
  };
  batchNumber?: string;
  expiryDate?: string;
  isActive: boolean;
}

interface Supplier {
  _id: string;
  name: string;
}

const CATEGORIES = ['Spices', 'Kernels', 'Oil', 'Salt', 'Packaging', 'Other'];
const UNITS = ['kg', 'g', 'L', 'ml', 'pieces'];

export default function AdminRawMaterialsPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    itemCode: '',
    category: 'Spices' as const,
    unit: 'kg' as const,
    currentStock: 0,
    lowStockThreshold: 10,
    purchaseCost: 0,
    supplierId: '',
    batchNumber: '',
    expiryDate: '',
  });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    itemCode: '',
    category: 'Spices' as const,
    unit: 'kg' as const,
    currentStock: 0,
    lowStockThreshold: 10,
    purchaseCost: 0,
    supplierId: '',
    batchNumber: '',
    expiryDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/inventory/raw-materials?${params}`);
      const data = await res.json();
      setMaterials(data.items || []);
    } catch (err) {
      console.error('Failed to fetch raw materials:', err);
      alert('Failed to load raw materials');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/inventory/suppliers');
      const data = await res.json();
      setSuppliers(data.items || []);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
    fetchSuppliers();
  }, [fetchMaterials, fetchSuppliers]);

  async function handleAdd() {
    if (!addForm.name.trim() || !addForm.itemCode.trim()) {
      alert('Name and Item Code are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: addForm.name.trim(),
        itemCode: addForm.itemCode.trim().toUpperCase(),
        category: addForm.category,
        unit: addForm.unit,
        currentStock: addForm.currentStock,
        lowStockThreshold: addForm.lowStockThreshold,
        purchaseCost: addForm.purchaseCost,
        supplierId: addForm.supplierId || undefined,
        batchNumber: addForm.batchNumber?.trim() || undefined,
        expiryDate: addForm.expiryDate || undefined,
      };

      const res = await fetch('/api/admin/inventory/raw-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add raw material');

      setMaterials([...materials, data.rawMaterial]);
      setAddForm({
        name: '',
        itemCode: '',
        category: 'Spices',
        unit: 'kg',
        currentStock: 0,
        lowStockThreshold: 10,
        purchaseCost: 0,
        supplierId: '',
        batchNumber: '',
        expiryDate: '',
      });
      setShowAdd(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add raw material');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    setSaving(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        itemCode: editForm.itemCode.trim().toUpperCase(),
        category: editForm.category,
        unit: editForm.unit,
        currentStock: editForm.currentStock,
        lowStockThreshold: editForm.lowStockThreshold,
        purchaseCost: editForm.purchaseCost,
        supplierId: editForm.supplierId || undefined,
        batchNumber: editForm.batchNumber?.trim() || undefined,
        expiryDate: editForm.expiryDate || undefined,
      };

      const res = await fetch(`/api/admin/inventory/raw-materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      setMaterials(
        materials.map((m) => (m._id === id ? data.rawMaterial : m))
      );
      setEditingId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update raw material');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deactivate this raw material? It will be hidden from active lists but can be restored later by an admin.')) return;
    try {
      const res = await fetch(`/api/admin/inventory/raw-materials/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setMaterials(materials.filter((m) => m._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete raw material');
    }
  }

  const isLowStock = (material: RawMaterial) => {
    return material.currentStock <= material.lowStockThreshold;
  };

  const isOutOfStock = (material: RawMaterial) => {
    return material.currentStock === 0;
  };

  if (loading && materials.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Raw Materials</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage inventory of raw materials, track stock levels
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-amber-600 to-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Raw Material
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name or item code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4">New Raw Material</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="e.g., Cumin Seeds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Code *
              </label>
              <Input
                value={addForm.itemCode}
                onChange={(e) =>
                  setAddForm({ ...addForm, itemCode: e.target.value })
                }
                placeholder="e.g., JRA-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={addForm.category}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    category: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={addForm.unit}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    unit: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock
              </label>
              <Input
                type="number"
                value={addForm.currentStock}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    currentStock: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Threshold
              </label>
              <Input
                type="number"
                value={addForm.lowStockThreshold}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    lowStockThreshold: parseFloat(e.target.value) || 10,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Cost
              </label>
              <Input
                type="number"
                step="0.01"
                value={addForm.purchaseCost}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    purchaseCost: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <select
                value={addForm.supplierId}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    supplierId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">None</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number (optional)
              </label>
              <Input
                value={addForm.batchNumber}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    batchNumber: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (optional)
              </label>
              <Input
                type="date"
                value={addForm.expiryDate}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    expiryDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAdd}
              disabled={saving}
              size="sm"
              className="bg-gradient-to-r from-amber-600 to-red-700"
            >
              <Save className="w-4 h-4 mr-1" />
              {saving ? 'Saving...' : 'Save Material'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAdd(false);
                setAddForm({
                  name: '',
                  itemCode: '',
                  category: 'Spices',
                  unit: 'kg',
                  currentStock: 0,
                  lowStockThreshold: 10,
                  purchaseCost: 0,
                  supplierId: '',
                  batchNumber: '',
                  expiryDate: '',
                });
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Materials Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Item Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Threshold
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Supplier
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {materials.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No raw materials found.
                </td>
              </tr>
            ) : (
              materials.map((mat) => (
                <tr
                  key={mat._id}
                  className={`hover:bg-gray-50 ${
                    isOutOfStock(mat)
                      ? 'border-l-4 border-l-red-600'
                      : isLowStock(mat)
                        ? 'border-l-4 border-l-amber-500'
                        : 'border-l-4 border-l-transparent'
                  }`}
                >
                  {editingId === mat._id ? (
                    <>
                      <td className="px-4 py-3">
                        <Input
                          value={editForm.itemCode}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              itemCode: e.target.value,
                            })
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value as any,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editForm.currentStock}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                currentStock: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500 py-2">
                            {editForm.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={editForm.lowStockThreshold}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              lowStockThreshold: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.supplierId}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              supplierId: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">None</option>
                          {suppliers.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            mat.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {mat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(mat._id)}
                            disabled={saving}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-mono text-sm text-gray-700">
                        {mat.itemCode}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {mat.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {mat.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {mat.currentStock} {mat.unit}
                        {isOutOfStock(mat) && (
                          <div className="inline-block ml-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                              <AlertTriangle className="w-3 h-3" />
                              Out of Stock
                            </span>
                          </div>
                        )}
                        {!isOutOfStock(mat) && isLowStock(mat) && (
                          <div className="inline-block ml-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                              <AlertTriangle className="w-3 h-3" />
                              Low Stock
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {mat.lowStockThreshold} {mat.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {mat.supplierId?.name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            mat.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {mat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(mat._id);
                              setEditForm({
                                name: mat.name,
                                itemCode: mat.itemCode,
                                category: mat.category as typeof editForm.category,
                                unit: mat.unit as typeof editForm.unit,
                                currentStock: mat.currentStock,
                                lowStockThreshold: mat.lowStockThreshold,
                                purchaseCost: mat.purchaseCost,
                                supplierId: mat.supplierId?._id || '',
                                batchNumber: mat.batchNumber || '',
                                expiryDate: mat.expiryDate || '',
                              });
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(mat._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        💡 Tip: Items with a red left border are out of stock. Items with amber border are running low. Edit to update stock levels or assign suppliers. Deleting a raw material will only deactivate it — it stays in the system for history.
      </p>
    </div>
  );
}
