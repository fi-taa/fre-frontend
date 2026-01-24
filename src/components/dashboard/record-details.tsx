'use client';

import { getFormConfigByCategory } from '@/lib/form-config';
import type { Record } from '@/types';

interface RecordDetailsProps {
  record: Record;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RecordDetails({ record, onEdit, onDelete }: RecordDetailsProps) {
  const formConfig = getFormConfigByCategory(record.category);

  function renderFieldValue(fieldId: string, value: string | number | undefined) {
    if (value === undefined || value === null || value === '') {
      return <span className="text-xs text-text-muted italic">Not provided</span>;
    }
    return <span className="text-xs text-text-primary">{String(value)}</span>;
  }

  return (
    <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
      <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border/30 bg-table-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-text-primary truncate">{record.name}</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {record.church} • {record.category} • Age {record.age}
            </p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary whitespace-nowrap"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-error/30 whitespace-nowrap"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {formConfig.sections.map((section, sectionIndex) => {
          const hasData = section.fields.some(
            (field) => record[field.id as keyof Record] !== undefined && record[field.id as keyof Record] !== ''
          );

          if (!hasData) {
            return null;
          }

          return (
            <div key={sectionIndex} className="space-y-2.5 sm:space-y-3">
              <div className="border-b border-border/30 pb-1.5 sm:pb-2">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary">{section.title}</h3>
                {section.description && (
                  <p className="text-xs text-text-secondary mt-0.5">{section.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {section.fields.map((field) => {
                  const value = record[field.id as keyof Record];
                  if (value === undefined || value === null || value === '') {
                    return null;
                  }
                  return (
                    <div key={field.id} className="space-y-0.5 sm:space-y-1">
                      <label className="text-xs font-medium text-text-secondary">
                        {field.label}
                      </label>
                      <div className="text-xs text-text-primary break-words">
                        {field.type === 'textarea' ? (
                          <div className="whitespace-pre-wrap line-clamp-3 sm:line-clamp-none">{String(value)}</div>
                        ) : (
                          renderFieldValue(field.id, value)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
