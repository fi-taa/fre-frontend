interface PageLoaderProps {
  message?: string;
  className?: string;
  minHeight?: boolean;
}

export function PageLoader({ message, className = '', minHeight = true }: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-text-secondary text-sm ${minHeight ? 'min-h-[200px]' : ''} ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="size-8 rounded-full border-2 border-border/40 border-t-link animate-spin"
        aria-hidden
      />
      {message && <span>{message}</span>}
    </div>
  );
}
