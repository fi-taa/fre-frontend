'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGreeting } from '@/lib/data-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/20 shadow-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex h-14 min-h-[56px] items-center justify-between gap-2 px-4">
        <div className="flex min-w-[44px] items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 rounded-full text-text-primary hover:bg-black/5 active:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-2xl shadow-lg border border-border/20">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-beige-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/records" className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-beige-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                  </span>
                  Records
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/add" className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M12 18v-6" />
                      <path d="M9 15h6" />
                    </svg>
                  </span>
                  Add Record
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/attendance" className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-beige-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </span>
                  Attendance
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/departments" className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-beige-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                      <path d="M12 3v6" />
                    </svg>
                  </span>
                  Departments
                </Link>
              </DropdownMenuItem>
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
        </div>

        <div className="flex flex-1 min-w-0 items-baseline justify-center gap-1.5">
          <h1 className="text-lg font-semibold text-text-primary truncate tabular-nums">
            ፍሬ ሃይማኖት መዝገብ
          </h1>
          {greeting ? (
            <span className="hidden sm:inline-flex shrink-0 text-xs text-text-secondary font-medium">
              {greeting}
            </span>
          ) : null}
        </div>

        <div className="flex min-w-[44px] items-center justify-end gap-0.5">
          {/* <button
            onClick={onNotifications}
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-text-primary hover:bg-black/5 active:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-link/30 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notificationCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error" />
            ) : null}
          </button> */}
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
  );
}
