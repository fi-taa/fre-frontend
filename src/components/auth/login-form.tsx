'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/store/slices/authApi';
import { setAuthToken } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const response = await login({
        username: username.trim(),
        password,
      }).unwrap();

      dispatch(setAuthToken({
        access_token: response.access_token,
        token_type: response.token_type,
      }));

      router.push('/dashboard');
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err && typeof err === 'object') {
        const error = err as any;
        
        // Check for backend error response
        if (error.data?.detail) {
          const detail = error.data.detail;
          // Handle array of validation errors
          if (Array.isArray(detail)) {
            errorMessage = detail.map((e: any) => e.msg || String(e)).join(', ');
          }
          // Handle string detail
          else if (typeof detail === 'string') {
            errorMessage = detail;
          }
          // Handle object detail
          else if (detail && typeof detail === 'object' && 'msg' in detail) {
            errorMessage = detail.msg;
          }
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        } 
        // Check for network/request errors
        else if (error.status === undefined) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        // HTTP status codes
        else if (error.status) {
          const statusMessages: Record<number, string> = {
            400: 'Invalid request. Please check your inputs.',
            401: 'Incorrect email or password',
            403: 'Access denied',
            404: 'User not found',
            500: 'Server error. Please try again later.',
          };
          errorMessage = statusMessages[error.status] || `Error: ${error.status}`;
        }
      }
      
      setError(errorMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-2 text-text-primary"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full min-h-[44px] px-4 rounded-lg border border-border bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-text-primary"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] px-4 pr-12 rounded-lg border border-border bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary focus:outline-none"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-error">{error}</div>
      )}

      <Button type="submit" isLoading={isLoading}>
        Login
      </Button>
    </form>
  );
}
