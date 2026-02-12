'use client';

import { CATEGORY_LABELS } from '@/types';
import type { RecordCategory } from '@/types';
import { BarChart } from '@/components/dashboard/charts/bar-chart';
import { DonutChart } from '@/components/dashboard/charts/donut-chart';

const CATEGORY_COLORS: Record<RecordCategory, string> = {
  child: '#eab308',
  youth: '#10b981',
  adolescent: '#3b82f6',
  adult: '#8b5cf6',
};

interface StatisticsGraphViewProps {
  byCategory: Record<RecordCategory, number>;
  totalStudents: number;
  maxCategory: number;
  totalAdmins: number;
  totalManagers: number;
  activeAdmins: number;
  activeManagers: number;
  inactiveAdmins: number;
  inactiveManagers: number;
  isSuperAdmin: boolean;
}

export function StatisticsGraphView({
  byCategory,
  totalStudents,
  maxCategory,
  totalAdmins,
  totalManagers,
  activeAdmins,
  activeManagers,
  inactiveAdmins,
  inactiveManagers,
  isSuperAdmin,
}: StatisticsGraphViewProps) {
  const categoryKeys = Object.keys(CATEGORY_LABELS) as RecordCategory[];

  const studentsChartData = categoryKeys.map((cat) => ({
    label: CATEGORY_LABELS[cat],
    value: byCategory[cat] ?? 0,
    color: CATEGORY_COLORS[cat],
  }));

  const adminsChartData = [
    { label: 'Admins', value: totalAdmins, color: '#3b82f6' },
    { label: 'Managers', value: totalManagers, color: '#10b981' },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-6">Students by Category</h3>
        <BarChart data={studentsChartData} height={240} />
      </div>
      {isSuperAdmin ? (
        <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-6">Admins & Managers</h3>
          <div className="space-y-6">
            <DonutChart
              data={[
                { label: 'Active Admins', value: activeAdmins, color: '#10b981' },
                { label: 'Inactive Admins', value: inactiveAdmins, color: '#6b7280' },
              ]}
              size={140}
              strokeWidth={14}
            />
            <div className="pt-4 border-t border-border/20">
              <DonutChart
                data={[
                  { label: 'Active Managers', value: activeManagers, color: '#10b981' },
                  { label: 'Inactive Managers', value: inactiveManagers, color: '#6b7280' },
                ]}
                size={140}
                strokeWidth={14}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-6">Users Overview</h3>
          <BarChart data={adminsChartData} height={240} />
        </div>
      )}
    </div>
  );
}
