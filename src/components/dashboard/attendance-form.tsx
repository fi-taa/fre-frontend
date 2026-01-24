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
import type { RecordCategory, AttendanceStatus, Record } from '@/types';

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Add Notes ({count} {count === 1 ? 'attendance' : 'attendances'})
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20"
              aria-label="Close"
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
                className="text-text-secondary"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2 text-text-primary">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes for all attendances..."
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
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

  const categories: RecordCategory[] = ['ሰራተኛ', 'ወጣት', 'አዳጊ', 'ህጻናት'];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Take Attendance</h3>
            <p className="text-sm text-text-secondary mt-1">
              {today} • {currentTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedRecords.size > 0 && (
              <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-accent/10 text-accent">
                {selectedRecords.size} selected
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={selectedRecords.size === 0 || !selectedEventId}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Attendance
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event" className="block text-sm font-medium mb-2 text-text-primary">
              Event <span className="text-error">*</span>
            </label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId} required>
              <SelectTrigger id="event">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {availableEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name} ({event.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text-primary">Filter by category:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-accent text-text-light'
                  : 'bg-bg-beige-light text-text-primary hover:bg-bg-beige-light/80'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-accent text-text-light'
                    : 'bg-bg-beige-light text-text-primary hover:bg-bg-beige-light/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-2 text-text-primary">
              Search Records
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or church..."
                className="w-full px-4 py-2 pl-10 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                No records found
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filteredRecords.map((record) => {
                  const currentStatus = selectedRecords.get(record.id);
                  return (
                    <div
                      key={record.id}
                      className={`p-4 hover:bg-bg-beige-light transition-colors duration-200 ${
                        currentStatus ? 'bg-bg-beige-light/50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-text-primary">{record.name}</div>
                          <div className="text-sm text-text-secondary">
                            {record.church} • {record.category} • Age {record.age}
                          </div>
                        </div>
                        {currentStatus && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusOptions.find((s) => s.value === currentStatus)?.color || ''
                          }`}>
                            {statusOptions.find((s) => s.value === currentStatus)?.label}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {statusOptions.map((status) => (
                          <button
                            key={status.value}
                            onClick={() => toggleRecordStatus(record.id, status.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
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
