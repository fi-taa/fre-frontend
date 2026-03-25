'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AttendanceRecordStatus, RecordCategory, Student } from '@/types';
import { useI18n } from '@/i18n/I18nProvider';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { useListProgramsQuery } from '@/store/slices/programsApi';
import {
  useCollectAttendanceMutation,
  useCreateAttendanceBatchMutation,
  useGetEligibleStudentsQuery,
  useListAttendanceSessionsQuery,
} from '@/store/slices/attendanceApi';
import { CATEGORY_API_VALUES, CATEGORY_LABELS, RECORD_CATEGORIES } from '@/types';
import { QrScanner } from '@/components/dashboard/qr-attendance/qr-scanner';
import { CameraPermission } from '@/components/dashboard/qr-attendance/camera-permission';
import { decodeStudentIdFromQr } from '@/components/dashboard/qr-attendance/attendance-qr-payload';

export interface AttendanceTakeCombinedProps {
  onFinish: () => void;
}

function isScanTargetStatus(status: AttendanceRecordStatus): boolean {
  return status === 'PRESENT' || status === 'EXCUSED';
}

function statusLabel(status: AttendanceRecordStatus): string {
  if (status === 'PRESENT') return 'Present';
  if (status === 'EXCUSED') return 'Excused';
  return 'Absent';
}

function statusBadgeClasses(status: AttendanceRecordStatus): string {
  if (status === 'PRESENT') return 'bg-green-100 text-green-800';
  if (status === 'EXCUSED') return 'bg-accent/10 text-accent';
  return 'bg-bg-beige-light text-text-secondary';
}

function parseCreatedSessionId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value;
  if (typeof value === 'string') {
    const asNum = Number(value);
    if (Number.isInteger(asNum) && asNum > 0) return asNum;
    return null;
  }
  if (value && typeof value === 'object' && 'id' in value) {
    const idValue = (value as { id?: unknown }).id;
    if (typeof idValue === 'number' && Number.isInteger(idValue) && idValue > 0) return idValue;
    if (typeof idValue === 'string') {
      const asNum = Number(idValue);
      if (Number.isInteger(asNum) && asNum > 0) return asNum;
    }
  }
  return null;
}

export function AttendanceTakeCombined({ onFinish }: AttendanceTakeCombinedProps) {
  const { t } = useI18n();
  const today = new Date().toISOString().split('T')[0];

  const [departmentId, setDepartmentId] = useState<string>('');
  const [programId, setProgramId] = useState<string>('');
  const [date, setDate] = useState<string>(today);
  const [category, setCategory] = useState<RecordCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [attendanceSessionId, setAttendanceSessionId] = useState<number | null>(null);
  const [statusByStudentId, setStatusByStudentId] = useState<Map<number, AttendanceRecordStatus>>(new Map());

  const [scanStatus, setScanStatus] = useState<AttendanceRecordStatus>('PRESENT');
  const [isScanning, setIsScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const scanInFlightRef = useRef(false);

  const { data: allDepartments = [], isLoading: departmentsLoading } = useListDepartmentsQuery();
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const adminDepartmentIds = currentUser?.department_ids || [];
  const managerDepartmentIds = isManager ? currentUser?.department_ids || [] : [];

  const departments = useMemo(() => {
    if (isSuperAdmin) return allDepartments;
    if (isAdmin && adminDepartmentIds.length > 0) return allDepartments.filter((d) => adminDepartmentIds.includes(d.id));
    if (isManager && managerDepartmentIds.length > 0) return allDepartments.filter((d) => managerDepartmentIds.includes(d.id));
    return [];
  }, [allDepartments, isSuperAdmin, isAdmin, isManager, adminDepartmentIds, managerDepartmentIds]);

  const departmentIdNum = departmentId ? parseInt(departmentId, 10) : 0;
  const { data: programs = [], isLoading: programsLoading } = useListProgramsQuery(
    { department_id: departmentIdNum, include_inactive: false },
    { skip: departmentIdNum <= 0 }
  );

  const categoryApi = category ? CATEGORY_API_VALUES[category] : '';
  const canFetchEligible = departmentIdNum > 0 && categoryApi !== '';
  const { data: eligibleStudents = [], isLoading: eligibleLoading } = useGetEligibleStudentsQuery(
    { department_id: departmentIdNum, category: categoryApi },
    { skip: !canFetchEligible }
  );

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return eligibleStudents;
    const term = searchTerm.toLowerCase();
    return eligibleStudents.filter(
      (s: Student) => s.name.toLowerCase().includes(term) || (s.church ?? '').toLowerCase().includes(term)
    );
  }, [eligibleStudents, searchTerm]);

  const studentMap = useMemo(() => new Map(eligibleStudents.map((s) => [s.id, s])), [eligibleStudents]);

  const listSessionsParams = useMemo(() => {
    const progId = programId ? parseInt(programId, 10) : 0;
    if (!progId || !categoryApi) return null;
    return {
      program_id: progId,
      department_id: departmentIdNum > 0 ? departmentIdNum : null,
      category: categoryApi,
      include_inactive: false,
    };
  }, [programId, departmentIdNum, categoryApi]);

  const { data: candidateSessions = [] } = useListAttendanceSessionsQuery(listSessionsParams ?? undefined, {
    skip: !listSessionsParams,
  });

  const existingSessionForDate = useMemo(() => {
    if (!listSessionsParams) return null;
    return candidateSessions.find((s) => s.date === date) ?? null;
  }, [candidateSessions, date, listSessionsParams]);

  const [createBatch, { isLoading: isCreatingSession }] = useCreateAttendanceBatchMutation();
  const [collectAttendance, { isLoading: isCollecting }] = useCollectAttendanceMutation();

  const counts = useMemo(() => {
    let present = 0;
    let excused = 0;
    let absent = 0;

    for (const s of eligibleStudents) {
      const st = statusByStudentId.get(s.id) ?? 'ABSENT';
      if (st === 'PRESENT') present += 1;
      else if (st === 'EXCUSED') excused += 1;
      else absent += 1;
    }

    return { present, excused, absent, total: eligibleStudents.length };
  }, [eligibleStudents, statusByStudentId]);

  function applySession(sessionId: number, records: Array<{ student_id: number; status: AttendanceRecordStatus }>) {
    setAttendanceSessionId(sessionId);
    const next = new Map<number, AttendanceRecordStatus>(eligibleStudents.map((s) => [s.id, 'ABSENT']));
    for (const rec of records) next.set(rec.student_id, rec.status);
    setStatusByStudentId(next);
    setSessionError(null);
    setScanFeedback(null);
    setIsScanning(false);
  }

  useEffect(() => {
    if (attendanceSessionId) return;
    if (!existingSessionForDate) return;
    if (!canFetchEligible || eligibleLoading) return;
    if (eligibleStudents.length === 0) return;
    applySession(existingSessionForDate.id, existingSessionForDate.records);
  }, [
    attendanceSessionId,
    existingSessionForDate,
    canFetchEligible,
    eligibleLoading,
    eligibleStudents,
  ]);

  async function ensureSession() {
    setSessionError(null);
    setScanFeedback(null);

    if (!departmentId || !programId || !category) {
      setSessionError(t('error.attendance.missingSelections'));
      return;
    }

    const progId = parseInt(programId, 10);
    if (Number.isNaN(progId)) {
      setSessionError(t('error.attendance.invalidProgram'));
      return;
    }

    if (eligibleStudents.length === 0) {
      setSessionError(t('attendance.noEligible') ?? 'No eligible students');
      return;
    }

    if (existingSessionForDate) return;

    try {
      const sessionIdRaw = await createBatch({
        date,
        program_id: progId,
        category: categoryApi,
        records: eligibleStudents.map((s) => ({ student_id: s.id, status: 'ABSENT' })),
      }).unwrap();

      const sessionIdNum = parseCreatedSessionId(sessionIdRaw);
      if (!sessionIdNum) throw new Error('Invalid session id');

      setAttendanceSessionId(sessionIdNum);
      setStatusByStudentId(new Map(eligibleStudents.map((s) => [s.id, 'ABSENT' as AttendanceRecordStatus])));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { detail?: unknown } }).data?.detail ?? t('error.attendance.saveFailed'))
          : t('error.attendance.saveFailed');
      setSessionError(message);
    }
  }

  async function markStudent(studentId: number, status: AttendanceRecordStatus) {
    if (!attendanceSessionId) return;
    if (!isScanTargetStatus(status) && status !== 'ABSENT') return;

    const student = studentMap.get(studentId);
    if (!student) return;

    setScanFeedback(null);
    try {
      await collectAttendance({
        session_id: attendanceSessionId,
        body: { student_id: studentId, status, notes: notes.trim() || null },
      }).unwrap();

      setStatusByStudentId((prev) => {
        const next = new Map(prev);
        next.set(studentId, status);
        return next;
      });
    } catch {
      setScanFeedback('Failed to save attendance');
    }
  }

  async function handleDecodeScan(decodedText: string) {
    if (!attendanceSessionId) return;
    if (scanInFlightRef.current) return;
    if (!isScanTargetStatus(scanStatus)) return;

    const studentId = decodeStudentIdFromQr(decodedText);
    if (!studentId) {
      setScanFeedback('Invalid QR code');
      return;
    }

    const student = studentMap.get(studentId);
    if (!student) {
      setScanFeedback('Student not in this session');
      return;
    }

    const currentStatus = statusByStudentId.get(studentId) ?? 'ABSENT';
    if (currentStatus === scanStatus) {
      setScanFeedback(`${student.name} already marked`);
      return;
    }

    scanInFlightRef.current = true;
    try {
      await markStudent(studentId, scanStatus);
      setScanFeedback(`${student.name} marked as ${statusLabel(scanStatus)}`);
    } finally {
      scanInFlightRef.current = false;
    }
  }

  const setupLocked = attendanceSessionId !== null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label htmlFor="take-dept" className="block text-xs font-medium mb-1.5 text-text-secondary">
            {t('filters.department')} <span className="text-error">*</span>
          </label>
          {departmentsLoading ? (
            <div className="h-9 px-3 rounded-lg border border-border/40 bg-bg-beige-light flex items-center text-xs text-text-secondary">
              {t('attendance.loadingDepartments')}
            </div>
          ) : departments.length === 0 ? (
            <div className="h-9 px-3 rounded-lg border border-border/40 bg-bg-beige-light flex items-center text-xs text-text-secondary">
              No departments available
            </div>
          ) : (
            <select
              id="take-dept"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setProgramId('');
              }}
              required
              disabled={setupLocked}
              className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
          <label htmlFor="take-program" className="block text-xs font-medium mb-1.5 text-text-secondary">
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
              id="take-program"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              required
              disabled={setupLocked}
              className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
          <label htmlFor="take-date" className="block text-xs font-medium mb-1.5 text-text-secondary">
            {t('attendance.date')} <span className="text-error">*</span>
          </label>
          <input
            id="take-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={setupLocked}
            className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="take-category" className="block text-xs font-medium mb-1.5 text-text-secondary">
            {t('filters.category')} <span className="text-error">*</span>
          </label>
          <select
            id="take-category"
            value={category}
            onChange={(e) => setCategory((e.target.value || '') as RecordCategory | '')}
            required
            disabled={setupLocked}
            className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-60 disabled:cursor-not-allowed"
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

      {sessionError && <div className="px-3 py-2 rounded-lg bg-red-50 text-red-800 text-sm">{sessionError}</div>}

      {!attendanceSessionId ? (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-xs text-text-secondary">
            {eligibleLoading ? 'Loading eligible students...' : existingSessionForDate ? 'Loading existing session…' : 'No session yet'}
          </div>
          <button
            type="button"
            onClick={ensureSession}
            disabled={isCreatingSession || !departmentId || !programId || !category || eligibleStudents.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {isCreatingSession ? 'Creating session...' : 'Create session'}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Present {counts.present}</span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent">Excused {counts.excused}</span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-bg-beige-light text-text-secondary">Absent {counts.absent}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsScanning((v) => !v)}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-border/40 hover:bg-link/5 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
            >
              {isScanning ? 'Stop scanner' : 'Start scanner'}
            </button>
            <button
              type="button"
              onClick={onFinish}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-accent text-text-light hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              Finish
            </button>
          </div>
        </div>
      )}

      {attendanceSessionId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="bg-card rounded-lg border border-border/30 p-3 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-xs font-semibold text-text-secondary">QR Scan</div>
              <div className="flex gap-2">
                {(['PRESENT', 'EXCUSED'] as AttendanceRecordStatus[]).filter(isScanTargetStatus).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setScanStatus(status)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-link/30 ${
                      scanStatus === status
                        ? 'bg-accent text-text-light border-accent'
                        : 'border-border/40 text-text-primary hover:border-link/40 hover:bg-link/5'
                    }`}
                  >
                    {statusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            {scanFeedback && <div className="px-3 py-2 rounded-lg bg-bg-beige-light text-text-secondary text-sm">{scanFeedback}</div>}

            {isScanning ? (
              <QrScanner onScanSuccess={handleDecodeScan} />
            ) : (
              <div className="min-h-[320px] flex flex-col items-center justify-center text-center p-4">
                <div className="text-sm font-medium text-text-primary">Scanner is off</div>
                <div className="text-xs text-text-secondary mt-1.5">Tap “Start scanner” to begin</div>
                <div className="w-full max-w-sm mt-4 text-left">
                  <CameraPermission />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="take-notes" className="block text-xs font-medium mb-1.5 text-text-secondary">
                {t('attendance.notesLabel')}
              </label>
              <textarea
                id="take-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={t('attendance.notesPlaceholder')}
                className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
              <div className="text-[11px] text-text-secondary mt-1.5">Notes will be attached to scanned/manual updates.</div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/30 p-3 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-xs font-semibold text-text-secondary">Manual</div>
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
            </div>

            <div className="max-h-[520px] overflow-y-auto">
              {eligibleLoading ? (
                <div className="p-6 text-center text-sm text-text-secondary">{t('attendance.loadingEligible')}</div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-secondary">{t('attendance.noEligible')}</div>
              ) : (
                <ul className="divide-y divide-border/30">
                  {filteredStudents.map((student) => {
                    const status = statusByStudentId.get(student.id) ?? 'ABSENT';
                    return (
                      <li key={student.id} className="p-3 flex items-center justify-between gap-2 hover:bg-bg-beige-light">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-text-primary truncate">{student.name}</div>
                          <div className="text-xs text-text-secondary">
                            {student.church ?? '—'} · {t('attendance.ageLabel')} {student.age}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${statusBadgeClasses(status)}`}>
                            {statusLabel(status)}
                          </span>
                          <div className="flex gap-1">
                            {(['PRESENT', 'EXCUSED', 'ABSENT'] as AttendanceRecordStatus[]).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => markStudent(student.id, s)}
                                disabled={isCollecting}
                                className={`min-h-[40px] px-2.5 text-xs font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-link/30 ${
                                  status === s
                                    ? 'bg-accent text-text-light border-accent'
                                    : 'border-border/40 text-text-primary hover:border-link/40 hover:bg-link/5'
                                }`}
                              >
                                {s === 'PRESENT' ? 'P' : s === 'EXCUSED' ? 'E' : 'A'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

