import Link from 'next/link';
import { TableRow } from './table-row';
import { PaginationControls } from './pagination-controls';
import type { PersonRecord, SortField } from '@/types';

interface DataTableProps {
  records: PersonRecord[];
  sortField: SortField | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  onView?: (record: PersonRecord) => void;
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
      <div className="sm:hidden relative z-10 p-3 space-y-2">
        {records.length === 0 ? (
          <div className="py-8 text-center text-text-secondary text-sm">No records found</div>
        ) : (
          <>
            {records.map((record) => (
              <Link
                key={record.id}
                href={`/dashboard/records/${record.id}`}
                className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-border/30 bg-bg-beige-light/50 px-4 py-3 text-left transition-colors hover:bg-bg-beige-light focus:outline-none focus:ring-2 focus:ring-link/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-text-primary truncate">{record.name}</div>
                  <div className="text-sm text-text-secondary truncate">{record.church} · {record.age}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-text-muted">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
            <div className="flex justify-end pt-2">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={onPrevious}
                onNext={onNext}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />
            </div>
          </>
        )}
      </div>
      <div className="hidden sm:block overflow-x-auto relative z-10">
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
                <button
                  onClick={() => onSort('age')}
                  className="flex items-center gap-1.5 hover:text-link transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20 rounded px-1.5 py-0.5 -ml-1.5"
                >
                  እድሜ
                  <SortIcon field="age" />
                </button>
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
      <div className="hidden sm:flex items-center justify-end border-t border-border/30 px-3 py-2 bg-table-header">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={onPrevious}
          onNext={onNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
      </div>
    </div>
  );
}
