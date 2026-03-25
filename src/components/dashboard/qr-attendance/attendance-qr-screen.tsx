'use client';

import { useMemo, useRef, useState } from 'react';
import type { AttendanceRecordStatus, RecordCategory, Student } from '@/types';
import { useI18n } from '@/i18n/I18nProvider';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { useListProgramsQuery } from '@/store/slices/programsApi';
import { useGetEligibleStudentsQuery, useCollectAttendanceMutation, useCreateAttendanceBatchMutation, useListAttendanceSessionsQuery } from '@/store/slices/attendanceApi';
import { CATEGORY_API_VALUES, CATEGORY_LABELS, RECORD_CATEGORIES } from '@/types';
import { QrScanner } from './qr-scanner';
import { QrMemberGrid } from './qr-member-grid';
import { decodeAttendanceQrPayload, decodeStudentIdFromQr } from './attendance-qr-payload';
import { CameraPermission } from './camera-permission';

export interface AttendanceQrScreenProps {
  onFinish: () => void;
}

function isScanTargetStatus(status: AttendanceRecordStatus): boolean {
  return status === 'PRESENT' || status === 'LATE' || status === 'EXCUSED';
}

export function AttendanceQrScreen({ onFinish }: AttendanceQrScreenProps) {
  const { t } = useI18n();
  const today = new Date().toISOString().split('T')[0];

  const [departmentId, setDepartmentId] = useState<string>('');
  const [programId, setProgramId] = useState<string>('');
  const [date, setDate] = useState<string>(today);
  const [category, setCategory] = useState<RecordCategory | ''>('');

  const [attendanceSessionId, setAttendanceSessionId] = useState<number | null>(null);
  const [statusByStudentId, setStatusByStudentId] = useState<Map<number, AttendanceRecordStatus>>(new Map());

  const [isSessionCreating, setIsSessionCreating] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [shouldSuggestExistingSession, setShouldSuggestExistingSession] = useState(false);

  const [scanStatus, setScanStatus] = useState<AttendanceRecordStatus>('PRESENT');
  const [isScanning, setIsScanning] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

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
  const {
    data: eligibleStudents = [],
    isLoading: eligibleLoading,
  } = useGetEligibleStudentsQuery({ department_id: departmentIdNum, category: categoryApi }, { skip: !canFetchEligible });

  const studentMap = useMemo(() => new Map(eligibleStudents.map((s: Student) => [s.id, s])), [eligibleStudents]);

  const [createBatch, { isLoading: isBatchCreating }] = useCreateAttendanceBatchMutation();
  const [collectAttendance] = useCollectAttendanceMutation();

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

  const { data: candidateSessions = [], isLoading: candidateSessionsLoading } = useListAttendanceSessionsQuery(
    listSessionsParams ?? undefined,
    { skip: !listSessionsParams }
  );

  const existingSessionForDate = useMemo(() => {
    if (!listSessionsParams) return null;
    return candidateSessions.find((s) => s.date === date) ?? null;
  }, [candidateSessions, date, listSessionsParams]);

  function useExistingSession(sessionId: number, records: Array<{ student_id: number; status: AttendanceRecordStatus }>) {
    setAttendanceSessionId(sessionId);
    const next = new Map<number, AttendanceRecordStatus>(eligibleStudents.map((s) => [s.id, 'ABSENT']));
    for (const rec of records) next.set(rec.student_id, rec.status);
    setStatusByStudentId(next);
    setIsScanning(true);
    setShouldSuggestExistingSession(false);
    setSessionError(null);
    setScanFeedback(null);
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

  const counts = useMemo(() => {
    let present = 0;
    let late = 0;
    let excused = 0;
    let missing = 0;
    for (const status of statusByStudentId.values()) {
      if (status === 'PRESENT') present += 1;
      else if (status === 'LATE') late += 1;
      else if (status === 'EXCUSED') excused += 1;
      else missing += 1;
    }

    return { present, late, excused, missing, total: eligibleStudents.length };
  }, [statusByStudentId, eligibleStudents.length]);

  const filtersDisabled = attendanceSessionId !== null;

  async function handleCreateSession() {
    setSessionError(null);
    setScanFeedback(null);
    setShouldSuggestExistingSession(false);

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

    setIsSessionCreating(true);
    try {
      const sessionIdRaw = await createBatch({
        date,
        program_id: progId,
        category: categoryApi,
        records: eligibleStudents.map((s) => ({
          student_id: s.id,
          status: 'ABSENT',
        })),
      }).unwrap();

      const sessionIdNum = parseCreatedSessionId(sessionIdRaw);
      if (!sessionIdNum) {
        throw new Error('Invalid session id');
      }

      setAttendanceSessionId(sessionIdNum);
      setStatusByStudentId(new Map(eligibleStudents.map((s) => [s.id, 'ABSENT' as AttendanceRecordStatus])));
      setIsScanning(true);
      setPrintMode(false);
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { detail?: unknown } }).data?.detail ?? t('error.attendance.saveFailed'))
          : t('error.attendance.saveFailed');
      setSessionError(message);
      if (message.toLowerCase().includes('already recorded')) {
        setShouldSuggestExistingSession(true);
      }
    } finally {
      setIsSessionCreating(false);
    }
  }

  function resetSession() {
    setAttendanceSessionId(null);
    setStatusByStudentId(new Map());
    setIsScanning(false);
    setScanFeedback(null);
    setSessionError(null);
    setPrintMode(false);
  }

  async function handleDecodeScan(decodedText: string) {
    if (!attendanceSessionId) return;
    if (scanInFlightRef.current) return;
    if (!isScanTargetStatus(scanStatus)) return;

    const payloadWithSession = decodeAttendanceQrPayload(decodedText);
    if (payloadWithSession && payloadWithSession.sessionId !== attendanceSessionId) {
      setScanFeedback('Wrong session QR');
      return;
    }

    const studentId = payloadWithSession ? payloadWithSession.studentId : decodeStudentIdFromQr(decodedText);
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
      await collectAttendance({
        session_id: attendanceSessionId,
        body: { student_id: studentId, status: scanStatus },
      }).unwrap();

      setStatusByStudentId((prev) => {
        const next = new Map(prev);
        next.set(studentId, scanStatus);
        return next;
      });

      const nextLabel =
        scanStatus === 'PRESENT' ? 'Present' : scanStatus === 'LATE' ? 'Late' : scanStatus === 'EXCUSED' ? 'Excused' : 'Marked';
      setScanFeedback(`${student.name} marked as ${nextLabel}`);
    } catch {
      setScanFeedback('Failed to save attendance');
    } finally {
      scanInFlightRef.current = false;
    }
  }

  function handlePrint() {
    setPrintMode(true);
    setIsScanning(false);
    setTimeout(() => {
      window.print();
    }, 50);
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <div className="text-sm font-semibold text-text-primary">QR Attendance</div>
              <div className="text-xs text-text-secondary">
                {t('attendance.sessionsLabel')} · {counts.total} members
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsScanning((v) => !v)}
                disabled={!attendanceSessionId || printMode}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-border/40 hover:bg-link/5 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? 'Stop scanner' : 'Start scanner'}
              </button>

              {/* Printing per-student QR cards is expected to be handled where members are created/managed. */}

              <button
                type="button"
                onClick={onFinish}
                disabled={!attendanceSessionId}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-accent text-text-light hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finish session
              </button>

              {attendanceSessionId && (
                <button
                  type="button"
                  onClick={resetSession}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-border/40 hover:bg-bg-beige-light focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
                >
                  New session
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label htmlFor="qr-dept" className="block text-xs font-medium mb-1.5 text-text-secondary">
                {t('filters.department') ?? t('attendance.department')}
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
                  id="qr-dept"
                  value={departmentId}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    setProgramId('');
                  }}
                  required
                  disabled={filtersDisabled}
                  className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">{t('Choose department') ?? 'Choose department'}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="qr-program" className="block text-xs font-medium mb-1.5 text-text-secondary">
                {t('attendance.program')}
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
                  id="qr-program"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  required
                  disabled={filtersDisabled}
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
              <label htmlFor="qr-date" className="block text-xs font-medium mb-1.5 text-text-secondary">
                {t('attendance.date')}
              </label>
              <input
                id="qr-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={filtersDisabled}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="qr-category" className="block text-xs font-medium mb-1.5 text-text-secondary">
                {t('attendance.category')}
              </label>
              <select
                id="qr-category"
                value={category}
                onChange={(e) => setCategory((e.target.value || '') as RecordCategory | '')}
                required
                disabled={filtersDisabled}
                className="w-full h-9 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">{t('filters.category') ?? 'Choose category'}</option>
                {RECORD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(CATEGORY_LABELS[cat])}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sessionError && (
            <div className="px-3 py-2 rounded-lg bg-red-50 text-red-800 text-sm">{sessionError}</div>
          )}

          {!attendanceSessionId && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs text-text-secondary">
                {eligibleLoading ? 'Loading eligible students...' : `${eligibleStudents.length} eligible members`}
              </div>
              {existingSessionForDate ? (
                <button
                  type="button"
                  onClick={() => useExistingSession(existingSessionForDate.id, existingSessionForDate.records)}
                  disabled={!departmentId || !programId || !category || eligibleStudents.length === 0}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  Use existing session
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateSession}
                  disabled={isBatchCreating || isSessionCreating || !departmentId || !programId || !category || eligibleStudents.length === 0}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  {isSessionCreating ? 'Creating session...' : 'Create session'}
                </button>
              )}
            </div>
          )}

          {attendanceSessionId && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-xs text-text-secondary">Mark scanned QR as</span>
                  <div className="flex gap-2">
                    {(['PRESENT', 'LATE', 'EXCUSED'] as AttendanceRecordStatus[]).filter(isScanTargetStatus).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setScanStatus(status)}
                        disabled={printMode}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-link/30 ${
                          scanStatus === status
                            ? 'bg-accent text-text-light border-accent'
                            : 'border-border/40 text-text-primary hover:border-link/40 hover:bg-link/5'
                        }`}
                      >
                        {status === 'PRESENT' ? 'Present' : status === 'LATE' ? 'Late' : 'Excused'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-bg-beige-light text-text-secondary">
                    Present {counts.present}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-link/5 text-link">
                    Late {counts.late}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent">
                    Excused {counts.excused}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-bg-beige-light text-text-secondary">
                    Missing {counts.missing}
                  </span>
                </div>
              </div>

              {scanFeedback && <div className="px-3 py-2 rounded-lg bg-bg-beige-light text-text-secondary text-sm">{scanFeedback}</div>}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div className="bg-card rounded-lg border border-border/30 p-3">
                  {printMode ? (
                    <div className="min-h-[320px] flex flex-col items-center justify-center text-center p-4">
                      <div className="text-sm font-medium text-text-primary">Print mode</div>
                      <div className="text-xs text-text-secondary mt-1.5">Use browser print to print the QR cards</div>
                      <div className="text-xs text-text-secondary mt-2">{counts.total} members</div>
                    </div>
                  ) : isScanning ? (
                    <QrScanner onScanSuccess={handleDecodeScan} />
                  ) : (
                    <div className="min-h-[320px] flex flex-col items-center justify-center text-center p-4">
                      <div className="text-sm font-medium text-text-primary">Scanner is off</div>
                      <div className="text-xs text-text-secondary mt-1.5">
                        {scanStatus === 'PRESENT' ? 'Marking as Present' : scanStatus === 'LATE' ? 'Marking as Late' : 'Marking as Excused'}
                      </div>
                      <div className="w-full max-w-sm mt-4 text-left">
                        <CameraPermission
                          onGranted={() => {
                            setScanFeedback(null);
                          }}
                        />
                      </div>
                      {counts.missing === 0 && <div className="text-xs text-accent mt-2">All members scanned</div>}
                    </div>
                  )}
                </div>

                <div className="bg-card rounded-lg border border-border/30 p-3">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="text-xs font-semibold text-text-secondary">QR Codes</div>
                    {printMode && <div className="text-xs text-text-secondary">Print mode</div>}
                  </div>
                  <QrMemberGrid
                    students={eligibleStudents}
                    statusByStudentId={statusByStudentId}
                    printMode={printMode}
                    ageLabel={t('attendance.ageLabel')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

