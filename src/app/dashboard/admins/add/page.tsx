'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { AddUserForm } from '@/components/dashboard/add-user-form';
import { PageLoader } from '@/components/ui/page-loader';
import { useGetCurrentUserQuery, useCreateAdminMutation } from '@/store/slices/usersApi';

export default function AddAdminPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUserData } = useGetCurrentUserQuery();
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const currentUser = currentUserData?.data;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (currentUser && currentUser.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }
  }, [mounted, isAuthenticated, currentUser, router]);

  function handleLogout() {
    dispatch(clearAuth());
    router.push('/login');
  }

  function handleNotifications() {
    // Notifications not implemented yet
  }

  async function handleSubmit(data: { email: string; full_name: string; password: string; department_id: number }) {
    await createAdmin({
      body: {
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        role: 'admin',
        department_ids: [data.department_id],
      },
      department_id: data.department_id,
    }).unwrap();
    router.push('/dashboard/admins');
  }

  function handleCancel() {
    router.push('/dashboard/admins');
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

  if (!isAuthenticated || (currentUser && currentUser.role !== 'super_admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-beige flex flex-col relative">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
      <div className="relative z-10">
        <DashboardHeader onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-lg mx-auto p-6 space-y-6">
          <Link
            href="/dashboard/admins"
            className="flex min-h-[44px] items-center gap-2 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Admins
          </Link>

          <h1 className="text-xl font-bold text-text-primary">Add Admin</h1>

          <AddUserForm userType="admin" onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
