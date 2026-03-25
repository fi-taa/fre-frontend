import { describe, expect, it } from 'vitest';
import { decodeAttendanceQrPayload, encodeAttendanceQrPayload } from './attendance-qr-payload';

describe('attendance qr payload', () => {
  it('encodes and decodes a valid payload', () => {
    const encoded = encodeAttendanceQrPayload(12, 34);
    expect(encoded).toBe('attendance:v1:12:34');
    expect(decodeAttendanceQrPayload(encoded)).toEqual({ sessionId: 12, studentId: 34 });
  });

  it('returns null for invalid payloads', () => {
    expect(decodeAttendanceQrPayload('')).toBeNull();
    expect(decodeAttendanceQrPayload('invalid')).toBeNull();
    expect(decodeAttendanceQrPayload('attendance:v1:abc:1')).toBeNull();
  });
});

