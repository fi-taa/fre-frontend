'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ codeId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8 bg-card rounded-lg p-6 sm:p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
          <div className="space-y-2 p-6 rounded-lg border border-border bg-bg-light">
            <p className="text-sm text-text-secondary">Code ID</p>
            <p className="text-lg font-mono text-text-primary break-all">
              {user.codeId}
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
