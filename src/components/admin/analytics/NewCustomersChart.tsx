'use client';

interface CustomerData {
  date: string;
  count: number;
}

interface NewCustomersChartProps {
  title: string;
  data: CustomerData[];
}

export default function NewCustomersChart({ title, data }: NewCustomersChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const counts = data.map((d) => d.count);
  const maxCount = Math.max(...counts, 1);
  const totalCustomers = counts.reduce((sum, c) => sum + c, 0);
  const avgCustomers = Math.round(totalCustomers / data.length);

  // SVG dimensions
  const width = 400;
  const height = 250;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate bar positions
  const barWidth = Math.max(chartWidth / data.length - 4, 2);
  const barSpacing = chartWidth / data.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="flex overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-full" style={{ minHeight: '280px' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => {
            const y = padding.top + fraction * chartHeight;
            const value = Math.round(maxCount - fraction * maxCount);
            return (
              <g key={`grid-${i}`}>
                <line x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af" fontFamily="system-ui">
                  {value}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, i) => {
            const barHeight = (item.count / maxCount) * chartHeight;
            const x = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
            const y = padding.top + chartHeight - barHeight;

            return (
              <g key={`bar-${i}`} className="group">
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#10B981"
                  className="hover:brightness-110 transition-all cursor-pointer"
                  rx="2"
                />

                {/* Tooltip on hover */}
                <title>{`${item.date}: ${item.count} customers`}</title>
              </g>
            );
          })}

          {/* X-axis */}
          <line x1={padding.left} y1={padding.top + chartHeight} x2={padding.left + chartWidth} y2={padding.top + chartHeight} stroke="#d1d5db" strokeWidth="1" />

          {/* Y-axis */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartHeight} stroke="#d1d5db" strokeWidth="1" />

          {/* X-axis labels */}
          {data.map((item, i) => {
            const step = Math.ceil(data.length / 6);
            if (i % step !== 0 && i !== data.length - 1) return null;

            const x = padding.left + i * barSpacing + barSpacing / 2;
            return (
              <text key={`label-${i}`} x={x} y={padding.top + chartHeight + 20} textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="system-ui">
                {item.date}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 font-medium">Total Customers</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{totalCustomers}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Daily Average</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{avgCustomers}</p>
        </div>
      </div>
    </div>
  );
}
