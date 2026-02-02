import { Suspense } from 'react';
import { AttendanceContent } from './attendance-content';

export default function AttendancePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg-beige">
        <div className="text-text-primary">Loading...</div>
      </div>
    }>
      <AttendanceContent />
    </Suspense>
  );
}
