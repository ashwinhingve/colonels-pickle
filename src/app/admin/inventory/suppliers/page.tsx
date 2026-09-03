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
} from 'lucide-react';

interface Supplier {
  _id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  notes?: string;
  isActive: boolean;
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    notes: '',
  });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/inventory/suppliers?${params}`);
      const data = await res.json();
      setSuppliers(data.items || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      alert('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, currentPage]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  async function handleAdd() {
    if (!addForm.name.trim()) {
      alert('Name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: addForm.name.trim(),
        contactPerson: addForm.contactPerson?.trim() || undefined,
        email: addForm.email?.trim() || undefined,
        phone: addForm.phone?.trim() || undefined,
        address: addForm.address?.trim() || undefined,
        gstin: addForm.gstin?.trim() || undefined,
        notes: addForm.notes?.trim() || undefined,
      };

      const res = await fetch('/api/admin/inventory/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add supplier');

      setSuppliers([...suppliers, data.supplier]);
      setAddForm({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        gstin: '',
        notes: '',
      });
      setShowAdd(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add supplier');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    setSaving(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        contactPerson: editForm.contactPerson?.trim() || undefined,
        email: editForm.email?.trim() || undefined,
        phone: editForm.phone?.trim() || undefined,
        address: editForm.address?.trim() || undefined,
        gstin: editForm.gstin?.trim() || undefined,
        notes: editForm.notes?.trim() || undefined,
      };

      const res = await fetch(`/api/admin/inventory/suppliers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');

      setSuppliers(
        suppliers.map((s) => (s._id === id ? data.supplier : s))
      );
      setEditingId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update supplier');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deactivate this supplier? It will be hidden from active lists but can be restored later by an admin.')) return;
    try {
      const res = await fetch(`/api/admin/inventory/suppliers/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setSuppliers(suppliers.filter((s) => s._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete supplier');
    }
  }

  if (loading && suppliers.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage supplier information and contact details
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-amber-600 to-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name, contact, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
          <h3 className="font-semibold text-gray-800 mb-4">New Supplier</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="e.g., XYZ Spices Ltd"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <Input
                value={addForm.contactPerson}
                onChange={(e) =>
                  setAddForm({ ...addForm, contactPerson: e.target.value })
                }
                placeholder="e.g., Rajesh Kumar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="supplier@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                placeholder="e.g., +91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GSTIN
              </label>
              <Input
                value={addForm.gstin}
                onChange={(e) => setAddForm({ ...addForm, gstin: e.target.value })}
                placeholder="e.g., 22AABCU1234H1Z0"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={addForm.address}
                onChange={(e) =>
                  setAddForm({ ...addForm, address: e.target.value })
                }
                placeholder="Full business address"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={addForm.notes}
                onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                placeholder="Any additional notes or special instructions"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-sans"
                rows={3}
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
              {saving ? 'Saving...' : 'Save Supplier'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAdd(false);
                setAddForm({
                  name: '',
                  contactPerson: '',
                  email: '',
                  phone: '',
                  address: '',
                  gstin: '',
                  notes: '',
                });
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Contact Person
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                GSTIN
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
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((sup) => (
                <tr key={sup._id} className="hover:bg-gray-50">
                  {editingId === sup._id ? (
                    <>
                      <td className="px-4 py-3">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={editForm.contactPerson}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              contactPerson: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={editForm.gstin}
                          onChange={(e) =>
                            setEditForm({ ...editForm, gstin: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            sup.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {sup.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(sup._id)}
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
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {sup.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sup.contactPerson || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sup.phone || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sup.email || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        {sup.gstin || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            sup.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {sup.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label={`Edit ${sup.name}`}
                            onClick={() => {
                              setEditingId(sup._id);
                              setEditForm({
                                name: sup.name,
                                contactPerson: sup.contactPerson || '',
                                email: sup.email || '',
                                phone: sup.phone || '',
                                address: sup.address || '',
                                gstin: sup.gstin || '',
                                notes: sup.notes || '',
                              });
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            aria-label={`Delete ${sup.name}`}
                            onClick={() => handleDelete(sup._id)}
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

        {/* Pagination Controls */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{pagination.page}</span> of{' '}
            <span className="font-semibold">{pagination.pages}</span>
            {pagination.total > 0 && (
              <>
                {' '}
                (
                <span className="font-semibold">{pagination.total}</span> total)
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
        💡 Tip: Click the edit button to update supplier details. Deleting a supplier will only deactivate it.
      </p>
    </div>
  );
}
