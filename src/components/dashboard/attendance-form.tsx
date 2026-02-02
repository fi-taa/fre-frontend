'use client';

import { useState, useMemo } from 'react';
import { getRecords } from '@/lib/storage';
import { useEvents } from '@/hooks/use-events';
import { useAttendance } from '@/hooks/use-attendance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RECORD_CATEGORIES, CATEGORY_LABELS } from '@/types';
import type { RecordCategory, AttendanceStatus, PersonRecord } from '@/types';

interface AttendanceFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialRecordId?: string;
}

interface AttendanceNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  count: number;
}

function AttendanceNoteModal({ isOpen, onClose, onSave, count }: AttendanceNoteModalProps) {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave(notes);
    setNotes('');
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-lg w-full max-w-md relative border border-border/30">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-lg"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-semibold text-text-primary">
              Add Notes ({count} {count === 1 ? 'attendance' : 'attendances'})
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20"
              aria-label="Close"
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
                className="text-text-secondary"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="notes" className="block text-xs font-medium mb-1.5 text-text-primary">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes for all attendances..."
                className="w-full px-2.5 py-1.5 text-xs border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AttendanceForm({ onSuccess, onCancel, initialRecordId }: AttendanceFormProps) {
  const records = getRecords();
  const initialRecord = initialRecordId ? records.find((r) => r.id === initialRecordId) : null;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory | 'all'>(
    initialRecord ? initialRecord.category : 'all'
  );
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<Map<string, AttendanceStatus>>(
    initialRecordId ? new Map([[initialRecordId, 'present']]) : new Map()
  );
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [pendingAttendances, setPendingAttendances] = useState<Array<{ recordId: string; status: AttendanceStatus }>>([]);

  const { events } = useEvents();
  const { addAttendance } = useAttendance();

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  const filteredRecords = useMemo(() => {
    let filtered = records;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.church.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [records, selectedCategory, searchTerm]);

  const availableEvents = useMemo(() => {
    if (selectedCategory === 'all') {
      return events;
    }
    return events.filter((event) => event.category === selectedCategory);
  }, [events, selectedCategory]);

  function toggleRecordStatus(recordId: string, status: AttendanceStatus) {
    setSelectedRecords((prev) => {
      const newMap = new Map(prev);
      if (newMap.get(recordId) === status) {
        newMap.delete(recordId);
      } else {
        newMap.set(recordId, status);
      }
      return newMap;
    });
  }

  function handleSave() {
    if (!selectedEventId) {
      alert('Please select an event');
      return;
    }

    if (selectedRecords.size === 0) {
      alert('Please select at least one person');
      return;
    }

    const attendances: Array<{ recordId: string; status: AttendanceStatus }> = [];
    selectedRecords.forEach((status, recordId) => {
      attendances.push({ recordId, status });
    });

    setPendingAttendances(attendances);
    setShowNoteModal(true);
  }

  function handleSaveWithNotes(notes: string) {
    pendingAttendances.forEach(({ recordId, status }) => {
      addAttendance({
        recordId,
        eventId: selectedEventId,
        date: today,
        time: currentTime,
        status,
        notes: notes || undefined,
      });
    });

    setSelectedRecords(new Map());
    setSearchTerm('');
    setSelectedEventId('');
    setShowNoteModal(false);
    setPendingAttendances([]);
    onSuccess();
  }

  function handleSkipNotes() {
    handleSaveWithNotes('');
  }

  const statusOptions: Array<{ value: AttendanceStatus; label: string; color: string }> = [
    { value: 'present', label: 'Present', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'absent', label: 'Absent', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { value: 'late', label: 'Late', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { value: 'excused', label: 'Excused', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  ];


  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm !== '' || selectedEventId !== '';

  const activeFilterCount = [
    selectedCategory !== 'all',
    searchTerm !== '',
    selectedEventId !== '',
  ].filter(Boolean).length;

  function clearAllFilters() {
    setSelectedCategory('all');
    setSearchTerm('');
    setSelectedEventId('');
  }

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-2.5 py-1.5 pl-8 pr-8 text-xs border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
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
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
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
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 whitespace-nowrap ${
                showFilters || hasActiveFilters
                  ? 'bg-accent text-text-light border-accent'
                  : 'border-border/40 text-text-primary hover:border-link/40 hover:bg-link/5'
              }`}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1 py-0.5 text-[10px] rounded-full bg-text-light/20">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {selectedRecords.size > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent whitespace-nowrap">
                {selectedRecords.size} selected
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={selectedRecords.size === 0 || !selectedEventId}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Save
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-text-secondary">Active filters:</span>
            {selectedEventId && (
              <span className="px-2 py-1 bg-accent/10 text-accent rounded-md truncate max-w-[200px]">
                {availableEvents.find((e) => e.id === selectedEventId)?.name || 'Event'}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-accent/10 text-accent rounded-md">
                {CATEGORY_LABELS[selectedCategory]}
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-1 bg-accent/10 text-accent rounded-md truncate max-w-[150px]" title={searchTerm}>
                "{searchTerm}"
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="px-2 py-1 text-xs font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary whitespace-nowrap ml-auto"
            >
              Clear
            </button>
          </div>
        )}

        {showFilters && (
          <div className="bg-card rounded-lg border border-border/30 p-3 space-y-3">
            <div>
              <label htmlFor="event" className="block text-xs font-medium mb-1.5 text-text-secondary">
                Event <span className="text-error">*</span>
              </label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId} required>
                <SelectTrigger id="event" className="h-8 text-xs">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id} className="text-xs">
                      {event.name} ({CATEGORY_LABELS[event.category as RecordCategory]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/30">
              <span className="text-xs font-medium text-text-secondary">Category:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-accent text-text-light'
                    : 'bg-bg-beige-light text-text-primary hover:bg-bg-beige-light/80'
                }`}
              >
                All
              </button>
              {RECORD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-accent text-text-light'
                      : 'bg-bg-beige-light text-text-primary hover:bg-bg-beige-light/80'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
          <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto">
            {filteredRecords.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-secondary">
                No records found
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filteredRecords.map((record) => {
                  const currentStatus = selectedRecords.get(record.id);
                  return (
                    <div
                      key={record.id}
                      className={`p-2.5 sm:p-3 hover:bg-bg-beige-light transition-colors duration-200 ${
                        currentStatus ? 'bg-bg-beige-light/50' : ''
                      }`}
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-text-primary truncate">{record.name}</div>
                          <div className="text-xs text-text-secondary mt-0.5">
                            {record.church} • {CATEGORY_LABELS[record.category as RecordCategory]} • Age {record.age}
                          </div>
                        </div>
                        {currentStatus && (
                          <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0 ${
                            statusOptions.find((s) => s.value === currentStatus)?.color || ''
                          }`}>
                            {statusOptions.find((s) => s.value === currentStatus)?.label}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {statusOptions.map((status) => (
                          <button
                            key={status.value}
                            onClick={() => toggleRecordStatus(record.id, status.value)}
                            className={`px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                              currentStatus === status.value
                                ? status.color
                                : 'bg-bg-beige-light text-text-primary hover:bg-bg-beige-light/80 border border-border/40'
                            }`}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AttendanceNoteModal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setPendingAttendances([]);
        }}
        onSave={handleSaveWithNotes}
        count={pendingAttendances.length}
      />
    </>
  );
}
