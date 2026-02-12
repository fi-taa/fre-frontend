'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UsersTable } from '@/components/dashboard/users-table';
import { PageLoader } from '@/components/ui/page-loader';
import { useGetCurrentUserQuery, useListUsersQuery, useDeleteAdminMutation } from '@/store/slices/usersApi';
import type { User } from '@/types';

export default function AdminsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUserData } = useGetCurrentUserQuery();
  const { data: usersData, isLoading: usersLoading } = useListUsersQuery();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = currentUserData?.data;
  const allUsers = usersData?.data || [];

  const admins = useMemo(() => {
    return allUsers.filter((user) => user.role === 'admin');
  }, [allUsers]);

  const filteredAdmins = useMemo(() => {
    if (!searchTerm.trim()) return admins;
    const term = searchTerm.toLowerCase();
    return admins.filter(
      (admin) =>
        admin.full_name.toLowerCase().includes(term) ||
        admin.email.toLowerCase().includes(term)
    );
  }, [admins, searchTerm]);

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

  async function handleDelete(adminId: number) {
    const admin = admins.find((a) => a.id === adminId);
    if (!admin) return;
    if (!confirm(`Delete admin "${admin.full_name}"? This cannot be undone.`)) return;
    try {
      await deleteAdmin(adminId).unwrap();
    } catch {
      // Error handled by mutation
    }
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

  const isLoading = usersLoading || !currentUser;

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
              <h1 className="text-xl font-bold text-text-primary">Admins</h1>
              <p className="text-sm text-text-secondary mt-0.5">Manage admin users</p>
            </div>
            <Link
              href="/dashboard/admins/add"
              className="inline-flex min-h-[44px] items-center px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              Add Admin
            </Link>
          </div>

          {filteredAdmins.length > 0 && (
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
            ) : (
              <UsersTable users={filteredAdmins} userType="admin" isLoading={isLoading} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
