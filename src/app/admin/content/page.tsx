import { requireAdmin } from '@/lib/auth-helpers';
import FaqManager from '@/components/admin/FaqManager';
import PagesManager from '@/components/admin/PagesManager';

export default async function AdminContentPage() {
  await requireAdmin();

  return (
    <div className="p-6 max-w-7xl space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">
          Manage FAQs and policy pages. Content is editable and falls back to hardcoded defaults if
          not published.
        </p>
      </div>

      {/* FAQ Manager */}
      <section className="border-t-2 border-cp-crimson pt-8">
        <FaqManager />
      </section>

      {/* Policy Pages Manager */}
      <section className="border-t-2 border-cp-crimson pt-8">
        <PagesManager />
      </section>
    </div>
  );
}
