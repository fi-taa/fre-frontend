'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth';
import { getRecords, deleteRecord } from '@/lib/storage';
import { RecordDetails } from '@/components/dashboard/record-details';
import { AttendanceHistory } from '@/components/dashboard/attendance-history';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import type { Record } from '@/types';

export default function RecordDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;
  const [record, setRecord] = useState<Record | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const records = getRecords();
    const foundRecord = records.find((r) => r.id === recordId);
    if (!foundRecord) {
      router.push('/dashboard');
      return;
    }
    setRecord(foundRecord);
    setIsLoading(false);
  }, [recordId, router]);

  function handleBack() {
    router.push('/dashboard');
  }

  function handleEdit() {
    router.push(`/dashboard/records/${recordId}/edit`);
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteRecord(recordId);
      router.push('/dashboard');
    }
  }

  function handleProfile() {
    router.push('/dashboard/profile');
  }

  function handleSettings() {
    console.log('Settings clicked');
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function handleAddRecord() {
    router.push('/dashboard/add');
  }

  function handleAttendance() {
    router.push('/dashboard/attendance');
  }

  function handleTakeAttendance() {
    router.push(`/dashboard/attendance?recordId=${recordId}`);
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

  if (!record) {
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
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <button
            onClick={handleBack}
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
            Back to Dashboard
          </button>
          <RecordDetails record={record} onEdit={handleEdit} onDelete={handleDelete} />
          <AttendanceHistory recordId={recordId} onTakeAttendance={handleTakeAttendance} />
        </div>
      </div>
    </div>
  );
}
