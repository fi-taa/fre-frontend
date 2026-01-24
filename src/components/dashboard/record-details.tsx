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
      return <span className="text-text-muted italic">Not provided</span>;
    }
    return <span className="text-text-primary">{String(value)}</span>;
  }

  return (
    <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
      <div className="px-6 py-5 border-b border-border/30 bg-table-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{record.name}</h2>
            <p className="text-sm text-text-secondary mt-1">
              {record.church} • {record.category} • Age {record.age}
            </p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-error/30"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {formConfig.sections.map((section, sectionIndex) => {
          const hasData = section.fields.some(
            (field) => record[field.id as keyof Record] !== undefined && record[field.id as keyof Record] !== ''
          );

          if (!hasData) {
            return null;
          }

          return (
            <div key={sectionIndex} className="space-y-4">
              <div className="border-b border-border/30 pb-2">
                <h3 className="text-lg font-semibold text-text-primary">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-text-secondary mt-1">{section.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => {
                  const value = record[field.id as keyof Record];
                  if (value === undefined || value === null || value === '') {
                    return null;
                  }
                  return (
                    <div key={field.id} className="space-y-1">
                      <label className="text-sm font-medium text-text-secondary">
                        {field.label}
                      </label>
                      <div className="text-sm text-text-primary">
                        {field.type === 'textarea' ? (
                          <div className="whitespace-pre-wrap">{String(value)}</div>
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
