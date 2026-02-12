'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PageLoader } from '@/components/ui/page-loader';
import { StatisticsViewToggle } from '@/components/dashboard/statistics-view-toggle';
import { BarChart } from '@/components/dashboard/charts/bar-chart';
import { HorizontalBarChart } from '@/components/dashboard/charts/horizontal-bar-chart';
import { DonutChart } from '@/components/dashboard/charts/donut-chart';
import { useGetCurrentUserQuery, useListUsersQuery } from '@/store/slices/usersApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import type { User } from '@/types';

export default function AnalyticsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'table' | 'graph'>('graph');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUserData } = useGetCurrentUserQuery();
  const { data: usersData, isLoading: usersLoading } = useListUsersQuery();
  const { data: departments = [] } = useListDepartmentsQuery();

  const currentUser = currentUserData?.data;
  const allUsers = usersData?.data || [];

  const analytics = useMemo(() => {
    const admins = allUsers.filter((user) => user.role === 'admin');
    const managers = allUsers.filter((user) => user.role === 'manager');

    const activeAdmins = admins.filter((u) => u.is_active).length;
    const inactiveAdmins = admins.length - activeAdmins;
    const activeManagers = managers.filter((u) => u.is_active).length;
    const inactiveManagers = managers.length - activeManagers;

    const adminDepartmentCounts: Record<number, number> = {};
    const managerDepartmentCounts: Record<number, number> = {};

    admins.forEach((admin) => {
      admin.department_ids.forEach((deptId) => {
        adminDepartmentCounts[deptId] = (adminDepartmentCounts[deptId] || 0) + 1;
      });
    });

    managers.forEach((manager) => {
      manager.department_ids.forEach((deptId) => {
        managerDepartmentCounts[deptId] = (managerDepartmentCounts[deptId] || 0) + 1;
      });
    });

    return {
      totalAdmins: admins.length,
      totalManagers: managers.length,
      activeAdmins,
      inactiveAdmins,
      activeManagers,
      inactiveManagers,
      adminDepartmentCounts,
      managerDepartmentCounts,
      admins,
      managers,
    };
  }, [allUsers]);

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
        <main id="main-content" className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[320px]">
              <PageLoader />
            </div>
          ) : (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">User Analytics</h1>
                  <p className="text-sm text-text-secondary mt-0.5">Analytics for admins and managers</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatisticsViewToggle view={view} onViewChange={setView} />
                  <Link
                    href="/dashboard"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-border/50 text-text-primary bg-card hover:bg-bg-beige-light hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-link/30"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-card rounded-2xl border border-border/20 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Total Admins</p>
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{analytics.totalAdmins}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {analytics.activeAdmins} active, {analytics.inactiveAdmins} inactive
                  </p>
                </div>
                <div className="bg-card rounded-2xl border border-border/20 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Total Managers</p>
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{analytics.totalManagers}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {analytics.activeManagers} active, {analytics.inactiveManagers} inactive
                  </p>
                </div>
                <div className="bg-card rounded-2xl border border-border/20 p-5 shadow-sm col-span-2 lg:col-span-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Active Users</p>
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-accent tabular-nums">
                    {analytics.activeAdmins + analytics.activeManagers}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {analytics.totalAdmins + analytics.totalManagers} total users
                  </p>
                </div>
                <div className="bg-card rounded-2xl border border-border/20 p-5 shadow-sm col-span-2 lg:col-span-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Inactive Users</p>
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-secondary tabular-nums">
                    {analytics.inactiveAdmins + analytics.inactiveManagers}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {analytics.totalAdmins + analytics.totalManagers > 0
                      ? Math.round(
                          ((analytics.inactiveAdmins + analytics.inactiveManagers) /
                            (analytics.totalAdmins + analytics.totalManagers)) *
                            100
                        )
                      : 0}
                    % of total
                  </p>
                </div>
              </div>

              {view === 'table' ? (
                <div className="space-y-6">
                  <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/20">
                      <h2 className="text-sm font-semibold text-text-primary">Admins by Department</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-table-header border-b border-border/50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                              Department
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                              Admin Count
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {departments.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="px-5 py-8 text-center text-text-secondary text-sm">
                                No departments found
                              </td>
                            </tr>
                          ) : (
                            departments.map((dept) => (
                              <tr key={dept.id} className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                                <td className="px-5 py-3 text-sm font-medium text-text-primary">{dept.name}</td>
                                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">
                                  {analytics.adminDepartmentCounts[dept.id] || 0}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/20">
                      <h2 className="text-sm font-semibold text-text-primary">Managers by Department</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-table-header border-b border-border/50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                              Department
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                              Manager Count
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {departments.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="px-5 py-8 text-center text-text-secondary text-sm">
                                No departments found
                              </td>
                            </tr>
                          ) : (
                            departments.map((dept) => (
                              <tr key={dept.id} className="border-b border-border/30 hover:bg-bg-beige-light/50 transition-colors">
                                <td className="px-5 py-3 text-sm font-medium text-text-primary">{dept.name}</td>
                                <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">
                                  {analytics.managerDepartmentCounts[dept.id] || 0}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-6">Admins Status</h3>
                    <DonutChart
                      data={[
                        { label: 'Active', value: analytics.activeAdmins, color: '#10b981' },
                        { label: 'Inactive', value: analytics.inactiveAdmins, color: '#6b7280' },
                      ]}
                      size={160}
                      strokeWidth={16}
                    />
                  </div>

                  <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-6">Managers Status</h3>
                    <DonutChart
                      data={[
                        { label: 'Active', value: analytics.activeManagers, color: '#10b981' },
                        { label: 'Inactive', value: analytics.inactiveManagers, color: '#6b7280' },
                      ]}
                      size={160}
                      strokeWidth={16}
                    />
                  </div>

                  <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-6">Admins by Department</h3>
                    {departments.length === 0 ? (
                      <p className="text-text-secondary text-sm text-center py-8">No departments found</p>
                    ) : (
                      <BarChart
                        data={departments.map((dept) => ({
                          label: dept.name,
                          value: analytics.adminDepartmentCounts[dept.id] || 0,
                        }))}
                        height={240}
                      />
                    )}
                  </div>

                  <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden p-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-6">Managers by Department</h3>
                    {departments.length === 0 ? (
                      <p className="text-text-secondary text-sm text-center py-8">No departments found</p>
                    ) : (
                      <BarChart
                        data={departments.map((dept) => ({
                          label: dept.name,
                          value: analytics.managerDepartmentCounts[dept.id] || 0,
                        }))}
                        height={240}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
