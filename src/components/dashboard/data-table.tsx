import { TableRow } from './table-row';
import { PaginationControls } from './pagination-controls';
import type { Record, SortField } from '@/types';

interface DataTableProps {
  records: Record[];
  sortField: SortField | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  onView?: (record: Record) => void;
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function DataTable({
  records,
  sortField,
  sortDirection,
  onSort,
  onView,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: DataTableProps) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-muted"
        >
          <path d="m7 8 5-5 5 5" />
          <path d="m7 16 5 5 5-5" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-primary"
        >
        <path d="m7 8 5-5 5 5" />
      </svg>
    ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-primary"
        >
        <path d="m7 16 5 5 5-5" />
      </svg>
    );
  };

  return (
    <div className="bg-card relative">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="overflow-x-auto relative z-10">
        <table className="w-full">
          <thead className="bg-table-header border-b border-border/50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary max-w-[120px]">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center gap-1.5 hover:text-link transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20 rounded px-1.5 py-0.5 -ml-1.5"
                >
                  ስም
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary max-w-[150px]">
                <button
                  onClick={() => onSort('church')}
                  className="flex items-center gap-1.5 hover:text-link transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20 rounded px-1.5 py-0.5 -ml-1.5"
                >
                  ደብር
                  <SortIcon field="church" />
                </button>
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onSort('age')}
                    className="flex items-center gap-1.5 hover:text-link transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20 rounded px-1.5 py-0.5 -ml-1.5"
                  >
                    እድሜ
                    <SortIcon field="age" />
                  </button>
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrevious={onPrevious}
                    onNext={onNext}
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                  />
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary w-16">
                {/* View column header */}
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-text-secondary text-sm">No records found</div>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <TableRow key={record.id} record={record} onView={onView} index={index} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
