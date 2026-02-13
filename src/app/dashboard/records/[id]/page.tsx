'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { handleLogout } from '@/lib/auth-helpers';
import { clearAuth } from '@/store/slices/authSlice';
import { useGetStudentQuery, useDeleteStudentMutation } from '@/store/slices/studentsApi';
import { studentToRecordView } from '@/lib/data-utils';
import { PageLoader } from '@/components/ui/page-loader';
import { RecordDetails } from '@/components/dashboard/record-details';
import { AttendanceHistory } from '@/components/dashboard/attendance-history';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import type { RootState } from '@/store/store';

export default function RecordDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const recordIdParam = params.id as string;
  const recordId = parseInt(recordIdParam, 10);
  const isValidId = Boolean(recordIdParam && !isNaN(recordId));
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: student, isLoading, isError } = useGetStudentQuery(recordId, { skip: !isValidId });
  const [deleteStudent] = useDeleteStudentMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isValidId || isError) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isValidId, isError, router]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteStudent(recordId).unwrap();
      router.push('/dashboard');
    } catch {
      // Error handled by mutation
    }
  }

  function handleLogout() {
    dispatch(clearAuth());
    router.push('/login');
  }

  function handleNotifications() {
    // Notifications not implemented yet
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-beige flex flex-col relative">
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
        <div className="relative z-10">
          <DashboardHeader onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
        </div>
        <div className="flex-1 flex items-center justify-center relative z-10">
          <PageLoader />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isValidId) {
    return null;
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-bg-beige flex flex-col relative">
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
        <div className="relative z-10">
          <DashboardHeader onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
        </div>
        <div className="flex-1 flex items-center justify-center relative z-10">
          <PageLoader />
        </div>
      </div>
    );
  }

  const record = studentToRecordView(student);

  return (
    <div className="min-h-screen bg-bg-beige flex flex-col relative">
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10">
        <DashboardHeader
          onLogout={handleLogout}
          onNotifications={handleNotifications}
          notificationCount={0}
        />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          <Link href="/dashboard" className="flex min-h-[44px] items-center gap-1.5 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </Link>
          <RecordDetails record={record} editHref={`/dashboard/records/${recordIdParam}/edit`} onDelete={handleDelete} />
          <AttendanceHistory recordId={recordIdParam} attendanceHref={`/dashboard/attendance?recordId=${recordIdParam}`} />
        </div>
      </div>
    </div>
  );
}
