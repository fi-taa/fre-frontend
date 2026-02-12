'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-h-[44px] items-center gap-2 py-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
            {isLast ? (
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-text-secondary">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
