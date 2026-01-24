import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8 bg-card rounded-lg p-6 sm:p-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary">Sign Up</h1>
          <p className="text-sm text-text-secondary">
            Create a new account to get started
          </p>
        </div>
        <SignupForm />
        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-link hover:underline"
          >
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
