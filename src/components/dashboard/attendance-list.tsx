'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useListAttendanceSessionsQuery, useGetAttendanceSessionQuery } from '@/store/slices/attendanceApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
import { useListStudentsQuery } from '@/store/slices/studentsApi';
import { apiCategoryToSlug, CATEGORY_API_VALUES } from '@/types';
import { RECORD_CATEGORIES, CATEGORY_LABELS } from '@/types';
import type { RecordCategory } from '@/types';
import type { AttendanceSession, AttendanceSessionType } from '@/types';

interface AttendanceListProps {
  recordId?: string;
  eventId?: string;
}

const SESSION_TYPES: AttendanceSessionType[] = ['REGULAR', 'EVENT'];

export function AttendanceList(_props: AttendanceListProps) {
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<RecordCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AttendanceSessionType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);

  const listParams = useMemo(() => {
    const params: { department_id?: number; category?: string; type?: AttendanceSessionType } = {};
    const dept = departmentFilter ? parseInt(departmentFilter, 10) : undefined;
    if (dept && !isNaN(dept)) params.department_id = dept;
    if (categoryFilter !== 'all') params.category = CATEGORY_API_VALUES[categoryFilter];
    if (typeFilter !== 'all') params.type = typeFilter;
    return params;
  }, [departmentFilter, categoryFilter, typeFilter]);

  const { data: sessions = [], isLoading: sessionsLoading } = useListAttendanceSessionsQuery(
    Object.keys(listParams).length > 0 ? listParams : undefined
  );

  const filteredSessions = useMemo(() => {
    let list = sessions;

    if (dateFilter) {
      list = list.filter((s) => s.date === dateFilter);
    }
    if (dateRangeStart && dateRangeEnd) {
      list = list.filter((s) => {
        const d = new Date(s.date);
        return d >= new Date(dateRangeStart) && d <= new Date(dateRangeEnd);
      });
    } else if (dateRangeStart) {
      list = list.filter((s) => new Date(s.date) >= new Date(dateRangeStart));
    } else if (dateRangeEnd) {
      list = list.filter((s) => new Date(s.date) <= new Date(dateRangeEnd));
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, dateFilter, dateRangeStart, dateRangeEnd]);

  const { data: allDepartments = [] } = useListDepartmentsQuery();
  const { data: currentUserData } = useGetCurrentUserQuery();
  
  const currentUser = currentUserData?.data;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const adminDepartmentIds = currentUser?.department_ids || [];
  const managerDepartmentIds = isManager ? currentUser?.department_ids || [] : [];
  
  const departments = useMemo(() => {
    if (isSuperAdmin) {
      return allDepartments;
    }
    if (isAdmin && adminDepartmentIds.length > 0) {
      return allDepartments.filter((d) => adminDepartmentIds.includes(d.id));
    }
    if (isManager && managerDepartmentIds.length > 0) {
      return allDepartments.filter((d) => managerDepartmentIds.includes(d.id));
    }
    return [];
  }, [allDepartments, isSuperAdmin, isAdmin, isManager, currentUser, adminDepartmentIds, managerDepartmentIds]);
  
  const departmentMap = useMemo(() => new Map(departments.map((d) => [d.id, d.name])), [departments]);

  const hasActiveFilters =
    departmentFilter !== '' ||
    categoryFilter !== 'all' ||
    typeFilter !== 'all' ||
    dateFilter !== '' ||
    dateRangeStart !== '' ||
    dateRangeEnd !== '';

  const activeFilterCount = [
    departmentFilter !== '',
    categoryFilter !== 'all',
    typeFilter !== 'all',
    dateFilter !== '',
    dateRangeStart !== '' || dateRangeEnd !== '',
  ].filter(Boolean).length;

  function clearAllFilters() {
    setDepartmentFilter('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setDateFilter('');
    setDateRangeStart('');
    setDateRangeEnd('');
  }

  const hasSessions = sessions.length > 0 || !sessionsLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 ${
            showFilters || hasActiveFilters
              ? 'bg-accent text-text-light border-accent'
              : 'border-border/40 text-text-primary hover:border-link/40 hover:bg-link/5'
          }`}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-text-light/20">
              {activeFilterCount}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-card rounded-lg border border-border/30 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label htmlFor="list-dept" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Department
              </label>
              <select
                id="list-dept"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              >
                <option value="">All</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="list-category" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Category
              </label>
              <select
                id="list-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter((e.target.value || 'all') as RecordCategory | 'all')}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              >
                <option value="all">All</option>
                {RECORD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="list-type" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Type
              </label>
              <select
                id="list-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter((e.target.value || 'all') as AttendanceSessionType | 'all')}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              >
                <option value="all">All</option>
                {SESSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="list-date" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Date
              </label>
              <input
                id="list-date"
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setDateRangeStart('');
                  setDateRangeEnd('');
                }}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
            <div>
              <label htmlFor="list-dateStart" className="block text-xs font-medium mb-1.5 text-text-secondary">
                From
              </label>
              <input
                id="list-dateStart"
                type="date"
                value={dateRangeStart}
                onChange={(e) => {
                  setDateRangeStart(e.target.value);
                  setDateFilter('');
                }}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
            <div>
              <label htmlFor="list-dateEnd" className="block text-xs font-medium mb-1.5 text-text-secondary">
                To
              </label>
              <input
                id="list-dateEnd"
                type="date"
                value={dateRangeEnd}
                onChange={(e) => {
                  setDateRangeEnd(e.target.value);
                  setDateFilter('');
                }}
                min={dateRangeStart}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        {!hasSessions ? (
          <div className="p-8 text-center text-text-secondary text-sm">Loading sessions...</div>
        ) : (
          <>
            <div className="px-4 py-2 border-b border-border/30 bg-table-header text-xs text-text-secondary">
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-table-header border-b border-border/50">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                      Department
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                      Records
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary w-20">
                      —
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-text-secondary text-sm">
                        No sessions found
                      </td>
                    </tr>
                  ) : (
                filteredSessions.map((session: AttendanceSession) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    departmentName={departmentMap.get(session.department_id) ?? `#${session.department_id}`}
                    isExpanded={expandedSessionId === session.id}
                    onToggle={() => setExpandedSessionId((id) => (id === session.id ? null : session.id))}
                  />
                ))
              )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface SessionRowProps {
  session: AttendanceSession;
  departmentName: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function SessionRow({ session, departmentName, isExpanded, onToggle }: SessionRowProps) {
  const categorySlug = apiCategoryToSlug(session.category);
  const presentCount = session.records.filter((r) => r.present).length;

  return (
    <>
      <tr
        className="border-b border-border/30 hover:bg-bg-beige-light transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-3 py-2.5 text-sm text-text-primary whitespace-nowrap">
          {new Date(session.date).toLocaleDateString()}
        </td>
        <td className="px-3 py-2.5 text-sm text-text-primary">{departmentName}</td>
        <td className="px-3 py-2.5 text-sm text-text-primary">{CATEGORY_LABELS[categorySlug]}</td>
        <td className="px-3 py-2.5 text-sm text-text-primary">{session.type}</td>
        <td className="px-3 py-2.5 text-sm text-text-primary">
          {presentCount} / {session.records.length}
        </td>
        <td className="px-3 py-2.5">
          <span className="text-text-secondary">{isExpanded ? '▼' : '▶'}</span>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0 bg-bg-beige-light/50">
            <SessionDetail sessionId={session.id} />
          </td>
        </tr>
      )}
    </>
  );
}

interface SessionDetailProps {
  sessionId: number;
}

function SessionDetail({ sessionId }: SessionDetailProps) {
  const { data: session, isLoading } = useGetAttendanceSessionQuery(sessionId);
  const { data: students = [] } = useListStudentsQuery();
  const studentMap = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);

  if (isLoading || !session) {
    return (
      <div className="px-4 py-3 text-sm text-text-secondary">Loading...</div>
    );
  }

  return (
    <div className="px-4 py-3 border-t border-border/30">
      <div className="text-xs font-medium text-text-secondary mb-2">Session records</div>
      <ul className="space-y-1.5 max-h-48 overflow-y-auto">
        {session.records.length === 0 ? (
          <li className="text-sm text-text-secondary">No records</li>
        ) : (
          session.records.map((rec) => {
            const student = studentMap.get(rec.student_id);
            return (
              <li key={rec.id} className="flex items-center justify-between gap-2 text-sm">
                <Link
                  href={`/dashboard/records/${rec.student_id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-link hover:text-link/80 font-medium truncate flex-1 min-w-0 block"
                >
                  {student?.name ?? `Student #${rec.student_id}`}
                </Link>
                <span
                  className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${
                    rec.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {rec.present ? 'Present' : 'Absent'}
                </span>
                {rec.notes && (
                  <span className="text-xs text-text-secondary truncate max-w-[120px]" title={rec.notes}>
                    {rec.notes}
                  </span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
