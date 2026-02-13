import { useState, useMemo } from 'react';
import { useListStudentsQuery, useDeleteStudentMutation } from '@/store/slices/studentsApi';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
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
  const { data: currentUserData } = useGetCurrentUserQuery();
  const [deleteStudent] = useDeleteStudentMutation();
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const currentUser = currentUserData?.data;
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const adminDepartmentIds = currentUser?.department_ids || [];
  const managerDepartmentIds = isManager ? currentUser?.department_ids || [] : [];

  const records: PersonRecord[] = useMemo(() => {
    let filteredStudents = students;
    
    if (isAdmin && adminDepartmentIds.length > 0) {
      filteredStudents = students.filter((student) => 
        adminDepartmentIds.includes(student.department_id)
      );
    } else if (isManager && managerDepartmentIds.length > 0) {
      filteredStudents = students.filter((student) => 
        managerDepartmentIds.includes(student.department_id)
      );
    }
    
    return filteredStudents.map(studentToRecordView);
  }, [students, isAdmin, isManager, adminDepartmentIds, managerDepartmentIds]);

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
