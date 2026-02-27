'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useListStudentsQuery } from '@/store/slices/studentsApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { useGetCurrentUserQuery, useListUsersQuery, useListManagersQuery } from '@/store/slices/usersApi';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PageLoader } from '@/components/ui/page-loader';
import { StatisticsViewToggle } from '@/components/dashboard/statistics-view-toggle';
import { StatisticsTableView } from '@/components/dashboard/statistics-table-view';
import { StatisticsGraphView } from '@/components/dashboard/statistics-graph-view';
import { handleLogout as logoutAndResetCache } from '@/lib/auth-helpers';
import { apiCategoryToSlug, CATEGORY_LABELS } from '@/types';
import { useI18n } from '@/i18n/I18nProvider';
import type { RootState } from '@/store/store';
import type { RecordCategory } from '@/types';

const CATEGORY_COLORS: Record<RecordCategory, string> = {
  child: 'bg-amber-400',
  youth: 'bg-emerald-500',
  adolescent: 'bg-blue-500',
  adult: 'bg-violet-500',
};

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [statisticsView, setStatisticsView] = useState<'table' | 'graph'>('graph');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data: students = [], isLoading: studentsLoading } = useListStudentsQuery();
  const { data: departments = [], isLoading: departmentsLoading } = useListDepartmentsQuery();
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const adminDepartmentIds = currentUser?.department_ids || [];
  const managerDepartmentIds = isManager ? currentUser?.department_ids || [] : [];

  const { data: allUsersData, isLoading: allUsersLoading } = useListUsersQuery(undefined, {
    skip: !isSuperAdmin,
  });
  const { data: managersData, isLoading: managersLoading } = useListManagersQuery(undefined, {
    skip: isSuperAdmin,
  });

  const allUsers = isSuperAdmin ? (allUsersData?.data || []) : (managersData?.data || []);

  const stats = useMemo(() => {
    let filteredStudents = students;
    let filteredDepartments = departments;

    if (isAdmin && adminDepartmentIds.length > 0) {
      filteredStudents = students.filter((s) => adminDepartmentIds.includes(s.department_id));
      filteredDepartments = departments.filter((d) => adminDepartmentIds.includes(d.id));
    } else if (isManager && managerDepartmentIds.length > 0) {
      filteredStudents = students.filter((s) => managerDepartmentIds.includes(s.department_id));
      filteredDepartments = departments.filter((d) => managerDepartmentIds.includes(d.id));
    }

    const byCategory: Record<RecordCategory, number> = {
      child: 0,
      youth: 0,
      adolescent: 0,
      adult: 0,
    };
    for (const s of filteredStudents) {
      const slug = apiCategoryToSlug(s.category);
      byCategory[slug] = (byCategory[slug] ?? 0) + 1;
    }
    const totalStudents = filteredStudents.length;
    const maxCategory = Math.max(...Object.values(byCategory), 1);

    const admins = isSuperAdmin ? allUsers.filter((user) => user.role === 'admin') : [];
    const managers = isSuperAdmin || isAdmin ? allUsers.filter((user) => user.role === 'manager') : [];
    const activeAdmins = admins.filter((u) => u.is_active).length;
    const activeManagers = managers.filter((u) => u.is_active).length;

    return {
      students: totalStudents,
      departments: filteredDepartments.length,
      byCategory,
      maxCategory,
      totalAdmins: admins.length,
      totalManagers: managers.length,
      activeAdmins,
      activeManagers,
      inactiveAdmins: admins.length - activeAdmins,
      inactiveManagers: managers.length - activeManagers,
    };
  }, [students, departments, allUsers, isSuperAdmin, isAdmin, isManager, adminDepartmentIds, managerDepartmentIds]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  function onLogout() {
    logoutAndResetCache(dispatch);
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
          <DashboardHeader onLogout={onLogout} onNotifications={handleNotifications} notificationCount={0} />
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

  const loading = studentsLoading || departmentsLoading || (isSuperAdmin ? allUsersLoading : managersLoading);

  return (
    <div className="min-h-screen bg-bg-beige flex flex-col relative">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
      <div className="relative z-10">
        <DashboardHeader onLogout={onLogout} onNotifications={handleNotifications} notificationCount={0} />
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <main id="main-content" className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[320px]">
              <PageLoader />
            </div>
          ) : (
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                    {t('dashboard.overview')}
                  </h1>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {t('dashboard.overviewSubtitle')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatisticsViewToggle view={statisticsView} onViewChange={setStatisticsView} />
                  <Link
                    href="/dashboard/records"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-border/50 text-text-primary bg-card hover:bg-bg-beige-light hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-link/30"
                  >
                    {t('dashboard.viewRecords')}
                  </Link>
                  <Link
                    href="/dashboard/add"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl bg-accent text-text-light hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-beige shadow-sm"
                  >
                    {t('dashboard.addRecord')}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link
                  href="/dashboard/records"
                  className="group relative bg-card rounded-2xl border border-border/20 p-5 shadow-sm hover:shadow-md hover:border-border/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-bg-beige overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-link/5 group-hover:bg-link/10 transition-colors" />
                  <div className="relative">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                      {t('dashboard.card.students')}
                    </p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{stats.students}</p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/departments"
                  className="group relative bg-card rounded-2xl border border-border/20 p-5 shadow-sm hover:shadow-md hover:border-border/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-bg-beige overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-link/5 group-hover:bg-link/10 transition-colors" />
                  <div className="relative">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                      {t('dashboard.card.departments')}
                    </p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{stats.departments}</p>
                  </div>
                </Link>
                {/* Sessions and attendance summary removed from dashboard */}
              </div>

              {statisticsView === 'table' ? (
                <StatisticsTableView
                  byCategory={stats.byCategory}
                  totalStudents={stats.students}
                  totalDepartments={stats.departments}
                  totalAdmins={stats.totalAdmins}
                  totalManagers={stats.totalManagers}
                  activeAdmins={stats.activeAdmins}
                  activeManagers={stats.activeManagers}
                  inactiveAdmins={stats.inactiveAdmins}
                  inactiveManagers={stats.inactiveManagers}
                  isSuperAdmin={currentUser?.role === 'super_admin'}
                />
              ) : (
                <StatisticsGraphView
                  byCategory={stats.byCategory}
                  totalStudents={stats.students}
                  maxCategory={stats.maxCategory}
                  totalAdmins={stats.totalAdmins}
                  totalManagers={stats.totalManagers}
                  activeAdmins={stats.activeAdmins}
                  activeManagers={stats.activeManagers}
                  inactiveAdmins={stats.inactiveAdmins}
                  inactiveManagers={stats.inactiveManagers}
                  isSuperAdmin={currentUser?.role === 'super_admin'}
                />
              )}

              {/* Recent sessions table removed from dashboard */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
