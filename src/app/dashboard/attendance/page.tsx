'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { AttendanceForm } from '@/components/dashboard/attendance-form';
import { AttendanceList } from '@/components/dashboard/attendance-list';
import { EventManagement } from '@/components/dashboard/event-management';

type Tab = 'take' | 'view' | 'events';

export default function AttendancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ codeId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('take');
  const recordIdParam = searchParams.get('recordId');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    if (recordIdParam) {
      setActiveTab('view');
    }
    setIsLoading(false);
  }, [router, recordIdParam]);

  function handleSuccess() {
    setActiveTab('view');
  }

  function handleProfile() {
    router.push('/dashboard/profile');
  }

  function handleSettings() {
    console.log('Settings clicked');
  }

  function handleLogout() {
    router.push('/login');
  }

  function handleAddRecord() {
    router.push('/dashboard/add');
  }

  function handleAttendance() {
    router.push('/dashboard/attendance');
  }

  function handleNotifications() {
    console.log('Notifications clicked');
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-beige">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
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
          onProfile={handleProfile}
          onSettings={handleSettings}
          onLogout={handleLogout}
          onAddRecord={handleAddRecord}
          onAttendance={handleAttendance}
          onNotifications={handleNotifications}
          notificationCount={0}
        />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <button
            onClick={() => {
              if (recordIdParam) {
                router.push(`/dashboard/records/${recordIdParam}`);
              } else {
                router.push('/dashboard');
              }
            }}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {recordIdParam ? 'Back to Record' : 'Back to Dashboard'}
          </button>
          <div className="bg-card rounded-lg border border-border/30">
            <div className="flex border-b border-border/30">
              <button
                onClick={() => setActiveTab('take')}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'take'
                    ? 'bg-accent text-text-light border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-beige-light'
                }`}
              >
                Take Attendance
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'view'
                    ? 'bg-accent text-text-light border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-beige-light'
                }`}
              >
                View Records
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'events'
                    ? 'bg-accent text-text-light border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-beige-light'
                }`}
              >
                Manage Events
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'take' && (
                <AttendanceForm onSuccess={handleSuccess} initialRecordId={recordIdParam || undefined} />
              )}
              {activeTab === 'view' && <AttendanceList recordId={recordIdParam || undefined} />}
              {activeTab === 'events' && <EventManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
