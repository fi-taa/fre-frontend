'use client';

import { useState, useMemo } from 'react';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { useListProgramsQuery } from '@/store/slices/programsApi';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
import {
  useGetEligibleStudentsQuery,
  useCreateAttendanceBatchMutation,
} from '@/store/slices/attendanceApi';
import { RECORD_CATEGORIES, CATEGORY_LABELS, CATEGORY_API_VALUES } from '@/types';
import type { RecordCategory } from '@/types';
import type { Student } from '@/types';
import { useI18n } from '@/i18n/I18nProvider';

interface AttendanceFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialRecordId?: string;
}

export function AttendanceForm({ onSuccess, initialRecordId }: AttendanceFormProps) {
  const { t } = useI18n();
  const today = new Date().toISOString().split('T')[0];
  const [departmentId, setDepartmentId] = useState<string>('');
  const [programId, setProgramId] = useState<string>('');
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<RecordCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [presentByStudentId, setPresentByStudentId] = useState<Map<number, boolean>>(new Map());
  const [globalNotes, setGlobalNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: allDepartments = [], isLoading: departmentsLoading } = useListDepartmentsQuery();
  const { data: currentUserData } = useGetCurrentUserQuery();
  const departmentIdNum = departmentId ? parseInt(departmentId, 10) : 0;
  const { data: programs = [], isLoading: programsLoading } = useListProgramsQuery(
    { department_id: departmentIdNum, include_inactive: false },
    { skip: departmentIdNum <= 0 }
  );

  const currentUser = currentUserData?.data;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const adminDepartmentIds = currentUser?.department_ids || [];
  const managerDepartmentIds = isManager ? currentUser?.department_ids || [] : [];
  
  const departments = useMemo(() => {
    if (isSuperAdmin) {
      return allDepartments;
    }
    if (isAdmin && adminDepartmentIds.length > 0) {
      return allDepartments.filter((d) => adminDepartmentIds.includes(d.id));
    }
    if (isManager && managerDepartmentIds.length > 0) {
      return allDepartments.filter((d) => managerDepartmentIds.includes(d.id));
    }
    return [];
  }, [allDepartments, isSuperAdmin, isAdmin, isManager, currentUser, adminDepartmentIds, managerDepartmentIds]);

  const categoryApi = category ? CATEGORY_API_VALUES[category] : '';
  const canFetchEligible =
    departmentIdNum > 0 && categoryApi !== '';
  const {
    data: eligibleStudents = [],
    isLoading: eligibleLoading,
  } = useGetEligibleStudentsQuery(
    { department_id: departmentIdNum, category: categoryApi },
    { skip: !canFetchEligible }
  );

  const [createBatch, { isLoading: isSubmitting }] = useCreateAttendanceBatchMutation();

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return eligibleStudents;
    const term = searchTerm.toLowerCase();
    return eligibleStudents.filter(
      (s: Student) =>
        s.name.toLowerCase().includes(term) ||
        (s.church ?? '').toLowerCase().includes(term)
    );
  }, [eligibleStudents, searchTerm]);

  const selectedCount = useMemo(() => {
    let count = 0;
    presentByStudentId.forEach((present) => {
      if (present) count++;
    });
    return count;
  }, [presentByStudentId]);

  function togglePresent(studentId: number, present: boolean) {
    setPresentByStudentId((prev) => {
      const next = new Map(prev);
      next.set(studentId, present);
      return next;
    });
  }

  function setAllPresent(present: boolean) {
    const next = new Map<number, boolean>();
    eligibleStudents.forEach((s: Student) => next.set(s.id, present));
    setPresentByStudentId(next);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    if (!departmentId || !programId || !category) {
      setSubmitError(t('error.attendance.missingSelections'));
      return;
    }
    const progId = parseInt(programId, 10);
    if (isNaN(progId)) {
      setSubmitError(t('error.attendance.invalidProgram'));
      return;
    }
    const records = eligibleStudents.map((s: Student) => {
      const present = presentByStudentId.get(s.id) ?? false;
      return {
        student_id: s.id,
        status: (present ? 'PRESENT' : 'ABSENT') as 'PRESENT' | 'ABSENT',
        notes: globalNotes.trim() || undefined,
      };
    });
    if (records.every((r) => r.status !== 'PRESENT')) {
      setSubmitError(t('error.attendance.noPresent'));
      return;
    }
    try {
      await createBatch({
        date,
        program_id: progId,
        category: categoryApi,
        records,
      }).unwrap();
      setPresentByStudentId(new Map());
      setGlobalNotes('');
      onSuccess();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { detail?: unknown } }).data?.detail ?? t('error.attendance.saveFailed'))
          : t('error.attendance.saveFailed');
      setSubmitError(message);
    }
  }

  const isFormValid = departmentId && programId && category && eligibleStudents.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label htmlFor="att-dept" className="block text-xs font-medium mb-1.5 text-text-secondary">
            {t('filters.department')} <span className="text-error">*</span>
          </label>
          {departmentsLoading ? (
            <div className="h-9 px-3 rounded-lg border border-border/40 bg-bg-beige-light flex items-center text-xs text-text-secondary">
              {t('attendance.loadingDepartments')}
            </div>
          ) : departments.length === 0 ? (
            <input
              id="att-dept"
              type="number"
              min={1}
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setProgramId('');
              }}
              placeholder={t('attendance.departmentIdPlaceholder')}
              className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
            />
          ) : (
            <select
              id="att-dept"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setProgramId('');
              }}
              required
              className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
            >
              <option value="">{t('Choose department')}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="att-program" className="block text-xs font-medium mb-1.5 text-text-secondary">
            {t('attendance.program')} <span className="text-error">*</span>
          </label>
          {programsLoading || departmentIdNum <= 0 ? (
            <div className="h-9 px-3 rounded-lg border border-border/40 bg-bg-beige-light flex items-center text-xs text-text-secondary">
              {departmentIdNum <= 0 ? t('attendance.selectDepartmentFirst') : t('attendance.loadingPrograms')}
            </div>
          ) : programs.length === 0 ? (
            <div className="h-9 px-3 rounded-lg border border-border/40 bg-bg-beige-light flex items-center text-xs text-text-secondary">
              {t('attendance.noPrograms')}
            </div>
          ) : (
            <select
              id="att-program"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              required
              className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
            >
              <option value="">{t('attendance.chooseProgram')}</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="att-date" className="block text-xs font-medium mb-1.5 text-text-secondary">
            {t('attendance.date')} <span className="text-error">*</span>
          </label>
          <input
            id="att-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
          />
        </div>
        <div>
          <label htmlFor="att-category" className="block text-xs font-medium mb-1.5 text-text-secondary">
            {t('filters.category')} <span className="text-error">*</span>
          </label>
          <select
            id="att-category"
            value={category}
            onChange={(e) => setCategory((e.target.value || '') as RecordCategory | '')}
            required
            className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
          >
            <option value="">{t('filters.category')}</option>
            {RECORD_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(CATEGORY_LABELS[cat])}
              </option>
            ))}
          </select>
        </div>
      </div>

      {canFetchEligible && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('attendance.searchStudents')}
                className="w-full h-9 pl-8 pr-8 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-xs text-text-secondary">
                {selectedCount} {t('attendance.present')} · {filteredStudents.length} {t('attendance.eligible')}
              </span>
              <button
                type="button"
                onClick={() => setAllPresent(true)}
                className="px-2 py-1 text-xs font-medium rounded-lg border border-border/40 hover:bg-link/5 text-text-primary"
              >
                {t('attendance.allPresent')}
              </button>
              <button
                type="button"
                onClick={() => setAllPresent(false)}
                className="px-2 py-1 text-xs font-medium rounded-lg border border-border/40 hover:bg-link/5 text-text-primary"
              >
                {t('attendance.allAbsent')}
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              {eligibleLoading ? (
                <div className="p-6 text-center text-sm text-text-secondary">
                  {t('attendance.loadingEligible')}
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-secondary">
                  {t('attendance.noEligible')}
                </div>
              ) : (
                <ul className="divide-y divide-border/30">
                  {filteredStudents.map((student: Student) => {
                    const present = presentByStudentId.get(student.id) ?? false;
                    const isInitial = initialRecordId && String(student.id) === initialRecordId;
                    return (
                      <li
                        key={student.id}
                        className={`p-3 flex items-center justify-between gap-2 hover:bg-bg-beige-light ${
                          isInitial ? 'bg-accent/5' : ''
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-text-primary truncate">
                            {student.name}
                            {isInitial && (
                              <span className="ml-1 text-xs text-accent">
                                {t('attendance.thisRecord')}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {student.church ?? '—'} · {t('attendance.ageLabel')} {student.age}
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => togglePresent(student.id, true)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                              present ? 'bg-green-100 text-green-800' : 'bg-bg-beige-light text-text-secondary hover:bg-green-50'
                            }`}
                          >
                            {t('attendance.present')}
                          </button>
                          <button
                            type="button"
                            onClick={() => togglePresent(student.id, false)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                              !present ? 'bg-red-100 text-red-800' : 'bg-bg-beige-light text-text-secondary hover:bg-red-50'
                            }`}
                          >
                            {t('attendance.absent')}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="att-notes" className="block text-xs font-medium mb-1.5 text-text-secondary">
              {t('attendance.notesLabel')}
            </label>
            <textarea
              id="att-notes"
              value={globalNotes}
              onChange={(e) => setGlobalNotes(e.target.value)}
              rows={2}
              placeholder={t('attendance.notesPlaceholder')}
              className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
            />
          </div>
        </>
      )}

      {submitError && (
        <div className="px-3 py-2 rounded-lg bg-red-50 text-red-800 text-sm">{submitError}</div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          {isSubmitting ? t('attendance.saving') : t('attendance.saveButton')}
        </button>
      </div>
    </form>
  );
}
