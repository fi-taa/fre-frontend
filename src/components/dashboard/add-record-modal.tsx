'use client';

import { useState } from 'react';
import type { RecordCategory } from '@/types';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; church: string; age: number; category: RecordCategory }) => void;
}

const categories: RecordCategory[] = ['ሰራተኛ', 'ወጣት', 'አዳጊ', 'ህጻናት'];

export function AddRecordModal({ isOpen, onClose, onAdd }: AddRecordModalProps) {
  const [name, setName] = useState('');
  const [church, setChurch] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState<RecordCategory>('ሰራተኛ');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!church.trim()) {
      setError('Church is required');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 0) {
      setError('Valid age is required');
      return;
    }

    onAdd({
      name: name.trim(),
      church: church.trim(),
      age: ageNum,
      category: category as RecordCategory,
    });

    setName('');
    setChurch('');
    setAge('');
    setCategory('ሰራተኛ');
    onClose();
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
      <div className="bg-card rounded-lg w-full max-w-md relative">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-lg"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Add New Record</h2>
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
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2 text-text-primary"
              >
                ስም
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="church"
                className="block text-sm font-medium mb-2 text-text-primary"
              >
                ደብር
              </label>
              <input
                id="church"
                type="text"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                placeholder="Enter church"
                required
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium mb-2 text-text-primary"
              >
                እድሜ
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                placeholder="Enter age"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2 text-text-primary"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as RecordCategory)}
                className="w-full min-h-[44px] px-4 rounded-lg border border-border/50 bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30 focus:border-link/30 transition-all duration-200"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-sm text-error">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] px-4 rounded-lg border border-border/50 text-text-primary hover:bg-bg-beige-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-link/20 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[44px] px-4 rounded-lg bg-accent text-text-light hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
              >
                Add Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
