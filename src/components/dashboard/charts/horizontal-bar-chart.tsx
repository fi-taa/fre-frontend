'use client';

interface HorizontalBarChartData {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarChartProps {
  data: HorizontalBarChartData[];
  showValues?: boolean;
  maxValue?: number;
}

export function HorizontalBarChart({ data, showValues = true, maxValue }: HorizontalBarChartProps) {
  const calculatedMaxValue = maxValue || Math.max(...data.map((d) => d.value), 1);
  const colors = ['#3b82f6', '#ef4444', '#eab308', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = calculatedMaxValue > 0 ? (item.value / calculatedMaxValue) * 100 : 0;
        const color = item.color || colors[index % colors.length];

        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary font-medium">{item.label}</span>
              <span className="text-text-secondary tabular-nums">{item.value}</span>
            </div>
            <div className="relative h-6 rounded-full bg-border/30 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              >
                {showValues && percentage > 20 && (
                  <span className="text-xs font-medium text-white tabular-nums">{item.value}</span>
                )}
              </div>
              {showValues && percentage <= 20 && item.value > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-text-secondary tabular-nums">
                  {item.value}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
