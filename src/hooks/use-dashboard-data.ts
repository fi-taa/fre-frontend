import { useState, useMemo } from 'react';
import { useListStudentsQuery, useDeleteStudentMutation } from '@/store/slices/studentsApi';
import { sortRecords, filterRecords, studentToRecordView } from '@/lib/data-utils';
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
}

export function useDashboardData(): UseDashboardDataReturn {
  const { data: students = [], isLoading } = useListStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const records: PersonRecord[] = useMemo(
    () => students.map(studentToRecordView),
    [students]
  );

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

  const handleDelete = async (id: string) => {
    const studentId = parseInt(id, 10);
    if (isNaN(studentId)) return;
    try {
      await deleteStudent(studentId).unwrap();
    } catch {
      // Error handled by mutation
    }
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
  };
}
