'use client';

import type { User } from '@/types';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
      <div className="px-6 py-5 border-b border-border/30 bg-table-header">
        <h2 className="text-2xl font-bold text-text-primary">Profile</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <div className="mt-1 text-text-primary font-mono">{user.email || user.full_name}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Full Name</label>
            <div className="mt-1 text-text-primary">{user.full_name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
