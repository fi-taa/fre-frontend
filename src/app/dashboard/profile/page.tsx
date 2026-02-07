'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { PageLoader } from '@/components/ui/page-loader';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProfileView } from '@/components/dashboard/profile-view';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  function handleLogout() {
    dispatch(clearAuth());
    router.push('/login');
  }

  function handleSettings() {
    console.log('Settings clicked');
  }

  function handleNotifications() {
    console.log('Notifications clicked');
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-beige flex flex-col relative">
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
        <div className="relative z-10">
          <DashboardHeader onSettings={handleSettings} onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
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
          onSettings={handleSettings}
          onLogout={handleLogout}
          onNotifications={handleNotifications}
          notificationCount={0}
        />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-2xl mx-auto p-6">
          <ProfileView user={{ id: 0, email: '', full_name: 'User', role: 'staff', is_active: true, department_ids: [] }} />
        </div>
      </div>
    </div>
  );
}
