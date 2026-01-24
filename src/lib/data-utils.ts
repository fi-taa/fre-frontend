import type { Record, RecordCategory, SortField, SortDirection } from '@/types';

export function sortRecords(
  records: Record[],
  field: SortField,
  direction: SortDirection
): Record[] {
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
  records: Record[],
  category: RecordCategory | null,
  searchTerm: string
): Record[] {
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
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'ደህና አደርክ';
  } else if (hour < 18) {
    return 'ደህና አደርክ';
  } else {
    return 'ደህና አደርክ';
  }
}
