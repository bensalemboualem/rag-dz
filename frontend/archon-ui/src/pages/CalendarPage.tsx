/**
 * CalendarPage
 * Page component for /calendar route - Gestion des rendez-vous
 */

import { useState } from 'react';
import { Calendar, Plus, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  endTime: string;
  patientName: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

// Mock data
const mockAppointments: Appointment[] = [
  { id: '1', date: '2025-01-21', time: '09:00', endTime: '09:30', patientName: 'M. Dupont', type: 'Consultation', status: 'confirmed' },
  { id: '2', date: '2025-01-21', time: '10:30', endTime: '11:00', patientName: 'Mme Martin', type: 'Suivi', status: 'confirmed' },
  { id: '3', date: '2025-01-21', time: '14:00', endTime: '14:30', patientName: 'M. Bernard', type: 'Premiere visite', status: 'pending' },
  { id: '4', date: '2025-01-22', time: '09:00', endTime: '09:30', patientName: 'Mme Petit', type: 'Controle', status: 'confirmed' },
  { id: '5', date: '2025-01-22', time: '11:00', endTime: '11:30', patientName: 'M. Durand', type: 'Consultation', status: 'confirmed' },
];

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments] = useState<Appointment[]>(mockAppointments);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const todayAppointments = appointments.filter(apt => apt.date === formatDateKey(selectedDate));

  const navigateDay = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const statusColors = {
    confirmed: 'bg-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const statusLabels = {
    confirmed: 'Confirme',
    pending: 'En attente',
    cancelled: 'Annule',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rendez-vous</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gestion de votre agenda</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau RDV
          </button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 mb-6">
          <button
            onClick={() => navigateDay(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {formatDate(selectedDate)}
            </p>
            <p className="text-sm text-gray-500">
              {todayAppointments.length} rendez-vous
            </p>
          </div>
          <button
            onClick={() => navigateDay(1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Appointments List */}
        <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Agenda du jour
            </h3>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun rendez-vous pour cette date</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Time */}
                    <div className="flex-shrink-0 text-center w-20">
                      <p className="text-sm font-semibold text-blue-500">{apt.time}</p>
                      <p className="text-xs text-gray-500">{apt.endTime}</p>
                    </div>

                    {/* Divider */}
                    <div className="w-1 h-12 rounded-full bg-blue-500" />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">{apt.patientName}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{apt.type}</p>
                    </div>

                    {/* Status */}
                    <span className={`px-3 py-1 text-xs rounded-full ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
