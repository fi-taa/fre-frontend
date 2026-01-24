'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { usePagination } from '@/hooks/use-pagination';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TabNavigation } from '@/components/dashboard/tab-navigation';
import { SearchBar } from '@/components/dashboard/search-bar';
import { DataTable } from '@/components/dashboard/data-table';
import type { Record } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ codeId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function handleProfile() {
    router.push('/dashboard/profile');
  }

  function handleSettings() {
    // TODO: Implement settings functionality
    console.log('Settings clicked');
  }

  function handleAddRecord() {
    router.push('/dashboard/add');
  }

  function handleAttendance() {
    router.push('/dashboard/attendance');
  }

  function handleNotifications() {
    // TODO: Implement notifications functionality
  }

  function handleFilter() {
    // TODO: Implement filter functionality
  }

  function handleViewRecord(record: Record) {
    router.push(`/dashboard/records/${record.id}`);
  }

  if (isLoading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
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
          onNotifications={handleNotifications}
          notificationCount={0}
        />
        <div className="bg-card border-b border-border/30">
          <TabNavigation
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDelete={() => {}}
            onFilter={handleFilter}
            hasSelection={false}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-full mx-auto">
          <DataTable
            records={paginatedData}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={handleViewRecord}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={previousPage}
            onNext={nextPage}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
        </div>
      </div>
    </div>
  );
}
