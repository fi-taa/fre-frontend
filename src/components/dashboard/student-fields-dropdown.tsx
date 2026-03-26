'use client';

import { useMemo, useState } from 'react';
import { STUDENT_SCHEMA_FIELD_OPTIONS } from '@/lib/student-schema-fields';

interface StudentFieldsDropdownProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function StudentFieldsDropdown({ value, onChange }: StudentFieldsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return STUDENT_SCHEMA_FIELD_OPTIONS;
    return STUDENT_SCHEMA_FIELD_OPTIONS.filter((option) => option.label.toLowerCase().includes(trimmed));
  }, [query]);

  function toggleField(field: string) {
    const exists = value.includes(field);
    if (exists) {
      onChange(value.filter((item) => item !== field));
      return;
    }
    onChange([...value, field]);
  }

  function clearSelection() {
    onChange([]);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full min-h-[40px] px-3 py-2 text-sm border border-subtle rounded-md bg-subtle text-primary text-left focus:outline-none focus:ring-2 focus:ring-accent-info"
      >
        {value.length > 0 ? `${value.length} fields selected` : 'Select allowed fields'}
      </button>
      {isOpen && (
        <div className="border border-subtle rounded-md bg-surface p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search fields"
              className="w-full border border-subtle rounded-md p-[12px] text-[14px] font-medium leading-[1.2] text-primary focus:outline-none focus:ring-2 focus:ring-accent-info"
            />
            <button
              type="button"
              onClick={clearSelection}
              className="h-[40px] px-3 rounded-md border border-subtle text-[14px] font-semibold leading-[1.2] text-primary hover:bg-subtle focus:outline-none focus:ring-2 focus:ring-accent-info"
            >
              Clear
            </button>
          </div>
          <div className="max-h-56 overflow-auto rounded-md border border-subtle">
            {filteredOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 px-3 py-2 border-b border-subtle last:border-b-0 hover:bg-subtle">
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => toggleField(option.value)}
                  className="h-4 w-4"
                />
                <span className="text-[14px] font-medium leading-[1.2] text-primary">{option.label}</span>
              </label>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-[14px] font-medium leading-[1.2] text-secondary">No fields found</div>
            )}
          </div>
        </div>
      )}
      {value.length > 0 && (
        <div className="rounded-md border border-subtle bg-surface p-2 max-h-28 overflow-auto">
          <div className="flex flex-wrap gap-2">
            {value.map((selectedField) => (
              <span key={selectedField} className="inline-flex items-center h-[32px] px-2 rounded-full bg-subtle text-[13px] font-semibold leading-[1.2] text-primary">
                {selectedField}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

