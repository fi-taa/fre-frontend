'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useListStudentsQuery } from '@/store/slices/studentsApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { useGetCurrentUserQuery, useListUsersQuery, useListManagersQuery } from '@/store/slices/usersApi';
import { useListAttendanceSessionsQuery } from '@/store/slices/attendanceApi';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PageLoader } from '@/components/ui/page-loader';
import { StatisticsViewToggle } from '@/components/dashboard/statistics-view-toggle';
import { StatisticsTableView } from '@/components/dashboard/statistics-table-view';
import { StatisticsGraphView } from '@/components/dashboard/statistics-graph-view';
import { BarChart } from '@/components/dashboard/charts/bar-chart';
import { handleLogout as logoutAndResetCache } from '@/lib/auth-helpers';
import { apiCategoryToSlug, CATEGORY_LABELS } from '@/types';
import { useI18n } from '@/i18n/I18nProvider';
import type { RootState } from '@/store/store';
import type { AttendanceSessionListParams, RecordCategory } from '@/types';

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
  const [departmentScopeId, setDepartmentScopeId] = useState<string>('all');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data: students = [], isLoading: studentsLoading } = useListStudentsQuery();
  const { data: departments = [], isLoading: departmentsLoading } = useListDepartmentsQuery();
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const canShowAttendanceAnalytics = isSuperAdmin || isAdmin;
  const adminDepartmentIds = currentUser?.department_ids || [];
  const managerDepartmentIds = isManager ? currentUser?.department_ids || [] : [];

  const { data: allUsersData, isLoading: allUsersLoading } = useListUsersQuery(undefined, {
    skip: !currentUser || !isSuperAdmin,
  });
  const { data: managersData, isLoading: managersLoading } = useListManagersQuery(undefined, {
    skip: !currentUser || isSuperAdmin,
  });

  const allUsers = isSuperAdmin ? (allUsersData?.data || []) : (managersData?.data || []);

  const scopedDepartments = useMemo(() => {
    if (isSuperAdmin) return departments;
    if (isAdmin && adminDepartmentIds.length > 0) return departments.filter((d) => adminDepartmentIds.includes(d.id));
    if (isManager && managerDepartmentIds.length > 0) return departments.filter((d) => managerDepartmentIds.includes(d.id));
    return [];
  }, [departments, isSuperAdmin, isAdmin, isManager, adminDepartmentIds, managerDepartmentIds]);

  const departmentScopeIdNum = departmentScopeId !== 'all' ? parseInt(departmentScopeId, 10) : 0;
  const scopedDepartmentName = useMemo(() => {
    if (departmentScopeId === 'all' || departmentScopeIdNum <= 0) return null;
    return scopedDepartments.find((d) => d.id === departmentScopeIdNum)?.name ?? null;
  }, [departmentScopeId, departmentScopeIdNum, scopedDepartments]);

  const attendanceListParams = useMemo(() => {
    const params: AttendanceSessionListParams = { include_inactive: false };
    if (departmentScopeIdNum > 0) params.department_id = departmentScopeIdNum;
    return params;
  }, [departmentScopeIdNum]);

  const {
    data: attendanceSessions = [],
    isLoading: attendanceSessionsLoading,
  } = useListAttendanceSessionsQuery(attendanceListParams, {
    skip: !canShowAttendanceAnalytics,
  });

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayAttendance = useMemo(() => {
    const sessionsToday = attendanceSessions.filter((s) => s.date === todayIso);
    let present = 0;
    let absent = 0;
    let excused = 0;

    for (const session of sessionsToday) {
      for (const rec of session.records) {
        const status = String(rec.status);
        if (status === 'PRESENT') present += 1;
        else if (status === 'EXCUSED') excused += 1;
        else absent += 1;
      }
    }

    const total = present + absent + excused;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      sessionsTodayCount: sessionsToday.length,
      totalRecords: total,
      present,
      absent,
      excused,
      rate,
    };
  }, [attendanceSessions, todayIso]);

  const last7DaysAttendanceRateData = useMemo(() => {
    if (!canShowAttendanceAnalytics) return [];

    const days = 7;
    const out: Array<{ label: string; value: number; color?: string }> = [];
    const byDate = new Map<string, { present: number; total: number }>();

    for (const session of attendanceSessions) {
      const d = session.date;
      if (!d) continue;
      for (const rec of session.records) {
        const status = String(rec.status);
        const agg = byDate.get(d) ?? { present: 0, total: 0 };
        agg.total += 1;
        if (status === 'PRESENT') agg.present += 1;
        byDate.set(d, agg);
      }
    }

    for (let i = days - 1; i >= 0; i -= 1) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - i);
      const iso = dateObj.toISOString().split('T')[0];
      const agg = byDate.get(iso);
      const rate = agg && agg.total > 0 ? Math.round((agg.present / agg.total) * 100) : 0;
      const label = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      out.push({ label, value: rate, color: '#1A73E8' });
    }

    return out;
  }, [attendanceSessions, canShowAttendanceAnalytics]);

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

    if (departmentScopeId !== 'all' && departmentScopeIdNum > 0) {
      filteredStudents = filteredStudents.filter((s) => s.department_id === departmentScopeIdNum);
      filteredDepartments = filteredDepartments.filter((d) => d.id === departmentScopeIdNum);
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
  }, [students, departments, allUsers, isSuperAdmin, isAdmin, isManager, adminDepartmentIds, managerDepartmentIds, departmentScopeId, departmentScopeIdNum]);

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
                  {scopedDepartments.length > 1 && (
                    <div className="min-w-[220px]">
                      <label htmlFor="dash-scope" className="sr-only">
                        Department scope
                      </label>
                      <select
                        id="dash-scope"
                        value={departmentScopeId}
                        onChange={(e) => setDepartmentScopeId(e.target.value)}
                        className="w-full min-h-[44px] px-4 rounded-xl border border-border/50 bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                      >
                        <option value="all">All departments</option>
                        {scopedDepartments.map((d) => (
                          <option key={d.id} value={String(d.id)}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <Link
                    href="/dashboard/records"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-border/50 text-text-primary bg-card hover:bg-bg-beige-light hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-link/30"
                  >
                    {t('dashboard.viewRecords')}
                  </Link>
                  <Link
                    href="/dashboard/attendance"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-border/50 text-text-primary bg-card hover:bg-bg-beige-light hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-link/30"
                  >
                    Take Attendance
                  </Link>
                  <Link
                    href="/dashboard/add"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl bg-accent text-text-light hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-beige shadow-sm"
                  >
                    {t('dashboard.addRecord')}
                  </Link>
                </div>
              </div>

              {stats.students === 0 && (
                <div className="bg-card rounded-2xl border border-border/20 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary">No records yet</div>
                      <div className="text-sm text-text-secondary mt-1">Add your first member to start tracking attendance and statistics.</div>
                    </div>
                    <Link
                      href="/dashboard/add"
                      className="inline-flex min-h-[44px] items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-accent text-text-light hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-beige shadow-sm"
                    >
                      Add first record
                    </Link>
                  </div>
                </div>
              )}

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
                    {scopedDepartmentName ? (
                      <div className="mt-1">
                        <p className="text-[18px] sm:text-[20px] font-bold leading-[1.2] text-text-primary truncate">
                          {scopedDepartmentName}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">1 department</p>
                      </div>
                    ) : (
                      <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{stats.departments}</p>
                    )}
                  </div>
                </Link>
                {canShowAttendanceAnalytics && (
                  <>
                    <Link
                      href="/dashboard/attendance"
                      className="group relative bg-card rounded-2xl border border-border/20 p-5 shadow-sm hover:shadow-md hover:border-border/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-bg-beige overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-link/5 group-hover:bg-link/10 transition-colors" />
                      <div className="relative">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Attendance today</p>
                        <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
                          {attendanceSessionsLoading ? '—' : `${todayAttendance.rate}%`}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                          {attendanceSessionsLoading ? '' : `${todayAttendance.present} present • ${todayAttendance.excused} excused • ${todayAttendance.absent} absent`}
                        </p>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/attendance"
                      className="group relative bg-card rounded-2xl border border-border/20 p-5 shadow-sm hover:shadow-md hover:border-border/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-bg-beige overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-link/5 group-hover:bg-link/10 transition-colors" />
                      <div className="relative">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Sessions today</p>
                        <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
                          {attendanceSessionsLoading ? '—' : todayAttendance.sessionsTodayCount}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                          {attendanceSessionsLoading ? '' : `${todayAttendance.totalRecords} records`}
                        </p>
                      </div>
                    </Link>
                  </>
                )}
              </div>

              {canShowAttendanceAnalytics && (
                <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/20 flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-text-primary">Attendance (last 7 days)</h2>
                      <p className="text-xs text-text-secondary mt-1">Present rate %</p>
                    </div>
                    <Link
                      href="/dashboard/attendance"
                      className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-border/50 text-text-primary bg-card hover:bg-bg-beige-light hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-link/30"
                    >
                      View attendance
                    </Link>
                  </div>
                  <div className="p-4">
                    <BarChart data={last7DaysAttendanceRateData} height={220} showValues={true} showGrid={true} />
                    {attendanceSessionsLoading && (
                      <div className="text-xs text-text-secondary mt-3">Loading attendance…</div>
                    )}
                  </div>
                </div>
              )}

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
