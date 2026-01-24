'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/use-events';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RecordCategory } from '@/types';

const categories: RecordCategory[] = ['ሰራተኛ', 'ወጣት', 'አዳጊ', 'ህጻናት'];

export function EventManagement() {
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'ሰራተኛ' as RecordCategory,
    description: '',
  });
  const { events, addEvent, updateEventById, removeEvent } = useEvents();

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((event) => event.category === selectedCategory);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }

    if (editingEvent) {
      updateEventById(editingEvent, formData);
    } else {
      addEvent({
        ...formData,
        isDefault: false,
      });
    }

    setFormData({ name: '', category: 'ሰራተኛ', description: '' });
    setShowForm(false);
    setEditingEvent(null);
  }

  function handleEdit(eventId: string) {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setFormData({
        name: event.name,
        category: event.category,
        description: event.description || '',
      });
      setEditingEvent(eventId);
      setShowForm(true);
    }
  }

  function handleDelete(eventId: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      removeEvent(eventId);
    }
  }

  function handleCancel() {
    setFormData({ name: '', category: 'ሰራተኛ', description: '' });
    setShowForm(false);
    setEditingEvent(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Manage Events</h3>
        <div className="flex items-center gap-4">
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as RecordCategory | 'all')}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingEvent(null);
              setFormData({ name: '', category: 'ሰራተኛ', description: '' });
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            Add Event
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-card rounded-lg border border-border/30 p-6">
          <h4 className="text-md font-semibold text-text-primary mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium mb-2 text-text-primary">
                Event Name <span className="text-error">*</span>
              </label>
              <input
                id="eventName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
            <div>
              <label htmlFor="eventCategory" className="block text-sm font-medium mb-2 text-text-primary">
                Category <span className="text-error">*</span>
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as RecordCategory })}
                required
              >
                <SelectTrigger id="eventCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="eventDescription" className="block text-sm font-medium mb-2 text-text-primary">
                Description
              </label>
              <textarea
                id="eventDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-bg-beige-light text-text-primary focus:outline-none focus:ring-2 focus:ring-link/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-text-light hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {editingEvent ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border/40 hover:border-link/40 hover:bg-link/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-table-header border-b border-border/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Event Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    No events found
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border/30 hover:bg-bg-beige-light transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{event.name}</td>
                    <td className="px-4 py-3 text-sm text-text-primary">{event.category}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {event.description || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {event.isDefault ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Default
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!event.isDefault && (
                          <>
                            <button
                              onClick={() => handleEdit(event.id)}
                              className="text-link hover:text-link/80 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="text-error hover:text-error/80 text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {event.isDefault && (
                          <span className="text-text-muted text-sm">Read-only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
