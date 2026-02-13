'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getGreeting } from '@/lib/data-utils';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
import type { RootState } from '@/store/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SkipToContent } from '@/components/dashboard/skip-to-content';

interface DashboardHeaderProps {
  onLogout?: () => void;
  onNotifications?: () => void;
  notificationCount?: number;
}

export function DashboardHeader({
  onLogout,
  onNotifications,
  notificationCount = 0,
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState('');
  const pathname = usePathname();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUserData, isLoading: isLoadingUser, error: userError } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const currentUser = currentUserData?.data;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin' || isSuperAdmin;


  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
    const isActive = href === '/dashboard' 
      ? pathname === '/dashboard'
      : pathname === href || pathname?.startsWith(`${href}/`);
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-link/30 ${
          isActive
            ? 'bg-accent/10 text-accent'
            : 'text-text-primary hover:bg-bg-beige-light'
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center shrink-0">{icon}</span>
        <span className="hidden lg:inline">{children}</span>
      </Link>
    );
  }

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      href: '/dashboard/records',
      label: 'Records',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/add',
      label: 'Add Record',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 18v-6" />
          <path d="M9 15h6" />
        </svg>
      ),
    },
    {
      href: '/dashboard/attendance',
      label: 'Attendance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
    },
    {
      href: '/dashboard/departments',
      label: 'Departments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
          <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
          <path d="M12 3v6" />
        </svg>
      ),
    },
  ];

  if (isSuperAdmin) {
    menuItems.push({
      href: '/dashboard/admins',
      label: 'Admins',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    });
    menuItems.push({
      href: '/dashboard/analytics',
      label: 'Analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      ),
    });
  }

  if (isAdmin && !isSuperAdmin) {
    menuItems.push({
      href: '/dashboard/managers',
      label: 'Managers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    });
  }

  return (
    <>
      <SkipToContent />
      <header
        className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/20 shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
      <div className="flex h-14 min-h-[56px] items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 rounded-full text-text-primary hover:bg-black/5 active:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-2xl shadow-lg border border-border/20">
              {menuItems.map((item) => {
                const isActive = item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 ${
                        isActive ? 'bg-accent/10 text-accent' : ''
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? 'bg-accent/15' : 'bg-bg-beige-light'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={onLogout} className="py-2.5 gap-3 text-error focus:text-error focus:bg-error/10">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-error/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </span>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden lg:flex flex-col items-start">
            <h1 className="text-lg font-semibold text-text-primary tabular-nums leading-tight">
              ፍሬ ሃይማኖት መዝገብ
            </h1>
            {greeting && (
              <span className="text-xs text-text-secondary font-medium tabular-nums">
                {greeting}
              </span>
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 min-w-0 items-center justify-center lg:hidden">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-text-primary truncate tabular-nums leading-tight">
              ፍሬ ሃይማኖት መዝገብ
            </h1>
            {greeting && (
              <span className="text-xs text-text-secondary font-medium tabular-nums">
                {greeting}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onLogout}
            className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-error hover:bg-error/10 transition-colors focus:outline-none focus:ring-2 focus:ring-error/30"
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden xl:inline">Logout</span>
          </button>
          <Link
            href="/dashboard/add"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-accent text-text-light hover:opacity-90 active:opacity-80 transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Add record"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
    </>
  );
}
