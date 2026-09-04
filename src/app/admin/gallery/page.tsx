'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Video,
  Save,
  X,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Star,
} from 'lucide-react';

interface MediaItem {
  _id: string;
  type: 'image' | 'video';
  url: string;
  publicId?: string;
  posterUrl?: string;
  width?: number;
  height?: number;
  title: string;
  caption?: string;
  altText?: string;
  category: string;
  order: number;
  isActive: boolean;
  showInHero: boolean;
  heroOrder: number;
}

interface MediaForm {
  type: 'image' | 'video';
  url: string;
  publicId?: string;
  posterUrl?: string;
  width?: number;
  height?: number;
  title: string;
  caption: string;
  altText: string;
  category: string;
  isActive: boolean;
  showInHero: boolean;
}

const emptyForm: MediaForm = {
  type: 'image',
  url: '',
  title: '',
  caption: '',
  altText: '',
  category: 'General',
  isActive: true,
  showInHero: false,
};

type Tab = 'all' | 'hero';

export default function GalleryAdminPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<MediaForm>(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch {
      setError('Failed to load gallery media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const mainList = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);
  const heroList = useMemo(
    () => items.filter((i) => i.showInHero).sort((a, b) => a.heroOrder - b.heroOrder),
    [items]
  );
  const visibleList = tab === 'all' ? mainList : heroList;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'cp/gallery');

      const res = await fetch('/api/admin/products/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.image?.url) {
        setForm((prev) => ({
          ...prev,
          url: data.image.url,
          publicId: data.image.publicId,
          width: data.image.width,
          height: data.image.height,
        }));
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('Video file must be less than 50MB');
      return;
    }

    setUploadingVideo(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'cp/gallery/videos');

      const res = await fetch('/api/admin/products/upload-video', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.video?.url) {
        setForm((prev) => ({
          ...prev,
          url: data.video.url,
          publicId: data.video.publicId,
          posterUrl: data.video.posterUrl,
          width: data.video.width,
          height: data.video.height,
        }));
      } else {
        setError(data.error || 'Video upload failed');
      }
    } catch {
      setError('Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAdd = async () => {
    if (!form.url || !form.title) {
      setError('Media and title are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm(emptyForm);
        setShowAddForm(false);
        await fetchItems();
        showSuccess('Media added successfully');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add media');
      }
    } catch {
      setError('Failed to add media');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setEditingId(null);
        setForm(emptyForm);
        await fetchItems();
        showSuccess('Media updated successfully');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update media');
      }
    } catch {
      setError('Failed to update media');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item? This also removes it from Cloudinary.')) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchItems();
        showSuccess('Media deleted successfully');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete media');
      }
    } catch {
      setError('Failed to delete media');
    }
  };

  const handleToggleActive = async (item: MediaItem) => {
    try {
      await fetch(`/api/admin/gallery/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      await fetchItems();
    } catch {
      setError('Failed to toggle visibility');
    }
  };

  const handleToggleHero = async (item: MediaItem) => {
    try {
      const nextShowInHero = !item.showInHero;
      const heroOrder = nextShowInHero
        ? (heroList[heroList.length - 1]?.heroOrder ?? -1) + 1
        : item.heroOrder;
      await fetch(`/api/admin/gallery/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showInHero: nextShowInHero, heroOrder }),
      });
      await fetchItems();
    } catch {
      setError('Failed to update Hero Pool');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = tab === 'all' ? mainList : heroList;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= list.length) return;

    const reordered = [...list];
    [reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];
    const ids = reordered.map((s) => s._id);

    // Optimistic local update
    const field = tab === 'all' ? 'order' : 'heroOrder';
    setItems((prev) =>
      prev.map((it) => {
        const idx = ids.indexOf(it._id);
        return idx === -1 ? it : { ...it, [field]: idx };
      })
    );

    try {
      await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, field }),
      });
    } catch {
      await fetchItems();
    }
  };

  const startEdit = (item: MediaItem) => {
    setEditingId(item._id);
    setForm({
      type: item.type,
      url: item.url,
      publicId: item.publicId,
      posterUrl: item.posterUrl,
      width: item.width,
      height: item.height,
      title: item.title,
      caption: item.caption || '',
      altText: item.altText || '',
      category: item.category || 'General',
      isActive: item.isActive,
      showInHero: item.showInHero,
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photo &amp; Video Gallery</h1>
          <p className="text-gray-600 mt-1">
            Manage the media shown on the public Gallery page and the homepage Hero.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-red-700 text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Add Media
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === 'all'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Media ({mainList.length})
        </button>
        <button
          onClick={() => setTab('hero')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition flex items-center gap-1.5 ${
            tab === 'hero'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Hero Pool ({heroList.length})
        </button>
      </div>

      {tab === 'hero' && (
        <p className="text-sm text-gray-500 -mt-2">
          These items cycle through the 4 homepage hero panels in this order, staggered ~1s apart.
          Toggle &quot;Show in Hero&quot; on any media item below to add or remove it from this pool.
        </p>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Media' : 'Add New Media'}
          </h3>
          <div className="space-y-4">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="image"
                    checked={form.type === 'image'}
                    onChange={() => setForm((prev) => ({ ...prev, type: 'image' }))}
                    className="text-amber-600"
                  />
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  Image
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="video"
                    checked={form.type === 'video'}
                    onChange={() => setForm((prev) => ({ ...prev, type: 'video' }))}
                    className="text-amber-600"
                  />
                  <Video className="w-4 h-4 text-gray-500" />
                  Video
                </label>
              </div>
            </div>

            {/* Media Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.type === 'image' ? 'Image' : 'Video'}
              </label>
              {form.type === 'image' ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <p className="text-sm text-amber-600">Uploading...</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    disabled={uploadingVideo}
                  />
                  {uploadingVideo && (
                    <p className="text-sm text-purple-600">Uploading video... This may take a moment.</p>
                  )}
                  <p className="text-xs text-gray-500">Max 50MB. MP4, WebM, MOV.</p>
                </div>
              )}
              {form.url && form.type === 'image' && (
                <div className="mt-2">
                  <Image src={form.url} alt="Preview" width={200} height={128} className="h-32 rounded-lg object-cover" />
                </div>
              )}
              {form.url && form.type === 'video' && (
                <div className="mt-2">
                  <video src={form.url} controls className="h-32 rounded-lg" poster={form.posterUrl} />
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Hand-Sorted Green Chillies"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category / Album</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Our Process, Products, Family & Army Story"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))}
                placeholder="Short caption shown in the gallery lightbox..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Alt text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (accessibility)</label>
              <input
                type="text"
                value={form.altText}
                onChange={(e) => setForm((prev) => ({ ...prev, altText: e.target.value }))}
                placeholder="Describe the image for screen readers"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-amber-600"
                />
                <span className="text-sm text-gray-700">Active (visible in Gallery)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.showInHero}
                  onChange={(e) => setForm((prev) => ({ ...prev, showInHero: e.target.checked }))}
                  className="w-4 h-4 accent-amber-600"
                />
                <span className="text-sm text-gray-700">Show in Hero (homepage rotation)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-red-700 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add Media'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  cancelEdit();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            {tab === 'all' ? `All Media (${mainList.length})` : `Hero Pool (${heroList.length})`}
          </h3>
        </div>

        {visibleList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">
              {tab === 'all' ? 'No media yet' : 'No media in the Hero Pool yet'}
            </p>
            <p className="text-sm mt-1">
              {tab === 'all'
                ? 'Add your first photo or video above.'
                : 'Toggle "Show in Hero" on a media item in "All Media" to add it here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {visibleList.map((item, index) => (
              <div
                key={item._id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition ${
                  !item.isActive ? 'opacity-50' : ''
                }`}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === visibleList.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  {item.type === 'image' ? (
                    <Image src={item.url} alt={item.title} fill className="object-cover" />
                  ) : item.posterUrl ? (
                    <>
                      <Image src={item.posterUrl} alt={item.title} fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        item.type === 'image'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {item.category}
                    </span>
                    <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{item.caption}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleHero(item)}
                    className={`p-2 rounded-lg hover:bg-amber-50 transition-colors ${
                      item.showInHero ? 'text-amber-500' : 'text-gray-300'
                    }`}
                    title={item.showInHero ? 'Remove from Hero Pool' : 'Add to Hero Pool'}
                  >
                    <Star className="w-4 h-4" fill={item.showInHero ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title={item.isActive ? 'Hide from Gallery' : 'Show in Gallery'}
                  >
                    {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
