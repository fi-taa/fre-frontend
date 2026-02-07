import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8 bg-card rounded-lg p-6 sm:p-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary">Login</h1>
          <p className="text-sm text-text-secondary">
            Enter your credentials to continue
          </p>
        </div>
        <LoginForm />
        <div className="text-center">
          <a
            href="/signup"
            className="inline-flex min-h-[44px] items-center justify-center text-sm text-link hover:underline"
          >
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
