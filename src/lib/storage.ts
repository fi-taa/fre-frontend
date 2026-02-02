import type { User, LocalAuthUser, PersonRecord, RecordCategory, Event, Attendance } from '@/types';
import { getDefaultEvents } from './event-config';

const USERS_STORAGE_KEY = 'users';
const RECORDS_STORAGE_KEY = 'records';
const EVENTS_STORAGE_KEY = 'events';
const ATTENDANCE_STORAGE_KEY = 'attendance';

export function getUsers(): LocalAuthUser[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveUser(user: LocalAuthUser): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function findUserByUsername(username: string): LocalAuthUser | undefined {
  const users = getUsers();
  return users.find((user) => user.username === username);
}

export function getRecords(category?: RecordCategory): PersonRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    const records: PersonRecord[] = JSON.parse(stored);
    if (category) {
      return records.filter((record) => record.category === category);
    }
    return records;
  } catch {
    return [];
  }
}

export function saveRecord(record: PersonRecord): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const records = getRecords();
  records.push(record);
  localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
}

export function deleteRecord(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const records = getRecords();
  const filtered = records.filter((record) => record.id !== id);
  localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(filtered));
}

export function updateRecord(id: string, data: Partial<PersonRecord>): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const records = getRecords();
  const index = records.findIndex((record) => record.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...data };
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  }
}

export function getEvents(category?: RecordCategory): Event[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (!stored) {
    const defaultEvents = getDefaultEvents();
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(defaultEvents));
    if (category) {
      return defaultEvents.filter((event) => event.category === category);
    }
    return defaultEvents;
  }
  
  try {
    const events: Event[] = JSON.parse(stored);
    if (category) {
      return events.filter((event) => event.category === category);
    }
    return events;
  } catch {
    return [];
  }
}

export function saveEvent(event: Event): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const events = getEvents();
  events.push(event);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
}

export function deleteEvent(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const events = getEvents();
  const filtered = events.filter((event) => event.id !== id);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filtered));
}

export function updateEvent(id: string, data: Partial<Event>): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const events = getEvents();
  const index = events.findIndex((event) => event.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...data };
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }
}

export function getAttendances(recordId?: string, eventId?: string): Attendance[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    const attendances: Attendance[] = JSON.parse(stored);
    let filtered = attendances;
    
    if (recordId) {
      filtered = filtered.filter((attendance) => attendance.recordId === recordId);
    }
    
    if (eventId) {
      filtered = filtered.filter((attendance) => attendance.eventId === eventId);
    }
    
    return filtered;
  } catch {
    return [];
  }
}

export function getAttendancesByDate(date: string): Attendance[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const attendances = getAttendances();
  return attendances.filter((attendance) => attendance.date === date);
}

export function saveAttendance(attendance: Attendance): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const attendances = getAttendances();
  attendances.push(attendance);
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendances));
}

export function deleteAttendance(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const attendances = getAttendances();
  const filtered = attendances.filter((attendance) => attendance.id !== id);
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(filtered));
}

export function updateAttendance(id: string, data: Partial<Attendance>): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const attendances = getAttendances();
  const index = attendances.findIndex((attendance) => attendance.id === id);
  if (index !== -1) {
    attendances[index] = { ...attendances[index], ...data };
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendances));
  }
}
