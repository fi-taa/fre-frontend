'use client';

import { CATEGORY_LABELS } from '@/types';
import type { RecordCategory } from '@/types';

interface StatisticsTableViewProps {
  byCategory: Record<RecordCategory, number>;
  totalStudents: number;
  totalDepartments: number;
  totalSessions: number;
  overallRate: number;
  attendancePresent: number;
  attendanceTotal: number;
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
  totalSessions,
  overallRate,
  attendancePresent,
  attendanceTotal,
  totalAdmins,
  totalManagers,
  activeAdmins,
  activeManagers,
  inactiveAdmins,
  inactiveManagers,
  isSuperAdmin,
}: StatisticsTableViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border/20">
          <h2 className="text-sm font-semibold text-text-primary">Summary Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-table-header border-b border-border/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Metric
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-text-primary">Total Students</td>
                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalStudents}</td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-text-primary">Total Departments</td>
                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalDepartments}</td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-text-primary">Total Sessions</td>
                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalSessions}</td>
              </tr>
              <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-text-primary">Overall Attendance Rate</td>
                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">
                  {attendanceTotal ? `${overallRate}%` : '—'}
                </td>
              </tr>
              <tr className="hover:bg-bg-beige-light/50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-text-primary">Total Present</td>
                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">
                  {attendancePresent} / {attendanceTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border/20">
          <h2 className="text-sm font-semibold text-text-primary">Students by Category</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-table-header border-b border-border/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Category
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Count
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(CATEGORY_LABELS) as RecordCategory[]).map((cat) => {
                const count = byCategory[cat] ?? 0;
                const pct = totalStudents ? Math.round((count / totalStudents) * 100) : 0;
                return (
                  <tr key={cat} className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-text-primary">{CATEGORY_LABELS[cat]}</td>
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
            <h2 className="text-sm font-semibold text-text-primary">Admins & Managers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-table-header border-b border-border/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Role
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Total
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Active
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Inactive
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">Admins</td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{totalAdmins}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{activeAdmins}</td>
                  <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">{inactiveAdmins}</td>
                </tr>
                <tr className="hover:bg-bg-beige-light/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-text-primary">Managers</td>
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
