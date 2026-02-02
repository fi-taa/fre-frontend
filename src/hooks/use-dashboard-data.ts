import { useState, useEffect, useMemo } from 'react';
import { getRecords, saveRecord, deleteRecord, updateRecord } from '@/lib/storage';
import { sortRecords, filterRecords } from '@/lib/data-utils';
import type { PersonRecord, RecordCategory, SortField, SortDirection } from '@/types';

interface UseDashboardDataReturn {
  records: PersonRecord[];
  filteredRecords: PersonRecord[];
  selectedCategory: RecordCategory | null;
  searchTerm: string;
  sortField: SortField | null;
  sortDirection: SortDirection;
  isLoading: boolean;
  setSelectedCategory: (category: RecordCategory | null) => void;
  setSearchTerm: (term: string) => void;
  handleSort: (field: SortField) => void;
  handleDelete: (id: string) => void;
  handleAdd: (record: Omit<PersonRecord, 'id'>) => void;
  handleUpdate: (id: string, data: Partial<PersonRecord>) => void;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [records, setRecords] = useState<PersonRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedRecords = getRecords();
    if (loadedRecords.length === 0) {
      const mockData: PersonRecord[] = [
        { id: '1', name: 'ስም', church: 'ቅ/ግ', age: 25, category: 'adult' },
        { id: '2', name: 'ስም', church: 'ቅ/ግ', age: 30, category: 'youth' },
        { id: '3', name: 'ስም', church: 'ቅ/ግ', age: 20, category: 'adolescent' },
        { id: '4', name: 'ስም', church: 'ቅ/ግ', age: 15, category: 'child' },
      ];
      mockData.forEach((record) => saveRecord(record));
      setRecords(mockData);
    } else {
      setRecords(loadedRecords);
    }
    setIsLoading(false);
  }, []);

  const filteredRecords = useMemo(() => {
    let filtered = filterRecords(records, selectedCategory, searchTerm);
    
    if (sortField) {
      filtered = sortRecords(filtered, sortField, sortDirection);
    }
    
    return filtered;
  }, [records, selectedCategory, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const handleAdd = (recordData: Omit<PersonRecord, 'id'>) => {
    const newRecord: PersonRecord = {
      ...recordData,
      id: crypto.randomUUID(),
    } as PersonRecord;
    saveRecord(newRecord);
    setRecords((prev) => [...prev, newRecord]);
  };

  const handleUpdate = (id: string, data: Partial<PersonRecord>) => {
    updateRecord(id, data);
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...data } : record))
    );
  };

  return {
    records,
    filteredRecords,
    selectedCategory,
    searchTerm,
    sortField,
    sortDirection,
    isLoading,
    setSelectedCategory,
    setSearchTerm,
    handleSort,
    handleDelete,
    handleAdd,
    handleUpdate,
  };
}
