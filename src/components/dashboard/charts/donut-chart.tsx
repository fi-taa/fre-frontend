'use client';

interface DonutChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  showLegend?: boolean;
}

export function DonutChart({ data, size = 120, strokeWidth = 12, showLabels = true, showLegend = true }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  const segments = data.map((item) => {
    const percentage = total > 0 ? item.value / total : 0;
    const strokeDasharray = circumference * percentage;
    const strokeDashoffset = circumference - currentOffset;
    const offset = currentOffset;
    currentOffset += strokeDasharray;

    return {
      ...item,
      percentage: percentage * 100,
      strokeDasharray,
      strokeDashoffset: circumference - offset,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          ))}
        </svg>
        {showLabels && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary tabular-nums">{total}</div>
              <div className="text-xs text-text-secondary">Total</div>
            </div>
          </div>
        )}
      </div>
      {showLegend && (
        <div className="space-y-2 w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <span className="text-text-primary">{segment.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary tabular-nums">{segment.value}</span>
                <span className="text-text-secondary text-xs">({Math.round(segment.percentage)}%)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
