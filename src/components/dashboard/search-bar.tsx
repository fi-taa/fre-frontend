interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDelete?: () => void;
  onFilter?: () => void;
  hasSelection?: boolean;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  onDelete,
  onFilter,
  hasSelection = false,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-card border-b border-border/30">
      <button
        onClick={onDelete}
        disabled={!hasSelection}
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20 ${
          hasSelection
            ? 'text-text-primary hover:bg-error/10 hover:text-error'
            : 'text-text-muted cursor-not-allowed opacity-40'
        }`}
        aria-label="Delete"
      >
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
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>

      <button
        onClick={onFilter}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-text-primary hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20"
        aria-label="Filter"
      >
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
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </button>

      <div className="flex-1 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="w-full min-h-[48px] pl-11 pr-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
        />
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
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/70"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
    </div>
  );
}
