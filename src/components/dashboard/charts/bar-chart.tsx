'use client';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  showValues?: boolean;
  showGrid?: boolean;
}

export function BarChart({ data, height = 200, showValues = true, showGrid = true }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const svgWidth = 400;
  const svgHeight = height;
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;
  const barWidth = chartWidth / Math.max(data.length, 1);
  const barSpacing = barWidth * 0.15;
  const actualBarWidth = barWidth - barSpacing;

  const gridLines = 5;
  const colors = ['#3b82f6', '#ef4444', '#eab308', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="w-full overflow-x-auto">
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
        {showGrid &&
          Array.from({ length: gridLines }).map((_, i) => {
            const y = padding.top + (chartHeight / (gridLines - 1)) * i;
            const value = maxValue - (maxValue / (gridLines - 1)) * i;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.15"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="currentColor"
                  fillOpacity="0.6"
                  className="tabular-nums"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding.left + index * barWidth + barSpacing / 2;
          const y = padding.top + chartHeight - barHeight;
          const color = item.color || colors[index % colors.length];

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={actualBarWidth}
                height={barHeight}
                fill={color}
                rx="4"
                className="transition-all duration-500"
              />
              {showValues && item.value > 0 && (
                <text
                  x={x + actualBarWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  fillOpacity="0.9"
                  fontWeight="600"
                  className="tabular-nums"
                >
                  {item.value}
                </text>
              )}
              <text
                x={x + actualBarWidth / 2}
                y={svgHeight - padding.bottom + 20}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
                fillOpacity="0.7"
                className="capitalize"
              >
                {item.label.length > 10 ? item.label.substring(0, 9) + '...' : item.label}
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={svgWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  );
}
