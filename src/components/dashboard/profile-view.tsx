'use client';

import { memo } from 'react';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import type { User } from '@/types';

interface ProfileViewProps {
  user: User;
}

function ProfileViewComponent({ user }: ProfileViewProps) {
  const { data: departments = [] } = useListDepartmentsQuery();

  function getDepartmentNames(departmentIds: number[]): string {
    if (departmentIds.length === 0) return 'None';
    const deptNames = departmentIds
      .map((id) => departments.find((d) => d.id === id)?.name)
      .filter(Boolean) as string[];
    return deptNames.length > 0 ? deptNames.join(', ') : 'None';
  }

  const roleLabels: Record<User['role'], string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    staff: 'Staff',
  };

  return (
    <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
      <div className="px-6 py-5 border-b border-border/30 bg-table-header">
        <h2 className="text-2xl font-bold text-text-primary">Profile</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <div className="mt-1 text-text-primary font-mono">{user.email}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Full Name</label>
            <div className="mt-1 text-text-primary">{user.full_name}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Role</label>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                {roleLabels[user.role]}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Status</label>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Departments</label>
            <div className="mt-1 text-text-primary">{getDepartmentNames(user.department_ids)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProfileView = memo(ProfileViewComponent);
