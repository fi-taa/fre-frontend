'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAttendance } from '@/hooks/use-attendance';
import { getRecords, getEvents } from '@/lib/storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RECORD_CATEGORIES, CATEGORY_LABELS } from '@/types';
import type { AttendanceStatus, RecordCategory } from '@/types';

interface AttendanceListProps {
  recordId?: string;
  eventId?: string;
}

export function AttendanceList({ recordId, eventId }: AttendanceListProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<RecordCategory | 'all'>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { attendances, isLoading } = useAttendance(recordId, eventId);
  const records = getRecords();
  const events = getEvents();

  const filteredAttendances = useMemo(() => {
    let filtered = attendances;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((att) => att.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((att) => {
        const record = records.find((r) => r.id === att.recordId);
        return record?.category === categoryFilter;
      });
    }

    if (eventFilter !== 'all') {
      filtered = filtered.filter((att) => att.eventId === eventFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((att) => att.date === dateFilter);
    }

    if (dateRangeStart && dateRangeEnd) {
      filtered = filtered.filter((att) => {
        const attDate = new Date(att.date);
        const start = new Date(dateRangeStart);
        const end = new Date(dateRangeEnd);
        return attDate >= start && attDate <= end;
      });
    } else if (dateRangeStart) {
      filtered = filtered.filter((att) => {
        const attDate = new Date(att.date);
        const start = new Date(dateRangeStart);
        return attDate >= start;
      });
    } else if (dateRangeEnd) {
      filtered = filtered.filter((att) => {
        const attDate = new Date(att.date);
        const end = new Date(dateRangeEnd);
        return attDate <= end;
      });
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((att) => {
        const record = records.find((r) => r.id === att.recordId);
        return (
          record?.name.toLowerCase().includes(search) ||
          record?.church.toLowerCase().includes(search) ||
          att.event?.name.toLowerCase().includes(search)
        );
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendances, statusFilter, categoryFilter, eventFilter, dateFilter, dateRangeStart, dateRangeEnd, searchTerm, records]);

  function getStatusColor(status: string) {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function handleRecordClick(recordId: string) {
    router.push(`/dashboard/records/${recordId}`);
  }

  function clearAllFilters() {
    setStatusFilter('all');
    setCategoryFilter('all');
    setEventFilter('all');
    setDateFilter('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setSearchTerm('');
  }

  const hasActiveFilters =
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    eventFilter !== 'all' ||
    dateFilter !== '' ||
    dateRangeStart !== '' ||
    dateRangeEnd !== '' ||
    searchTerm !== '';

  const activeFilterCount = [
    statusFilter !== 'all',
    categoryFilter !== 'all',
    eventFilter !== 'all',
    dateFilter !== '',
    dateRangeStart !== '' || dateRangeEnd !== '',
    searchTerm !== '',
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border/30 p-6">
        <div className="text-text-secondary">Loading attendance records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 pr-10 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
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
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-card rounded-lg border border-border/30 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label htmlFor="status" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Status
              </label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AttendanceStatus | 'all')}>
                <SelectTrigger id="status" className="h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Category
              </label>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as RecordCategory | 'all')}>
                <SelectTrigger id="category" className="h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {RECORD_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="event" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Event
              </label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger id="event" className="h-9 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="date" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Specific Date
              </label>
              <input
                id="date"
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
              <label htmlFor="dateStart" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Date From
              </label>
              <input
                id="dateStart"
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
              <label htmlFor="dateEnd" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Date To
              </label>
              <input
                id="dateEnd"
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

          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/30">
            <span className="text-xs font-medium text-text-secondary">Quick Category:</span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                categoryFilter === 'all'
                  ? 'bg-accent text-text-light'
                  : 'bg-bg-beige-light text-text-primary hover:bg-bg-beige-light/80'
              }`}
            >
              All
            </button>
            {RECORD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                  categoryFilter === cat
                    ? 'bg-accent text-text-light'
                    : 'bg-bg-beige-light text-text-primary hover:bg-bg-beige-light/80'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="sticky top-0 z-20 bg-table-header">
            <div className="px-4 py-2 border-b border-border/30">
              <div className="text-xs text-text-secondary">
                Showing <span className="font-medium text-text-primary">{filteredAttendances.length}</span> of{' '}
                <span className="font-medium text-text-primary">{attendances.length}</span> records
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-table-header border-b border-border/50 sticky top-[41px] z-10">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Date
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Time
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Record
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap hidden sm:table-cell">
                  Category
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap hidden md:table-cell">
                  Event
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap hidden lg:table-cell">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-secondary">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((attendance) => {
                  const record = records.find((r) => r.id === attendance.recordId);
                  return (
                    <tr
                      key={attendance.id}
                      className="border-b border-border/30 hover:bg-bg-beige-light transition-colors duration-200"
                    >
                      <td className="px-3 py-2.5 text-sm text-text-primary whitespace-nowrap">
                        {new Date(attendance.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-text-primary whitespace-nowrap">
                        {attendance.time || '-'}
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => handleRecordClick(attendance.recordId)}
                          className="text-link hover:text-link/80 text-sm font-medium text-left"
                        >
                          {record?.name || 'Unknown'}
                        </button>
                        <div className="text-xs text-text-secondary sm:hidden mt-0.5">
                          {record ? CATEGORY_LABELS[record.category] : '-'} • {attendance.event?.name}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-sm text-text-primary whitespace-nowrap hidden sm:table-cell">
                        {record ? CATEGORY_LABELS[record.category] : '-'}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-text-primary whitespace-nowrap hidden md:table-cell">
                        {attendance.event?.name || 'Unknown Event'}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            attendance.status
                          )}`}
                        >
                          {attendance.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-sm text-text-secondary max-w-xs hidden lg:table-cell">
                        <div className="truncate" title={attendance.notes || undefined}>
                          {attendance.notes || '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
