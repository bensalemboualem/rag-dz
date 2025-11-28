/**
 * CalendarPreview Component
 * Mini calendar showing today's events
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Loader2, RefreshCw } from 'lucide-react';
import { getTodayEvents, isGoogleConnected } from '../services/googleService';
import type { CalendarEvent } from '../types';

interface CalendarPreviewProps {
  className?: string;
}

function formatTime(dateTimeStr?: string, dateStr?: string): string {
  if (dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  if (dateStr) {
    return 'Journée entière';
  }
  return '';
}

function formatTimeRange(event: CalendarEvent): string {
  const start = formatTime(event.start.dateTime, event.start.date);
  const end = formatTime(event.end.dateTime, event.end.date);

  if (start === 'Journée entière') return start;
  return `${start} - ${end}`;
}

export function CalendarPreview({ className = '' }: CalendarPreviewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    if (!isGoogleConnected()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getTodayEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (!isGoogleConnected()) {
    return (
      <div className={`p-4 rounded-lg bg-gray-100 dark:bg-zinc-800/50 text-center ${className}`}>
        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Connectez Google Calendar</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-red-500/10 border border-red-500/30 ${className}`}>
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={loadEvents} className="mt-2 text-xs text-red-400 underline">
          Réessayer
        </button>
      </div>
    );
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-gray-900 dark:text-white capitalize">{dateStr}</span>
        </div>
        <button
          onClick={loadEvents}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Events */}
      <div className="p-2">
        {events.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <p className="text-sm">Aucun événement aujourd'hui</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <a
                key={event.id}
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Time indicator */}
                  <div className="flex-shrink-0 w-1 h-full rounded-full bg-blue-500" />

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-400 transition-colors">
                      {event.summary}
                    </h4>

                    {/* Time */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeRange(event)}</span>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {/* Attendees */}
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees.length} participant(s)</span>
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  {event.status === 'tentative' && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                      Provisoire
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
