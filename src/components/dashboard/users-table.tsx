'use client';

import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import type { User } from '@/types';

interface UsersTableProps {
  users: User[];
  userType: 'admin' | 'manager';
  isLoading?: boolean;
  onDelete?: (userId: number) => void;
}

export function UsersTable({ users, userType, isLoading = false, onDelete }: UsersTableProps) {
  const { data: departments = [] } = useListDepartmentsQuery();

  function getDepartmentNames(departmentIds: number[]): string {
    const deptNames = departmentIds
      .map((id) => departments.find((d) => d.id === id)?.name)
      .filter(Boolean) as string[];
    return deptNames.length > 0 ? deptNames.join(', ') : '—';
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-secondary mb-4">No {userType === 'admin' ? 'admins' : 'managers'} yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-table-header border-b border-border/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary hidden sm:table-cell">
              Department{userType === 'admin' ? 's' : ''}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary hidden md:table-cell">
              Status
            </th>
            {onDelete && (
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary w-28">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border/30 hover:bg-bg-beige-light transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-text-primary">
                {user.full_name}
              </td>
              <td className="px-4 py-3 text-sm text-text-secondary">
                {user.email}
              </td>
              <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell max-w-xs truncate">
                {getDepartmentNames(user.department_ids)}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              {onDelete && (
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(user.id)}
                    className="px-2 py-1 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-50 text-red-700"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
