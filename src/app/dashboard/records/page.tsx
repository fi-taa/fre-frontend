'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { usePagination } from '@/hooks/use-pagination';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TabNavigation } from '@/components/dashboard/tab-navigation';
import { SearchBar } from '@/components/dashboard/search-bar';
import { PageLoader } from '@/components/ui/page-loader';
import { DataTable } from '@/components/dashboard/data-table';
import { handleLogout as logoutAndResetCache } from '@/lib/auth-helpers';
import type { RootState } from '@/store/store';

export default function RecordsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0);
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const adminDepartmentIds = currentUser?.department_ids ?? [];
  const managerDepartmentIds = currentUser?.department_ids ?? [];
  const { data: allDepartments = [] } = useListDepartmentsQuery(undefined, {
    skip: !isSuperAdmin,
  });

  useEffect(() => {
    if (!currentUser) return;
    if (isSuperAdmin) {
      setSelectedDepartmentId((current) => (current > 0 ? current : 1));
      return;
    }
    if (isAdmin) {
      const firstAdminDepartment = adminDepartmentIds[0] ?? 0;
      setSelectedDepartmentId((current) => (current > 0 ? current : firstAdminDepartment));
      return;
    }
    if (isManager) {
      const managerDepartmentId = managerDepartmentIds[0] ?? 0;
      setSelectedDepartmentId(managerDepartmentId);
    }
  }, [currentUser, isSuperAdmin, isAdmin, isManager, adminDepartmentIds, managerDepartmentIds]);

  const {
    filteredRecords,
    selectedCategory,
    searchTerm,
    sortField,
    sortDirection,
    isLoading: dataLoading,
    setSelectedCategory,
    setSearchTerm,
    handleSort,
  } = useDashboardData(selectedDepartmentId);

  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({ data: filteredRecords });

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

  function handleFilter() {
    // Filter functionality not implemented yet
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-beige flex flex-col relative">
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
        <div className="relative z-10">
          <DashboardHeader onLogout={onLogout} onNotifications={handleNotifications} notificationCount={0} />
          <div className="bg-card border-b border-border/30 min-h-[120px]" />
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

  const hasData = filteredRecords.length > 0 || !dataLoading;
  const showContent = hasData;

  return (
    <div className="min-h-screen bg-bg-beige flex flex-col relative">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
      <div className="relative z-10">
        <DashboardHeader onLogout={onLogout} onNotifications={handleNotifications} notificationCount={0} />
        <div className="bg-card border-b border-border/30">
          <div className="px-4 py-3 border-b border-border/20">
            <Link href="/dashboard" className="flex min-h-[44px] items-center gap-2 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Dashboard
            </Link>
          </div>
          <TabNavigation selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          {(isSuperAdmin || isAdmin) && (
            <div className="px-4 py-3 border-b border-border/20">
              <label htmlFor="records-department-filter" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Department
              </label>
              <select
                id="records-department-filter"
                value={selectedDepartmentId > 0 ? String(selectedDepartmentId) : ''}
                onChange={(event) => setSelectedDepartmentId(Number(event.target.value))}
                className="w-full sm:w-[320px] h-10 px-3 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              >
                {isSuperAdmin
                  ? allDepartments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))
                  : adminDepartmentIds.map((departmentId) => (
                    <option key={departmentId} value={departmentId}>
                      Department {departmentId}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} onDelete={() => {}} onFilter={handleFilter} hasSelection={false} />
        </div>
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-full mx-auto">
          {showContent ? (
            <DataTable
              records={paginatedData}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={previousPage}
              onNext={nextPage}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              selectedDepartmentId={selectedDepartmentId}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[300px]">
              <PageLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
