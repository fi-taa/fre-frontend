interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`p-1.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 ${
          canGoPrevious
            ? 'text-text-primary hover:bg-bg-beige-light'
            : 'text-text-muted cursor-not-allowed opacity-40'
        }`}
        aria-label="Previous page"
      >
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
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`p-1.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 ${
          canGoNext
            ? 'text-text-primary hover:bg-bg-beige-light'
            : 'text-text-muted cursor-not-allowed opacity-40'
        }`}
        aria-label="Next page"
      >
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
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
