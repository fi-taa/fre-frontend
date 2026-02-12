'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { PageLoader } from '@/components/ui/page-loader';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProfileView } from '@/components/dashboard/profile-view';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUserData, isLoading: isLoadingUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

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

  if (!isAuthenticated) {
    return null;
  }

  const currentUser = currentUserData?.data;

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
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <Link
            href="/dashboard"
            className="flex min-h-[44px] items-center gap-2 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Dashboard
          </Link>

          {isLoadingUser ? (
            <div className="flex items-center justify-center min-h-[320px]">
              <PageLoader />
            </div>
          ) : currentUser ? (
            <ProfileView user={currentUser} />
          ) : (
            <div className="bg-card rounded-lg border border-border/30 p-8 text-center">
              <p className="text-text-secondary">Unable to load profile information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
