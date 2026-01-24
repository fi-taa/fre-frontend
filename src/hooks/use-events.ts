import { useState, useEffect } from 'react';
import { getEvents, saveEvent, deleteEvent, updateEvent } from '@/lib/storage';
import type { Event, RecordCategory } from '@/types';

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEventById: (id: string, data: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  getEventsByCategory: (category: RecordCategory) => Event[];
}

export function useEvents(category?: RecordCategory): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedEvents = getEvents(category);
    setEvents(loadedEvents);
    setIsLoading(false);
  }, [category]);

  function addEvent(eventData: Omit<Event, 'id' | 'createdAt'>) {
    const newEvent: Event = {
      ...eventData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveEvent(newEvent);
    setEvents((prev) => [...prev, newEvent]);
  }

  function updateEventById(id: string, data: Partial<Event>) {
    updateEvent(id, data);
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...data } : event))
    );
  }

  function removeEvent(id: string) {
    deleteEvent(id);
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }

  function getEventsByCategory(category: RecordCategory): Event[] {
    return events.filter((event) => event.category === category);
  }

  return {
    events,
    isLoading,
    addEvent,
    updateEventById,
    removeEvent,
    getEventsByCategory,
  };
}
