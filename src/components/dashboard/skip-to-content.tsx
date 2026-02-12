'use client';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-text-light focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      Skip to main content
    </a>
  );
}
