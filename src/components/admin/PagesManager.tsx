'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2, Eye, EyeOff } from 'lucide-react';
import RichTextEditor from './products/RichTextEditor';

interface PageData {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  bodyHtml: string;
  lastUpdated: string;
  isPublished: boolean;
}

const PAGE_SLUGS = [
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms-and-conditions', label: 'Terms & Conditions' },
  { slug: 'refund-policy', label: 'Refund Policy' },
  { slug: 'shipping-policy', label: 'Shipping Policy' },
] as const;

export default function PagesManager() {
  const [pages, setPages] = useState<Map<string, PageData>>(new Map());
  const [selectedSlug, setSelectedSlug] = useState<string>(PAGE_SLUGS[0].slug);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const pagesMap = new Map<string, PageData>();
      (data.pages || []).forEach((page: PageData) => {
        pagesMap.set(page.slug, page);
      });

      setPages(pagesMap);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pages');
      console.error('Failed to fetch pages:', err);
    } finally {
      setLoading(false);
    }
  }

  const currentPage = pages.get(selectedSlug) || {
    slug: selectedSlug,
    title: '',
    subtitle: '',
    bodyHtml: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    isPublished: false,
    _id: '',
  };

  async function handleSave() {
    if (!currentPage.title.trim()) {
      alert('Title is required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${selectedSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentPage.title,
          subtitle: currentPage.subtitle,
          bodyHtml: currentPage.bodyHtml,
          lastUpdated: currentPage.lastUpdated,
          isPublished: currentPage.isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newPages = new Map(pages);
      newPages.set(selectedSlug, data.page);
      setPages(newPages);
      setError(null);
      alert('Page saved successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to save page');
      alert(err.message || 'Failed to save page');
    } finally {
      setSaving(false);
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Policy Pages Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit and manage policy pages displayed on your website
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Page Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {PAGE_SLUGS.map((page) => (
          <button
            key={page.slug}
            onClick={() => setSelectedSlug(page.slug)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              selectedSlug === page.slug
                ? 'bg-cp-crimson text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Page Editor */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Page Title *
            </label>
            <Input
              value={currentPage.title}
              onChange={(e) => {
                const newPage = { ...currentPage, title: e.target.value };
                setPages(new Map(pages).set(selectedSlug, newPage));
              }}
              placeholder="Enter page title..."
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Page Subtitle
            </label>
            <Input
              value={currentPage.subtitle}
              onChange={(e) => {
                const newPage = { ...currentPage, subtitle: e.target.value };
                setPages(new Map(pages).set(selectedSlug, newPage));
              }}
              placeholder="Enter page subtitle..."
            />
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Page Content (HTML)
            </label>
            <RichTextEditor
              content={currentPage.bodyHtml}
              onChange={(content) => {
                const newPage = { ...currentPage, bodyHtml: content };
                setPages(new Map(pages).set(selectedSlug, newPage));
              }}
              placeholder="Write your page content here..."
            />
          </div>

          {/* Last Updated */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Last Updated
            </label>
            <Input
              type="date"
              value={currentPage.lastUpdated}
              onChange={(e) => {
                const newPage = { ...currentPage, lastUpdated: e.target.value };
                setPages(new Map(pages).set(selectedSlug, newPage));
              }}
            />
          </div>

          {/* Publish Status */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <button
              onClick={() => {
                const newPage = {
                  ...currentPage,
                  isPublished: !currentPage.isPublished,
                };
                setPages(new Map(pages).set(selectedSlug, newPage));
              }}
              className={`p-2 rounded-lg transition-colors ${
                currentPage.isPublished
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={currentPage.isPublished ? 'Unpublish' : 'Publish'}
            >
              {currentPage.isPublished ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                {currentPage.isPublished ? 'Published' : 'Draft'}
              </p>
              <p className="text-sm text-gray-600">
                {currentPage.isPublished
                  ? 'This page is visible to users'
                  : 'This page uses the default hardcoded content'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-cp-crimson hover:bg-cp-crimson-dark text-white"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Page
              </>
            )}
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Toggle the publish status to show your custom content to users, or revert to the
        hardcoded default content by unpublishing.
      </p>
    </div>
  );
}
