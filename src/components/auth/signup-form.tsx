'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateCodeId, signUp } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export function SignupForm() {
  const router = useRouter();
  const [codeId, setCodeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newCodeId = generateCodeId();
    setCodeId(newCodeId);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = signUp(codeId, password);

    if (!result.success) {
      setError(result.error || 'Sign up failed');
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="codeId"
            className="block text-sm font-medium mb-2 text-text-primary"
          >
            Code ID (Auto-generated)
          </label>
          <input
            id="codeId"
            type="text"
            value={codeId}
            readOnly
            className="w-full min-h-[44px] px-4 rounded-lg border border-border bg-card/50 text-text-secondary cursor-not-allowed"
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
        Sign Up
      </Button>
    </form>
  );
}
