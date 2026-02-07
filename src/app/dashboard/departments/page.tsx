'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import {
  useListDepartmentsQuery,
  useDeleteDepartmentMutation,
} from '@/store/slices/departmentsApi';
import type { Department } from '@/types';

export default function DepartmentsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: departments = [], isLoading } = useListDepartmentsQuery();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  function handleProfile() {
    router.push('/dashboard/profile');
  }

  function handleSettings() {
    console.log('Settings clicked');
  }

  function handleLogout() {
    dispatch(clearAuth());
    router.push('/login');
  }

  function handleAddRecord() {
    router.push('/dashboard/add');
  }

  function handleAttendance() {
    router.push('/dashboard/attendance');
  }

  function handleDepartments() {
    router.push('/dashboard/departments');
  }

  function handleNotifications() {
    console.log('Notifications clicked');
  }

  async function handleDelete(dept: Department) {
    if (!confirm(`Delete "${dept.name}"? This cannot be undone.`)) return;
    try {
      await deleteDepartment(dept.id).unwrap();
    } catch {
      // Error handled by mutation
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-beige">
        <div className="text-text-primary">Loading...</div>
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
          onProfile={handleProfile}
          onSettings={handleSettings}
          onLogout={handleLogout}
          onAddRecord={handleAddRecord}
          onAttendance={handleAttendance}
          onDepartments={handleDepartments}
          onNotifications={handleNotifications}
          notificationCount={0}
        />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <button
            onClick={() => router.push('/dashboard')}
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

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-xl font-bold text-text-primary">Departments</h1>
            <button
              onClick={() => router.push('/dashboard/departments/add')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              Add department
            </button>
          </div>

          <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-text-secondary">Loading...</div>
            ) : departments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-secondary mb-4">No departments yet.</p>
                <button
                  onClick={() => router.push('/dashboard/departments/add')}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90"
                >
                  Add department
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-table-header border-b border-border/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary hidden sm:table-cell">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary w-28">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr
                        key={dept.id}
                        className="border-b border-border/30 hover:bg-bg-beige-light transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-text-primary">
                          {dept.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell max-w-xs truncate">
                          {dept.description ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => router.push(`/dashboard/departments/${dept.id}/edit`)}
                            className="px-2 py-1 text-xs font-medium rounded-lg border border-border/40 hover:bg-link/5 text-text-primary mr-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(dept)}
                            className="px-2 py-1 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-50 text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
