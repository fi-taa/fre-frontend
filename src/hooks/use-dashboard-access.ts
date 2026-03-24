'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from '@/store/slices/usersApi';
import type { RootState } from '@/store/store';
import type { UserRole } from '@/types';

interface UseDashboardAccessParams {
  allowedRoles?: UserRole[];
}

interface UseDashboardAccessReturn {
  isMounted: boolean;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  isReady: boolean;
  isAllowed: boolean;
}

export function useDashboardAccess({ allowedRoles }: UseDashboardAccessParams = {}): UseDashboardAccessReturn {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: currentUserData, isLoading: isUserLoading } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const currentUser = currentUserData?.data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAllowed = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  }, [allowedRoles, currentUser]);

  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (allowedRoles && allowedRoles.length > 0 && !isUserLoading && currentUser && !isAllowed) {
      router.replace('/dashboard');
    }
  }, [isMounted, isAuthenticated, isUserLoading, currentUser, isAllowed, allowedRoles, router]);

  const isReady = isMounted && isAuthenticated && (!allowedRoles || !isUserLoading);

  return {
    isMounted,
    isAuthenticated,
    isUserLoading,
    isReady,
    isAllowed,
  };
}
