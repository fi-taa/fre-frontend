export interface AttendanceQrPayload {
  sessionId: number;
  studentId: number;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function encodeAttendanceQrPayload(sessionId: number, studentId: number): string {
  if (!isNonNegativeInteger(sessionId) || !isNonNegativeInteger(studentId)) return '';
  return `attendance:v1:${sessionId}:${studentId}`;
}

export function decodeAttendanceQrPayload(payload: string): AttendanceQrPayload | null {
  const trimmed = payload.trim();
  const match = /^attendance:v1:(\d+):(\d+)$/.exec(trimmed);
  if (!match) return null;

  const sessionId = Number(match[1]);
  const studentId = Number(match[2]);
  if (!isNonNegativeInteger(sessionId) || !isNonNegativeInteger(studentId)) return null;

  return { sessionId, studentId };
}

function decodeStudentIdOnlyFromQr(decodedText: string): number | null {
  const trimmed = decodedText.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);

  const match = /^(student|member):v\d+:(\d+)$/.exec(trimmed);
  if (!match) return null;

  const studentId = Number(match[2]);
  if (!isNonNegativeInteger(studentId)) return null;
  return studentId;
}

export function decodeStudentIdFromQr(decodedText: string): number | null {
  const parsedFull = decodeAttendanceQrPayload(decodedText);
  if (parsedFull) return parsedFull.studentId;
  return decodeStudentIdOnlyFromQr(decodedText);
}

