'use client';

import { CATEGORY_LABELS } from '@/types';
import type { RecordCategory } from '@/types';
import { useI18n } from '@/i18n/I18nProvider';

interface StatisticsTableViewProps {
  byCategory: Record<RecordCategory, number>;
  totalStudents: number;
  totalDepartments: number;
  // Optional legacy attendance props (no longer used on dashboard)
  totalSessions?: number;
  overallRate?: number;
  attendancePresent?: number;
  attendanceTotal?: number;
  totalAdmins: number;
  totalManagers: number;
  activeAdmins: number;
  activeManagers: number;
  inactiveAdmins: number;
  inactiveManagers: number;
  isSuperAdmin: boolean;
}

export function StatisticsTableView({
  byCategory,
  totalStudents,
  totalDepartments,
  totalAdmins,
  totalManagers,
  activeAdmins,
  activeManagers,
  inactiveAdmins,
  inactiveManagers,
  isSuperAdmin,
}: StatisticsTableViewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border/20">
          <h2 className="text-sm font-semibold text-text-primary">
            {t('dashboard.table.summaryTitle')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-table-header border-b border-border/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {t('dashboard.table.metric')}
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {t('dashboard.table.value')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-text-primary">
                  {t('dashboard.table.totalStudents')}
                </td>
                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalStudents}</td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-text-primary">
                  {t('dashboard.table.totalDepartments')}
                </td>
                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalDepartments}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border/20">
          <h2 className="text-sm font-semibold text-text-primary">
            {t('dashboard.table.byCategoryTitle')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-table-header border-b border-border/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {t('dashboard.table.category')}
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {t('dashboard.table.count')}
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {t('dashboard.table.percentage')}
                </th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(CATEGORY_LABELS) as RecordCategory[]).map((cat) => {
                const count = byCategory[cat] ?? 0;
                const pct = totalStudents ? Math.round((count / totalStudents) * 100) : 0;
                return (
                  <tr key={cat} className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-text-primary">
                      {t(CATEGORY_LABELS[cat])}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{count}</td>
                    <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border/20">
            <h2 className="text-sm font-semibold text-text-primary">
              {t('dashboard.table.adminsManagersTitle')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-table-header border-b border-border/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {t('dashboard.table.role')}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {t('dashboard.table.total')}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {t('dashboard.table.active')}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {t('dashboard.table.inactive')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">
                    {t('dashboard.table.role.admins')}
                  </td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalAdmins}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{activeAdmins}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{inactiveAdmins}</td>
                </tr>
                <tr className="hover:bg-bg-beige-light/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">
                    {t('dashboard.table.role.managers')}
                  </td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalManagers}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{activeManagers}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{inactiveManagers}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
