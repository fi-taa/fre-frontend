'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { usePagination } from '@/hooks/use-pagination';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TabNavigation } from '@/components/dashboard/tab-navigation';
import { SearchBar } from '@/components/dashboard/search-bar';
import { PageLoader } from '@/components/ui/page-loader';
import { DataTable } from '@/components/dashboard/data-table';
import { clearAuth } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

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
    handleDelete,
  } = useDashboardData();

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

  function handleLogout() {
    dispatch(clearAuth());
    router.push('/login');
  }

  function handleSettings() {
    console.log('Settings clicked');
  }

  function handleNotifications() {
    // TODO: Implement notifications functionality
  }

  function handleFilter() {
    // TODO: Implement filter functionality
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-beige flex flex-col relative">
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
        <div className="relative z-10">
          <DashboardHeader onSettings={handleSettings} onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
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
        <DashboardHeader onSettings={handleSettings} onLogout={handleLogout} onNotifications={handleNotifications} notificationCount={0} />
        <div className="bg-card border-b border-border/30">
          <TabNavigation selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
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
