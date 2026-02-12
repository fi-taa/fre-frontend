'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { useCreateDepartmentMutation } from '@/store/slices/departmentsApi';

export default function AddDepartmentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  function handleLogout() {
    dispatch(clearAuth());
    router.push('/login');
  }

  function handleNotifications() {
    // Notifications not implemented yet
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required.');
      return;
    }
    try {
      await createDepartment({ name: trimmedName, description: description.trim() || undefined }).unwrap();
      router.push('/dashboard/departments');
    } catch (err: unknown) {
      const data = err && typeof err === 'object' && 'data' in err ? (err as { data?: { detail?: unknown } }).data : undefined;
      const detail = data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join('. ') || 'Failed to create department'
        : typeof detail === 'string'
          ? detail
          : 'Failed to create department';
      setError(message);
    }
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
        <DashboardHeader onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-lg mx-auto p-6 space-y-6">
          <Link href="/dashboard/departments" className="flex min-h-[44px] items-center gap-2 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Departments
          </Link>

          <h1 className="text-xl font-bold text-text-primary">Add department</h1>

          <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border/30 p-6 space-y-4">
            <div>
              <label htmlFor="dept-name" className="block text-sm font-medium mb-1.5 text-text-primary">
                Name <span className="text-error">*</span>
              </label>
              <input
                id="dept-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
                placeholder="Department name"
              />
            </div>
            <div>
              <label htmlFor="dept-desc" className="block text-sm font-medium mb-1.5 text-text-primary">
                Description
              </label>
              <textarea
                id="dept-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
                placeholder="Optional description"
              />
            </div>
            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {isLoading ? 'Saving...' : 'Create'}
              </button>
              <Link href="/dashboard/departments" className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:bg-bg-beige-light text-text-primary inline-block">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
