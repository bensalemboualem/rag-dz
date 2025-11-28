/**
 * AgendaWidget Component
 * Today's appointments scrollable list
 */

import { useState, useEffect } from 'react';
import { Calendar, User, Loader2, ExternalLink } from 'lucide-react';

interface Appointment {
  id: string;
  time: string;
  endTime: string;
  patientName: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  location?: string;
}

interface AgendaWidgetProps {
  className?: string;
}

function getMockAppointments(): Appointment[] {
  return [
    {
      id: '1',
      time: '09:00',
      endTime: '09:30',
      patientName: 'M. Dupont',
      type: 'Consultation',
      status: 'confirmed',
    },
    {
      id: '2',
      time: '10:30',
      endTime: '11:00',
      patientName: 'Mme Martin',
      type: 'Suivi',
      status: 'confirmed',
    },
    {
      id: '3',
      time: '11:30',
      endTime: '12:00',
      patientName: 'M. Bernard',
      type: 'Première visite',
      status: 'pending',
    },
    {
      id: '4',
      time: '14:00',
      endTime: '14:30',
      patientName: 'Mme Petit',
      type: 'Contrôle',
      status: 'confirmed',
    },
    {
      id: '5',
      time: '15:30',
      endTime: '16:00',
      patientName: 'M. Durand',
      type: 'Consultation',
      status: 'confirmed',
    },
  ];
}

function isCurrentAppointment(time: string, endTime: string): boolean {
  const now = new Date();
  const [hours, mins] = time.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);

  const startDate = new Date();
  startDate.setHours(hours, mins, 0);

  const endDate = new Date();
  endDate.setHours(endHours, endMins, 0);

  return now >= startDate && now <= endDate;
}

function isPastAppointment(endTime: string): boolean {
  const now = new Date();
  const [hours, mins] = endTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours, mins, 0);
  return now > endDate;
}

export function AgendaWidget({ className = '' }: AgendaWidgetProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(getMockAppointments());
      setLoading(false);
    }, 500);
  }, []);

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  if (loading) {
    return (
      <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Agenda du jour
            </h3>
            <p className="text-xs text-gray-500 capitalize">{today}</p>
          </div>
        </div>
        <a
          href="/calendar"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Voir tout
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Appointments */}
      <div className="max-h-64 overflow-y-auto">
        {appointments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p className="text-sm">Aucun RDV aujourd'hui</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {appointments.map((apt) => {
              const isCurrent = isCurrentAppointment(apt.time, apt.endTime);
              const isPast = isPastAppointment(apt.endTime);

              return (
                <div
                  key={apt.id}
                  className={`px-4 py-3 flex items-center gap-3 transition-colors ${
                    isCurrent
                      ? 'bg-blue-500/10 border-l-2 border-blue-500'
                      : isPast
                      ? 'opacity-50'
                      : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 text-center w-14">
                    <p className={`text-sm font-semibold ${isCurrent ? 'text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {apt.time}
                    </p>
                    <p className="text-xs text-gray-500">{apt.endTime}</p>
                  </div>

                  {/* Divider */}
                  <div className={`w-0.5 h-10 rounded-full ${
                    isCurrent ? 'bg-blue-500' : 'bg-gray-300 dark:bg-zinc-700'
                  }`} />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {apt.patientName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{apt.type}</p>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {apt.status === 'confirmed' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                        Confirmé
                      </span>
                    )}
                    {apt.status === 'pending' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                        En attente
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
