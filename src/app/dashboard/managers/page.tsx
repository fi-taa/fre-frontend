'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { handleLogout } from '@/lib/auth-helpers';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UsersTable } from '@/components/dashboard/users-table';
import { PageLoader } from '@/components/ui/page-loader';
import { useGetCurrentUserQuery, useListUsersQuery, useListManagersQuery } from '@/store/slices/usersApi';
import type { User } from '@/types';

export default function ManagersPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  
  const { data: allUsersData, isLoading: allUsersLoading, error: allUsersError } = useListUsersQuery(undefined, {
    skip: !isSuperAdmin,
  });
  const { data: managersData, isLoading: managersLoading, error: managersError } = useListManagersQuery(undefined, {
    skip: isSuperAdmin,
  });

  const allUsers = isSuperAdmin ? (allUsersData?.data || []) : (managersData?.data || []);

  const managers = useMemo(() => {
    const allManagers = allUsers.filter((user) => user.role === 'manager');
    if (isSuperAdmin) {
      return allManagers;
    }
    if (currentUser?.role === 'admin' && currentUser.department_ids.length > 0) {
      return allManagers.filter((manager) =>
        manager.department_ids.some((deptId) => currentUser.department_ids.includes(deptId))
      );
    }
    return [];
  }, [allUsers, currentUser, isSuperAdmin]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredManagers = useMemo(() => {
    if (!searchTerm.trim()) return managers;
    const term = searchTerm.toLowerCase();
    return managers.filter(
      (manager) =>
        manager.full_name.toLowerCase().includes(term) ||
        manager.email.toLowerCase().includes(term)
    );
  }, [managers, searchTerm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
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

  if (!isAuthenticated || (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return null;
  }

  const isLoading = (isSuperAdmin ? allUsersLoading : managersLoading) || !currentUser;
  const canAddManager = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  return (
    <div className="min-h-screen bg-bg-beige flex flex-col relative">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
      <div className="relative z-10">
        <DashboardHeader onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
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

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Managers</h1>
              <p className="text-sm text-text-secondary mt-0.5">Manage manager users</p>
            </div>
            {canAddManager && (
              <Link
                href="/dashboard/managers/add"
                className="inline-flex min-h-[44px] items-center px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                Add Manager
              </Link>
            )}
          </div>

          {filteredManagers.length > 0 && (
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6M9 9l6 6" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
            {isLoading ? (
              <PageLoader className="p-8" />
            ) : (isSuperAdmin ? allUsersError : managersError) ? (
              <div className="p-8 text-center">
                <p className="text-text-secondary mb-2">Unable to load managers.</p>
                <p className="text-sm text-text-muted">
                  {(isSuperAdmin ? allUsersError : managersError) && typeof (isSuperAdmin ? allUsersError : managersError) === 'object' && 'data' in (isSuperAdmin ? allUsersError : managersError)
                    ? String((isSuperAdmin ? allUsersError : managersError as { data?: { detail?: string } }).data?.detail || 'Access denied')
                    : 'Access denied'}
                </p>
              </div>
            ) : (
              <UsersTable users={filteredManagers} userType="manager" isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
