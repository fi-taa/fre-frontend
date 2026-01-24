'use client';

import { useState } from 'react';
import { findUserByUsername, getUsers } from '@/lib/storage';
import type { User } from '@/types';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const foundUser = findUserByUsername(user.username);
    if (!foundUser || foundUser.password !== currentPassword) {
      setError('Current password is incorrect');
      return;
    }

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.username === user.username);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], password: newPassword };
      localStorage.setItem('users', JSON.stringify(users));
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
      <div className="px-6 py-5 border-b border-border/30 bg-table-header">
        <h2 className="text-2xl font-bold text-text-primary">Profile</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary">Username</label>
            <div className="mt-1 text-text-primary font-mono">{user.username}</div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Change Password</h3>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setError('');
                setSuccess('');
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 text-error text-sm">{error}</div>
              )}
              {success && (
                <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm">{success}</div>
              )}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2 text-text-primary">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-text-primary">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-text-primary">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
