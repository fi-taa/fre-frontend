'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAttendance } from '@/hooks/use-attendance';
import { getEvents, getRecords } from '@/lib/storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AttendanceStatus } from '@/types';

interface AttendanceHistoryProps {
  recordId: string;
  onTakeAttendance?: () => void;
}

export function AttendanceHistory({ recordId, onTakeAttendance }: AttendanceHistoryProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const { attendances, isLoading } = useAttendance(recordId);
  const allEvents = getEvents();
  const records = getRecords();
  const record = records.find((r) => r.id === recordId);

  const events = useMemo(() => {
    if (!record) return allEvents;
    return allEvents.filter((event) => event.category === record.category);
  }, [allEvents, record]);

  const filteredAttendances = useMemo(() => {
    let filtered = attendances;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((att) => att.status === statusFilter);
    }

    if (eventFilter !== 'all') {
      filtered = filtered.filter((att) => att.eventId === eventFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((att) => att.date === dateFilter);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendances, statusFilter, eventFilter, dateFilter]);

  const statistics = useMemo(() => {
    const total = attendances.length;
    const present = attendances.filter((att) => att.status === 'present').length;
    const absent = attendances.filter((att) => att.status === 'absent').length;
    const late = attendances.filter((att) => att.status === 'late').length;
    const excused = attendances.filter((att) => att.status === 'excused').length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, excused, attendanceRate };
  }, [attendances]);

  const attendancesWithEventNames = filteredAttendances.map((attendance) => {
    const event = events.find((e) => e.id === attendance.eventId);
    return {
      ...attendance,
      eventName: event?.name || 'Unknown Event',
    };
  });

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

  function handleViewAllAttendance() {
    router.push(`/dashboard/attendance?recordId=${recordId}`);
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border/30 p-6">
        <div className="text-text-secondary">Loading attendance history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border/30 bg-table-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-text-primary">Attendance History</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {statistics.total} total • {statistics.attendanceRate}% rate
              </p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              {onTakeAttendance && (
                <button
                  onClick={onTakeAttendance}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 whitespace-nowrap"
                >
                  Take
                </button>
              )}
              <button
                onClick={handleViewAllAttendance}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary whitespace-nowrap"
              >
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="p-2.5 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
            <div className="text-center p-2.5 sm:p-3 rounded-lg bg-bg-beige-light">
              <div className="text-lg sm:text-xl font-bold text-text-primary">{statistics.total}</div>
              <div className="text-[10px] sm:text-xs text-text-secondary mt-0.5">Total</div>
            </div>
            <div className="text-center p-2.5 sm:p-3 rounded-lg bg-green-100">
              <div className="text-lg sm:text-xl font-bold text-green-800">{statistics.present}</div>
              <div className="text-[10px] sm:text-xs text-green-800 mt-0.5">Present</div>
            </div>
            <div className="text-center p-2.5 sm:p-3 rounded-lg bg-red-100">
              <div className="text-lg sm:text-xl font-bold text-red-800">{statistics.absent}</div>
              <div className="text-[10px] sm:text-xs text-red-800 mt-0.5">Absent</div>
            </div>
            <div className="text-center p-2.5 sm:p-3 rounded-lg bg-yellow-100">
              <div className="text-lg sm:text-xl font-bold text-yellow-800">{statistics.late}</div>
              <div className="text-[10px] sm:text-xs text-yellow-800 mt-0.5">Late</div>
            </div>
            <div className="text-center p-2.5 sm:p-3 rounded-lg bg-blue-100 hidden sm:block lg:block">
              <div className="text-lg sm:text-xl font-bold text-blue-800">{statistics.excused}</div>
              <div className="text-[10px] sm:text-xs text-blue-800 mt-0.5">Excused</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-4">
            <div>
              <label htmlFor="statusFilter" className="block text-xs font-medium mb-1 text-text-secondary">
                Status
              </label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AttendanceStatus | 'all')}>
                <SelectTrigger id="statusFilter" className="h-8 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                  <SelectItem value="present" className="text-xs">Present</SelectItem>
                  <SelectItem value="absent" className="text-xs">Absent</SelectItem>
                  <SelectItem value="late" className="text-xs">Late</SelectItem>
                  <SelectItem value="excused" className="text-xs">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="eventFilter" className="block text-xs font-medium mb-1 text-text-secondary">
                Event
              </label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger id="eventFilter" className="h-8 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Events</SelectItem>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <SelectItem key={event.id} value={event.id} className="text-xs">
                        {event.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled className="text-xs">
                      No events
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className={`w-full h-8 px-2 flex items-center justify-between text-xs font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 ${
                  showDateFilter || dateFilter
                    ? 'bg-accent text-text-light border-accent'
                    : 'border-border/40 text-text-primary hover:border-link/40 hover:bg-link/5'
                }`}
              >
                <span>Date {dateFilter && `(${new Date(dateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${showDateFilter ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {showDateFilter && (
            <div className="mb-4 p-2.5 bg-bg-beige-light rounded-lg border border-border/30">
              <input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-8 px-2 text-xs border border-border/40 rounded-lg bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
          )}

          {(statusFilter !== 'all' || eventFilter !== 'all' || dateFilter) && (
            <div className="mb-4">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setEventFilter('all');
                  setDateFilter('');
                }}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-table-header border-b border-border/50 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Date
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Time
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                  Event
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
              {attendancesWithEventNames.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-xs text-text-secondary">
                    {attendances.length === 0
                      ? 'No attendance records'
                      : 'No records match filters'}
                  </td>
                </tr>
              ) : (
                attendancesWithEventNames.map((attendance) => (
                  <tr
                    key={attendance.id}
                    className="border-b border-border/30 hover:bg-bg-beige-light transition-colors duration-200"
                  >
                    <td className="px-2 sm:px-3 py-2 text-xs text-text-primary whitespace-nowrap">
                      {new Date(attendance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-xs text-text-primary whitespace-nowrap">
                      {attendance.time || '-'}
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-xs text-text-primary truncate max-w-[100px] sm:max-w-none">
                      {attendance.eventName}
                    </td>
                    <td className="px-2 sm:px-3 py-2">
                      <span
                        className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(
                          attendance.status
                        )}`}
                      >
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-xs text-text-secondary max-w-[100px] hidden sm:table-cell truncate" title={attendance.notes || undefined}>
                      {attendance.notes || '-'}
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
