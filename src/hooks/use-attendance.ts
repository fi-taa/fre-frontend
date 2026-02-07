import { useState, useEffect, useMemo } from 'react';
import {
  getAttendances,
  saveAttendance,
  deleteAttendance,
  updateAttendance,
  getAttendancesByDate,
  getEvents,
} from '@/lib/storage';
import type { Attendance, Event } from '@/types';

interface AttendanceWithEvent extends Attendance {
  event?: Event;
}

interface UseAttendanceReturn {
  attendances: AttendanceWithEvent[];
  isLoading: boolean;
  addAttendance: (attendance: Omit<Attendance, 'id' | 'createdAt'>) => void;
  updateAttendanceById: (id: string, data: Partial<Attendance>) => void;
  removeAttendance: (id: string) => void;
  getAttendancesByRecordId: (recordId: string) => AttendanceWithEvent[];
  getAttendancesByEventId: (eventId: string) => AttendanceWithEvent[];
  getAttendancesByDateFilter: (date: string) => AttendanceWithEvent[];
}

export function useAttendance(
  recordId?: string,
  eventId?: string
): UseAttendanceReturn {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadedAttendances = getAttendances(recordId, eventId);
    const loadedEvents = getEvents();
    setAttendances(loadedAttendances);
    setEvents(loadedEvents);
    setIsLoading(false);
  }, [recordId, eventId]);

  const attendancesWithEvent = useMemo(() => {
    return attendances.map((attendance) => {
      const event = events.find((e) => e.id === attendance.eventId);
      return {
        ...attendance,
        event,
      };
    });
  }, [attendances, events]);

  function addAttendance(attendanceData: Omit<Attendance, 'id' | 'createdAt'>) {
    const newAttendance: Attendance = {
      ...attendanceData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveAttendance(newAttendance);
    setAttendances((prev) => [...prev, newAttendance]);
  }

  function updateAttendanceById(id: string, data: Partial<Attendance>) {
    updateAttendance(id, data);
    setAttendances((prev) =>
      prev.map((attendance) =>
        attendance.id === id ? { ...attendance, ...data } : attendance
      )
    );
  }

  function removeAttendance(id: string) {
    deleteAttendance(id);
    setAttendances((prev) => prev.filter((attendance) => attendance.id !== id));
  }

  function getAttendancesByRecordId(recordId: string): AttendanceWithEvent[] {
    return attendancesWithEvent.filter(
      (attendance) => attendance.recordId === recordId
    );
  }

  function getAttendancesByEventId(eventId: string): AttendanceWithEvent[] {
    return attendancesWithEvent.filter(
      (attendance) => attendance.eventId === eventId
    );
  }

  function getAttendancesByDateFilter(date: string): AttendanceWithEvent[] {
    return attendancesWithEvent.filter((attendance) => attendance.date === date);
  }

  return {
    attendances: attendancesWithEvent,
    isLoading,
    addAttendance,
    updateAttendanceById,
    removeAttendance,
    getAttendancesByRecordId,
    getAttendancesByEventId,
    getAttendancesByDateFilter,
  };
}
