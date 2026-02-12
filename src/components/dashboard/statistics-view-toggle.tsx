'use client';

interface StatisticsViewToggleProps {
  view: 'table' | 'graph';
  onViewChange: (view: 'table' | 'graph') => void;
}

export function StatisticsViewToggle({ view, onViewChange }: StatisticsViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border/40 bg-bg-beige-light p-1">
      <button
        onClick={() => onViewChange('table')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          view === 'table'
            ? 'bg-card text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-label="Table view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 3v18" />
        </svg>
        Table
      </button>
      <button
        onClick={() => onViewChange('graph')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          view === 'graph'
            ? 'bg-card text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-label="Graph view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1.5">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
        Graph
      </button>
    </div>
  );
}
