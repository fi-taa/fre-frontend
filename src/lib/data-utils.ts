import type { PersonRecord, RecordCategory, SortField, SortDirection } from '@/types';

export function sortRecords(
  records: PersonRecord[],
  field: SortField,
  direction: SortDirection
): PersonRecord[] {
  const sorted = [...records].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (field === 'age') {
      aValue = a.age;
      bValue = b.age;
    } else if (field === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else {
      aValue = a.church.toLowerCase();
      bValue = b.church.toLowerCase();
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
}

export function filterRecords(
  records: PersonRecord[],
  category: RecordCategory | null,
  searchTerm: string
): PersonRecord[] {
  let filtered = records;

  if (category) {
    filtered = filtered.filter((record) => record.category === category);
  }

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (record) =>
        record.name.toLowerCase().includes(term) ||
        record.church.toLowerCase().includes(term) ||
        record.age.toString().includes(term)
    );
  }

  return filtered;
}

export function getGreeting(): string {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hour}:${minutes}`;
}
