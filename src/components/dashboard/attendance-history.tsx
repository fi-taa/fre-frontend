'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetStudentQuery } from '@/store/slices/studentsApi';
import { useListAttendanceSessionsQuery } from '@/store/slices/attendanceApi';
import { studentToRecordView } from '@/lib/data-utils';
import { CATEGORY_API_VALUES } from '@/types';
import type { RecordCategory } from '@/types';

interface SessionRecordView {
  sessionId: number;
  date: string;
  type: string;
  present: boolean;
  notes: string | null;
}

interface AttendanceHistoryProps {
  recordId: string;
  attendanceHref?: string;
}

export function AttendanceHistory({ recordId, attendanceHref }: AttendanceHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const recordIdNum = parseInt(recordId, 10);
  const { data: student } = useGetStudentQuery(recordIdNum, { skip: isNaN(recordIdNum) });
  const record = student ? studentToRecordView(student) : undefined;
  const categoryApi = record ? CATEGORY_API_VALUES[record.category] : '';

  const { data: sessions = [] } = useListAttendanceSessionsQuery(
    categoryApi ? { category: categoryApi } : undefined
  );

  const historyRecords = useMemo((): SessionRecordView[] => {
    if (!recordIdNum) return [];
    const out: SessionRecordView[] = [];
    for (const session of sessions) {
      const rec = session.records.find((r) => r.student_id === recordIdNum);
      if (rec) {
        out.push({
          sessionId: session.id,
          date: session.date,
          type: session.type,
          present: rec.present,
          notes: rec.notes ?? null,
        });
      }
    }
    return out.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, recordIdNum]);

  const filteredRecords = useMemo(() => {
    let list = historyRecords;
    if (statusFilter === 'present') list = list.filter((r) => r.present);
    if (statusFilter === 'absent') list = list.filter((r) => !r.present);
    if (dateFilter) list = list.filter((r) => r.date === dateFilter);
    return list;
  }, [historyRecords, statusFilter, dateFilter]);

  const statistics = useMemo(() => {
    const total = historyRecords.length;
    const present = historyRecords.filter((r) => r.present).length;
    const absent = total - present;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, attendanceRate: rate };
  }, [historyRecords]);

  const hasActiveFilters = statusFilter !== 'all' || dateFilter !== '';
  const activeFilterCount = [statusFilter !== 'all', dateFilter !== ''].filter(Boolean).length;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border/30 bg-table-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-text-primary">Attendance History</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {statistics.total} session{statistics.total !== 1 ? 's' : ''} · {statistics.attendanceRate}% present
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              {attendanceHref && (
                <Link
                  href={attendanceHref}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 whitespace-nowrap inline-block"
                >
                  Take
                </Link>
              )}
              {attendanceHref && (
                <Link
                  href={attendanceHref}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary whitespace-nowrap inline-block"
                >
                  View all
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="p-2.5 sm:p-3">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2.5 rounded-lg bg-bg-beige-light">
              <div className="text-lg font-bold text-text-primary">{statistics.total}</div>
              <div className="text-[10px] sm:text-xs text-text-secondary mt-0.5">Total</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-green-100">
              <div className="text-lg font-bold text-green-800">{statistics.present}</div>
              <div className="text-[10px] sm:text-xs text-green-800 mt-0.5">Present</div>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-red-100">
              <div className="text-lg font-bold text-red-800">{statistics.absent}</div>
              <div className="text-[10px] sm:text-xs text-red-800 mt-0.5">Absent</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 ${
                showFilters || hasActiveFilters
                  ? 'bg-accent text-text-light border-accent'
                  : 'border-border/40 text-text-primary hover:border-link/40 hover:bg-link/5'
              }`}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-text-light/20">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('');
                }}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
              >
                Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-bg-beige-light rounded-lg border border-border/30 p-3 space-y-3 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="hist-status" className="block text-xs font-medium mb-1.5 text-text-secondary">
                    Status
                  </label>
                  <select
                    id="hist-status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'present' | 'absent')}
                    className="w-full h-8 px-2 text-xs border border-border/40 rounded-lg bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
                  >
                    <option value="all">All</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hist-date" className="block text-xs font-medium mb-1.5 text-text-secondary">
                    Date
                  </label>
                  <input
                    id="hist-date"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-border/40 rounded-lg bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-table-header border-b border-border/50">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Date
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Type
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Status
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap hidden sm:table-cell">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-xs text-text-secondary">
                    {historyRecords.length === 0 ? 'No attendance records' : 'No records match filters'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((row) => (
                  <tr
                    key={`${row.sessionId}-${row.date}`}
                    className="border-b border-border/30 hover:bg-bg-beige-light transition-colors duration-200"
                  >
                    <td className="px-2 sm:px-3 py-2 text-xs text-text-primary whitespace-nowrap">
                      {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-xs text-text-primary">{row.type}</td>
                    <td className="px-2 sm:px-3 py-2">
                      <span
                        className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                          row.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {row.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td
                      className="px-2 sm:px-3 py-2 text-xs text-text-secondary max-w-[100px] hidden sm:table-cell truncate"
                      title={row.notes ?? undefined}
                    >
                      {row.notes ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
