import { requireAdmin } from '@/lib/auth-helpers';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';

export const metadata = {
  title: 'Analytics & Reports | Admin',
};

export default async function AnalyticsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales & Revenue Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track revenue trends, customer acquisition, and payment methods over time.
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}
