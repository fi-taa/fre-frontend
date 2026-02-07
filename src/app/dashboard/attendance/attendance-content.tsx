'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { PageLoader } from '@/components/ui/page-loader';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

const AttendanceForm = dynamic(
  () => import('@/components/dashboard/attendance-form').then((m) => ({ default: m.AttendanceForm })),
  { loading: () => <PageLoader minHeight={false} className="py-8" />, ssr: false }
);

const AttendanceList = dynamic(
  () => import('@/components/dashboard/attendance-list').then((m) => ({ default: m.AttendanceList })),
  { loading: () => <PageLoader minHeight={false} className="py-8" />, ssr: false }
);

type Tab = 'take' | 'view';

export function AttendanceContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState<Tab>('take');
  const recordIdParam = searchParams.get('recordId');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (recordIdParam) {
      setActiveTab('view');
    }
  }, [mounted, isAuthenticated, router, recordIdParam]);

  function handleSuccess() {
    setActiveTab('view');
  }

  function handleLogout() {
    dispatch(clearAuth());
    router.push('/login');
  }

  function handleNotifications() {
    console.log('Notifications clicked');
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

  if (!isAuthenticated) {
    return null;
  }

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
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <Link
            href={recordIdParam ? `/dashboard/records/${recordIdParam}` : '/dashboard'}
            className="flex min-h-[44px] items-center gap-2 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {recordIdParam ? 'Back to Record' : 'Back to Dashboard'}
          </Link>
          <div className="bg-card rounded-lg border border-border/30">
            <div className="flex border-b border-border/30">
              <button
                onClick={() => setActiveTab('take')}
                className={`px-3 py-2 text-xs font-medium transition-colors duration-200 ${
                  activeTab === 'take'
                    ? 'bg-accent text-text-light border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-beige-light'
                }`}
              >
                Take Attendance
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`px-3 py-2 text-xs font-medium transition-colors duration-200 ${
                  activeTab === 'view'
                    ? 'bg-accent text-text-light border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-beige-light'
                }`}
              >
                View Records
              </button>
            </div>
            <div className="p-4">
              {activeTab === 'take' && (
                <AttendanceForm onSuccess={handleSuccess} initialRecordId={recordIdParam || undefined} />
              )}
              {activeTab === 'view' && <AttendanceList recordId={recordIdParam || undefined} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
