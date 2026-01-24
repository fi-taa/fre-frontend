import type { User, Record, RecordCategory } from '@/types';

const USERS_STORAGE_KEY = 'users';
const RECORDS_STORAGE_KEY = 'records';

export function getUsers(): User[] {
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

export function saveUser(user: User): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function findUserByCodeId(codeId: string): User | undefined {
  const users = getUsers();
  return users.find((user) => user.codeId === codeId);
}

export function getRecords(category?: RecordCategory): Record[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    const records: Record[] = JSON.parse(stored);
    if (category) {
      return records.filter((record) => record.category === category);
    }
    return records;
  } catch {
    return [];
  }
}

export function saveRecord(record: Record): void {
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

export function updateRecord(id: string, data: Partial<Record>): void {
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
