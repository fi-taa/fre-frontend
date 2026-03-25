'use client';

import type { AttendanceRecordStatus, Student } from '@/types';
import { QrMemberCard } from './qr-member-card';

export interface QrMemberGridProps {
  students: Student[];
  statusByStudentId: Map<number, AttendanceRecordStatus>;
  printMode: boolean;
  ageLabel: string;
}

export function QrMemberGrid({ students, statusByStudentId, printMode, ageLabel }: QrMemberGridProps) {
  if (students.length === 0) return null;

  function getStudentQrValue(student: Student): string {
    const anyStudent = student as Student & { qr_code?: string | null; qr_payload?: string | null };
    return anyStudent.qr_code ?? anyStudent.qr_payload ?? '';
  }

  return (
    <div
      className={`${
        printMode ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      } gap-3 ${printMode ? '' : 'max-h-[560px] overflow-y-auto pr-1'}`}
    >
      {students.map((student) => {
        const status = statusByStudentId.get(student.id) ?? 'ABSENT';
        const qrValue = getStudentQrValue(student);
        const studentSubtitle = `${student.church ?? '—'} · ${ageLabel} ${student.age}`;

        return (
          <QrMemberCard
            key={student.id}
            qrValue={qrValue}
            studentName={student.name}
            studentSubtitle={studentSubtitle}
            status={status}
            printMode={printMode}
          />
        );
      })}
    </div>
  );
}

