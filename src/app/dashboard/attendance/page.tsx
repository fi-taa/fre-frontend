import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/page-loader';
import { AttendanceContent } from './attendance-content';

export default function AttendancePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg-beige">
        <PageLoader />
      </div>
    }>
      <AttendanceContent />
    </Suspense>
  );
}
