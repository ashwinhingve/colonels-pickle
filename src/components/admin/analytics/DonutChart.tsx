'use client';

interface PaymentData {
  method: string;
  count: number;
  revenue: number;
}

interface DonutChartProps {
  title: string;
  data: PaymentData[];
}

const colorMap: Record<string, string> = {
  cod: '#B91C1C', // crimson
  card: '#D97706', // saffron
  upi: '#10B981', // green
  netbanking: '#3B82F6', // blue
  wallet: '#8B5CF6', // purple
};

export default function DonutChart({ title, data }: DonutChartProps) {
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

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const safeTotalRevenue = totalRevenue > 0 ? totalRevenue : 1;

  // Calculate percentages and cumulative angles.
  // Derive each slice's start angle from the sum of prior slices (no render-time
  // variable mutation — keeps react-hooks/immutability happy).
  const slices = data.map((item, index) => {
    const percentage = (item.revenue / safeTotalRevenue) * 100;
    const angleSlice = (item.revenue / safeTotalRevenue) * 360;
    const startAngle = data
      .slice(0, index)
      .reduce((sum, prev) => sum + (prev.revenue / safeTotalRevenue) * 360, 0);
    const endAngle = startAngle + angleSlice;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
    };
  });

  // SVG parameters
  const size = 300;
  const radius = 80;
  const innerRadius = 50;
  const center = size / 2;

  // Convert polar to cartesian coordinates
  const polarToCartesian = (angle: number, r: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: center + r * Math.cos(radians - Math.PI / 2),
      y: center + r * Math.sin(radians - Math.PI / 2),
    };
  };

  // Create arc path
  const createArc = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const start = polarToCartesian(endAngle, outerR);
    const end = polarToCartesian(startAngle, outerR);
    const startInner = polarToCartesian(endAngle, innerR);
    const endInner = polarToCartesian(startAngle, innerR);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${outerR} ${outerR} 0 ${largeArc} 0 ${end.x} ${end.y} L ${endInner.x} ${endInner.y} A ${innerR} ${innerR} 0 ${largeArc} 1 ${startInner.x} ${startInner.y} Z`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="flex flex-col items-center justify-center">
        {/* Donut Chart */}
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto" style={{ maxWidth: '280px' }}>
          {slices.map((slice, i) => (
            <path
              key={`slice-${i}`}
              d={createArc(slice.startAngle, slice.endAngle, innerRadius, radius)}
              fill={colorMap[slice.method as keyof typeof colorMap] || '#9CA3AF'}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none mt-2">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2">
        {slices.map((slice, i) => (
          <div key={`legend-${i}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: colorMap[slice.method as keyof typeof colorMap] || '#9CA3AF',
                }}
              />
              <span className="text-gray-700 capitalize font-medium">{slice.method}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">{slice.count}</span>
              <span className="text-gray-500 text-xs min-w-12 text-right">{slice.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
        <p className="text-lg font-bold text-gray-900 mt-1">
          ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}
