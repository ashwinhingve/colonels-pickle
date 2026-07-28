'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import NewCustomersChart from './NewCustomersChart';

type DateRange = '7d' | '30d' | '90d' | '12m';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  newCustomers: number;
  revenueSeries: Array<{ date: string; revenue: number }>;
  ordersSeries: Array<{ date: string; orders: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  paymentSplit: Array<{ method: string; count: number; revenue: number }>;
  newCustomersSeries: Array<{ date: string; count: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalQty: number;
    totalRevenue: number;
  }>;
  priorPeriodTotals: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

interface StatCard {
  label: string;
  value: string;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

const RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 12 Months', value: '12m' },
];

function calculateChange(current: number, prior: number): { percent: number; trend: 'up' | 'down' | 'neutral' } {
  if (prior === 0) {
    return { percent: current > 0 ? 100 : 0, trend: current > 0 ? 'up' : 'neutral' };
  }
  const percent = ((current - prior) / prior) * 100;
  return {
    percent: Math.round(Math.abs(percent)),
    trend: current > prior ? 'up' : current < prior ? 'down' : 'neutral',
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatCard({ label, value, changePercent, trend }: StatCard) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend !== 'neutral' && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{changePercent}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="mt-4 h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 h-96 animate-pulse" />
        <div className="bg-white rounded-lg border border-gray-200 h-96 animate-pulse" />
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<DateRange>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/admin/analytics?range=${range}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [range]);

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <p className="text-red-600 font-medium">Error loading analytics</p>
        <p className="text-sm text-gray-600 mt-1">{error}</p>
      </div>
    );
  }

  if (loading || !data) {
    return <LoadingSkeleton />;
  }

  // Calculate changes
  const revenueChange = calculateChange(data.totalRevenue, data.priorPeriodTotals.revenue);
  const ordersChange = calculateChange(data.totalOrders, data.priorPeriodTotals.orders);
  const customersChange = calculateChange(data.newCustomers, data.priorPeriodTotals.customers);

  return (
    <div className="space-y-6">
      {/* Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setRange(option.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              range === option.value
                ? 'bg-cp-crimson text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-cp-crimson hover:text-cp-crimson'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          changePercent={revenueChange.percent}
          trend={revenueChange.trend}
        />
        <StatCard
          label="Total Orders"
          value={data.totalOrders.toString()}
          changePercent={ordersChange.percent}
          trend={ordersChange.trend}
        />
        <StatCard
          label="Avg Order Value"
          value={formatCurrency(data.avgOrderValue)}
          changePercent={0}
          trend="neutral"
        />
        <StatCard
          label="New Customers"
          value={data.newCustomers.toString()}
          changePercent={customersChange.percent}
          trend={customersChange.trend}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <LineChart title="Revenue Trend" data={data.revenueSeries} dataKey="revenue" formatValue={formatCurrency} />

        {/* Orders Trend */}
        <LineChart title="Orders Trend" data={data.ordersSeries} dataKey="orders" formatValue={(v) => v.toString()} />

        {/* Top Products */}
        <BarChart title="Top Products by Revenue" products={data.topProducts} />

        {/* Payment Method Split */}
        <DonutChart title="Payment Method Split" data={data.paymentSplit} />

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status Breakdown</h3>
          <div className="space-y-3">
            {data.statusBreakdown.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status.status === 'delivered'
                        ? 'bg-green-500'
                        : status.status === 'shipped'
                        ? 'bg-blue-500'
                        : status.status === 'processing'
                        ? 'bg-yellow-500'
                        : status.status === 'confirmed'
                        ? 'bg-purple-500'
                        : status.status === 'cancelled'
                        ? 'bg-red-500'
                        : status.status === 'refunded'
                        ? 'bg-orange-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">{status.status}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* New Customers Trend */}
        <NewCustomersChart title="New Customers" data={data.newCustomersSeries} />
      </div>
    </div>
  );
}
