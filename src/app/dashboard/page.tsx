'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useListStudentsQuery } from '@/store/slices/studentsApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { useListAttendanceSessionsQuery } from '@/store/slices/attendanceApi';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PageLoader } from '@/components/ui/page-loader';
import { clearAuth } from '@/store/slices/authSlice';
import { apiCategoryToSlug, CATEGORY_LABELS } from '@/types';
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
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data: students = [], isLoading: studentsLoading } = useListStudentsQuery();
  const { data: departments = [], isLoading: departmentsLoading } = useListDepartmentsQuery();
  const { data: sessions = [], isLoading: sessionsLoading } = useListAttendanceSessionsQuery();

  const stats = useMemo(() => {
    const byCategory: Record<RecordCategory, number> = {
      child: 0,
      youth: 0,
      adolescent: 0,
      adult: 0,
    };
    for (const s of students) {
      const slug = apiCategoryToSlug(s.category);
      byCategory[slug] = (byCategory[slug] ?? 0) + 1;
    }
    const totalPresent = sessions.reduce((sum, sess) => sum + sess.records.filter((r) => r.present).length, 0);
    const totalRecords = sessions.reduce((sum, sess) => sum + sess.records.length, 0);
    const attendanceByCategory: Record<RecordCategory, { present: number; total: number }> = {
      child: { present: 0, total: 0 },
      youth: { present: 0, total: 0 },
      adolescent: { present: 0, total: 0 },
      adult: { present: 0, total: 0 },
    };
    for (const sess of sessions) {
      const slug = apiCategoryToSlug(sess.category);
      const present = sess.records.filter((r) => r.present).length;
      attendanceByCategory[slug].present += present;
      attendanceByCategory[slug].total += sess.records.length;
    }
    const sessionsWithAttendance = sessions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((s) => {
        const present = s.records.filter((r) => r.present).length;
        const total = s.records.length;
        return {
          id: s.id,
          date: s.date,
          category: apiCategoryToSlug(s.category),
          type: s.type,
          present,
          total,
          rate: total ? Math.round((present / total) * 100) : 0,
        };
      });
    const totalStudents = students.length;
    const maxCategory = Math.max(...Object.values(byCategory), 1);
    return {
      students: totalStudents,
      departments: departments.length,
      sessions: sessions.length,
      byCategory,
      maxCategory,
      attendancePresent: totalPresent,
      attendanceTotal: totalRecords,
      overallRate: totalRecords ? Math.round((totalPresent / totalRecords) * 100) : 0,
      attendanceByCategory,
      sessionsWithAttendance,
    };
  }, [students, departments, sessions]);

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

  const loading = studentsLoading || departmentsLoading || sessionsLoading;

  return (
    <div className="min-h-screen bg-bg-beige flex flex-col relative">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
      <div className="relative z-10">
        <DashboardHeader onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
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
                  <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">Overview</h1>
                  <p className="text-sm text-text-secondary mt-0.5">Summary of records and attendance</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/dashboard/records"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-border/50 text-text-primary bg-card hover:bg-bg-beige-light hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-link/30"
                  >
                    View records
                  </Link>
                  <Link
                    href="/dashboard/add"
                    className="inline-flex min-h-[44px] items-center px-4 py-2.5 text-sm font-medium rounded-xl bg-accent text-text-light hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-bg-beige shadow-sm"
                  >
                    Add record
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
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Students</p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{stats.students}</p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/departments"
                  className="group relative bg-card rounded-2xl border border-border/20 p-5 shadow-sm hover:shadow-md hover:border-border/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-bg-beige overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-link/5 group-hover:bg-link/10 transition-colors" />
                  <div className="relative">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Departments</p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{stats.departments}</p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/attendance"
                  className="group relative bg-card rounded-2xl border border-border/20 p-5 shadow-sm hover:shadow-md hover:border-border/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-bg-beige overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-link/5 group-hover:bg-link/10 transition-colors" />
                  <div className="relative">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Sessions</p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{stats.sessions}</p>
                  </div>
                </Link>
                <div className="relative bg-card rounded-2xl border border-border/20 p-5 shadow-sm overflow-hidden col-span-2 lg:col-span-1">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-accent/10" />
                  <div className="relative">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Attendance rate</p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold text-accent tabular-nums">
                      {stats.attendanceTotal ? `${stats.overallRate}%` : '—'}
                    </p>
                    {stats.attendanceTotal > 0 && (
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {stats.attendancePresent} / {stats.attendanceTotal} present
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/20">
                    <h2 className="text-sm font-semibold text-text-primary">Students by category</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Distribution across categories</p>
                  </div>
                  <div className="p-5 space-y-4">
                    {(Object.keys(CATEGORY_LABELS) as RecordCategory[]).map((cat) => {
                      const count = stats.byCategory[cat] ?? 0;
                      const pct = stats.students ? (count / stats.students) * 100 : 0;
                      return (
                        <div key={cat} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-primary font-medium">{CATEGORY_LABELS[cat]}</span>
                            <span className="text-text-secondary tabular-nums">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-border/30 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${CATEGORY_COLORS[cat]} transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {stats.students === 0 && (
                      <p className="py-6 text-center text-text-secondary text-sm">No students yet</p>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/20">
                    <h2 className="text-sm font-semibold text-text-primary">Attendance by category</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Present vs total per category</p>
                  </div>
                  <div className="p-5 space-y-4">
                    {(Object.keys(CATEGORY_LABELS) as RecordCategory[]).map((cat) => {
                      const { present, total } = stats.attendanceByCategory[cat];
                      const rate = total ? Math.round((present / total) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-primary font-medium">{CATEGORY_LABELS[cat]}</span>
                            <span className="text-text-secondary tabular-nums">
                              {present}/{total} · {total ? `${rate}%` : '—'}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-border/30 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${CATEGORY_COLORS[cat]} transition-all duration-500`}
                              style={{ width: total ? `${rate}%` : '0%' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border/20 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">Recent sessions</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Attendance per session</p>
                  </div>
                  <Link href="/dashboard/attendance" className="text-sm font-medium text-link hover:underline shrink-0">
                    View all sessions →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  {stats.sessionsWithAttendance.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary text-sm">No sessions yet</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/20">
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Date</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary hidden sm:table-cell">Category</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary hidden sm:table-cell">Type</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">Present</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary w-28">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.sessionsWithAttendance.slice(0, 10).map((s) => (
                          <tr key={s.id} className="border-b border-border/10 hover:bg-bg-beige-light/50 transition-colors">
                            <td className="px-5 py-3 text-sm font-medium text-text-primary whitespace-nowrap">
                              {new Date(s.date).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3 text-sm text-text-secondary hidden sm:table-cell">{CATEGORY_LABELS[s.category]}</td>
                            <td className="px-5 py-3 text-sm text-text-muted hidden sm:table-cell">{s.type}</td>
                            <td className="px-5 py-3 text-sm text-text-secondary text-right tabular-nums">
                              {s.present}/{s.total}
                            </td>
                            <td className="px-5 py-3 w-28">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden min-w-[60px]">
                                  <div
                                    className="h-full rounded-full bg-accent transition-all duration-300"
                                    style={{ width: `${s.rate}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-text-primary tabular-nums w-8 text-right">{s.rate}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
