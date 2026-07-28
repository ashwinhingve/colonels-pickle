'use client';

interface LineChartProps {
  title: string;
  data: Array<{ date: string; [key: string]: string | number }>;
  dataKey: string;
  formatValue: (value: number) => string;
}

export default function LineChart({ title, data, dataKey, formatValue }: LineChartProps) {
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

  const values = data.map((d) => d[dataKey] as number);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || maxValue || 1;

  // SVG dimensions
  const width = 400;
  const height = 250;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points for polyline
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * chartWidth;
    const normalizedValue = (d[dataKey] as number - minValue) / range;
    const y = chartHeight - normalizedValue * chartHeight;
    return { x: x + padding.left, y: y + padding.top };
  });

  // Create path data
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Create area path (for filled area under line)
  const areaPath =
    pathData +
    ` L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${
      padding.top + chartHeight
    } Z`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="flex overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-full" style={{ minHeight: '280px' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => {
            const y = padding.top + fraction * chartHeight;
            const value = maxValue - fraction * range;
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#9ca3af"
                  fontFamily="system-ui"
                >
                  {formatValue(value)}
                </text>
              </g>
            );
          })}

          {/* Area under line */}
          <path d={areaPath} fill="#FEE2E2" opacity="0.5" />

          {/* Line */}
          <polyline points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <circle key={`point-${i}`} cx={p.x} cy={p.y} r="3" fill="#B91C1C" />
          ))}

          {/* X-axis */}
          <line x1={padding.left} y1={padding.top + chartHeight} x2={padding.left + chartWidth} y2={padding.top + chartHeight} stroke="#d1d5db" strokeWidth="1" />

          {/* Y-axis */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartHeight} stroke="#d1d5db" strokeWidth="1" />

          {/* X-axis labels */}
          {data.map((d, i) => {
            // Show every nth label to avoid crowding
            const step = Math.ceil(data.length / 6);
            if (i % step !== 0 && i !== data.length - 1) return null;

            const x = (i / (data.length - 1 || 1)) * chartWidth + padding.left;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#9ca3af"
                fontFamily="system-ui"
              >
                {d.date}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-0.5 bg-cp-crimson" />
          <span>Trend</span>
        </div>
      </div>
    </div>
  );
}
