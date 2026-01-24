import { Tooltip } from '@/components/ui/tooltip';
import type { Record } from '@/types';

interface TableRowProps {
  record: Record;
  onView?: (record: Record) => void;
  index?: number;
}

export function TableRow({ record, onView, index }: TableRowProps) {
  const isEven = index !== undefined && index % 2 === 0;
  return (
    <tr className={`border-b border-border/30 transition-colors duration-200 group ${isEven ? 'bg-table-row-alt' : 'bg-card'} hover:bg-bg-beige-light`}>
      <td className="px-3 py-2 text-sm font-medium text-text-primary max-w-[120px]">
        <Tooltip content={record.name}>
          <div className="truncate w-full">{record.name}</div>
        </Tooltip>
      </td>
      <td className="px-3 py-2 text-sm text-text-primary max-w-[150px]">
        <Tooltip content={record.church}>
          <div className="truncate w-full">{record.church}</div>
        </Tooltip>
      </td>
      <td className="px-3 py-2 text-sm text-text-primary">{record.age}</td>
      <td className="px-3 py-2">
        <button
          onClick={() => onView?.(record)}
          className="p-1.5 rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30"
          aria-label="View details"
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
            className="text-text-secondary group-hover:text-link transition-colors duration-200"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
