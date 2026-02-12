'use client';

import { useState } from 'react';
import { useListDepartmentsQuery } from '@/store/slices/departmentsApi';
import type { Department } from '@/types';

interface AddUserFormProps {
  userType: 'admin' | 'manager';
  allowedDepartmentIds?: number[];
  onSubmit: (data: { email: string; full_name: string; password: string; department_id: number }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddUserForm({ userType, allowedDepartmentIds, onSubmit, onCancel, isLoading = false }: AddUserFormProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: allDepartments = [], isLoading: departmentsLoading } = useListDepartmentsQuery();

  const availableDepartments = allowedDepartmentIds
    ? allDepartments.filter((dept) => allowedDepartmentIds.includes(dept.id))
    : allDepartments;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();

    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!trimmedFullName) {
      setError('Full name is required');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const deptId = parseInt(departmentId, 10);
    if (!departmentId || isNaN(deptId)) {
      setError('Department is required');
      return;
    }

    try {
      await onSubmit({
        email: trimmedEmail,
        full_name: trimmedFullName,
        password,
        department_id: deptId,
      });
    } catch (err: unknown) {
      const data = err && typeof err === 'object' && 'data' in err ? (err as { data?: { detail?: unknown } }).data : undefined;
      const detail = data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join('. ') || `Failed to create ${userType}`
        : typeof detail === 'string'
          ? detail
          : `Failed to create ${userType}`;
      setError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border/30 p-6 space-y-4">
      <div>
        <label htmlFor="full-name" className="block text-sm font-medium mb-1.5 text-text-primary">
          Full Name <span className="text-error">*</span>
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-50"
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-text-primary">
          Email <span className="text-error">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-50"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-text-primary">
          Password <span className="text-error">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
            className="w-full px-4 py-2 pr-12 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-50"
            placeholder="Enter password (min 6 characters)"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary focus:outline-none disabled:opacity-50"
            disabled={isLoading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium mb-1.5 text-text-primary">
          Department <span className="text-error">*</span>
        </label>
        <select
          id="department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          required
          disabled={isLoading || departmentsLoading}
          className="w-full px-4 py-2 text-sm border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 disabled:opacity-50"
        >
          <option value="">Select a department</option>
          {availableDepartments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          {isLoading ? 'Creating...' : `Create ${userType === 'admin' ? 'Admin' : 'Manager'}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:bg-bg-beige-light text-text-primary disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
