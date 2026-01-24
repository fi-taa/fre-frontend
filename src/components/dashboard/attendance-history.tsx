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
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="px-6 py-5 border-b border-border/30 bg-table-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Attendance History</h3>
              <p className="text-sm text-text-secondary mt-1">
                {statistics.total} total records • {statistics.attendanceRate}% attendance rate
              </p>
            </div>
            <div className="flex gap-2">
              {onTakeAttendance && (
                <button
                  onClick={onTakeAttendance}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  Take Attendance
                </button>
              )}
              <button
                onClick={handleViewAllAttendance}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
              >
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-bg-beige-light">
              <div className="text-2xl font-bold text-text-primary">{statistics.total}</div>
              <div className="text-xs text-text-secondary mt-1">Total</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-100">
              <div className="text-2xl font-bold text-green-800">{statistics.present}</div>
              <div className="text-xs text-green-800 mt-1">Present</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-100">
              <div className="text-2xl font-bold text-red-800">{statistics.absent}</div>
              <div className="text-xs text-red-800 mt-1">Absent</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-100">
              <div className="text-2xl font-bold text-yellow-800">{statistics.late}</div>
              <div className="text-xs text-yellow-800 mt-1">Late</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-100">
              <div className="text-2xl font-bold text-blue-800">{statistics.excused}</div>
              <div className="text-xs text-blue-800 mt-1">Excused</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium mb-2 text-text-primary">
                Filter by Status
              </label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AttendanceStatus | 'all')}>
                <SelectTrigger id="statusFilter">
                  <SelectValue placeholder="All Statuses" />
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
              <label htmlFor="eventFilter" className="block text-sm font-medium mb-2 text-text-primary">
                Filter by Event
              </label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger id="eventFilter">
                  <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No events for this category
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium mb-2 text-text-primary">
                Filter by Date
              </label>
              <input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
          </div>

          {(statusFilter !== 'all' || eventFilter !== 'all' || dateFilter) && (
            <div className="mb-4">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setEventFilter('all');
                  setDateFilter('');
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-table-header border-b border-border/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {attendancesWithEventNames.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    {attendances.length === 0
                      ? 'No attendance records found'
                      : 'No records match the current filters'}
                  </td>
                </tr>
              ) : (
                attendancesWithEventNames.map((attendance) => (
                  <tr
                    key={attendance.id}
                    className="border-b border-border/30 hover:bg-bg-beige-light transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {new Date(attendance.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {attendance.time || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">{attendance.eventName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          attendance.status
                        )}`}
                      >
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-xs">
                      <div className="truncate" title={attendance.notes || undefined}>
                        {attendance.notes || '-'}
                      </div>
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
