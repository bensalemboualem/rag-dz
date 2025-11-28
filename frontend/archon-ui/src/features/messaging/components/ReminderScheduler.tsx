/**
 * ReminderScheduler Component
 * Schedule SMS reminders for future dates
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, Loader2, Trash2 } from 'lucide-react';
import { scheduleReminder, getScheduledReminders, cancelReminder } from '../services/twilioService';
import { TemplateSelector } from './TemplateSelector';
import { renderTemplate } from '../services/twilioService';
import type { SMSTemplate, ScheduledReminder } from '../types';

interface ReminderSchedulerProps {
  className?: string;
}

export function ReminderScheduler({ className = '' }: ReminderSchedulerProps) {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | undefined>();
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await getScheduledReminders('pending');
      setReminders(data);
    } catch {
      // Mock data
      setReminders([
        {
          id: '1',
          to: '+213555123456',
          message: 'Rappel: Votre RDV est prévu demain à 14h00.',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          to: '+213555789012',
          message: 'Votre RDV du 20/01 à 10h00 est confirmé.',
          scheduledAt: new Date(Date.now() + 172800000).toISOString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleTemplateSelect = (template: SMSTemplate) => {
    setSelectedTemplate(template);
    setMessage(template.body);
    const vars: Record<string, string> = {};
    template.variables.forEach((v) => (vars[v] = ''));
    setTemplateVars(vars);
  };

  const handleVarChange = (key: string, value: string) => {
    const newVars = { ...templateVars, [key]: value };
    setTemplateVars(newVars);
    if (selectedTemplate) {
      setMessage(renderTemplate(selectedTemplate.body, newVars));
    }
  };

  const handleSchedule = async () => {
    if (!to.trim() || !message.trim() || !scheduledDate || !scheduledTime) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      await scheduleReminder({
        to: to.trim(),
        message: message.trim(),
        scheduledAt,
        templateId: selectedTemplate?.id,
        templateVars,
      });

      setTo('');
      setMessage('');
      setScheduledDate('');
      setScheduledTime('');
      setSelectedTemplate(undefined);
      setTemplateVars({});
      loadReminders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de programmation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // Remove from local state anyway for demo
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const formatScheduledTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Scheduler Form */}
      <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-amber-400" />
          Programmer un rappel
        </h3>

        <div className="space-y-4">
          {/* Template */}
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelect={handleTemplateSelect}
          />

          {/* Template Variables */}
          {selectedTemplate && selectedTemplate.variables.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedTemplate.variables.map((v) => (
                <div key={v}>
                  <label className="text-xs text-gray-500 mb-1 block">{v}</label>
                  <input
                    type="text"
                    value={templateVars[v] || ''}
                    onChange={(e) => handleVarChange(v, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Destinataire</label>
            <input
              type="tel"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="+213 5XX XX XX XX"
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm resize-none"
            />
          </div>

          {/* Date/Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={minDate}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Heure</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            onClick={handleSchedule}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            <span>Programmer</span>
          </button>
        </div>
      </div>

      {/* Scheduled Reminders List */}
      <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Rappels programmés ({reminders.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          </div>
        ) : reminders.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p className="text-sm">Aucun rappel programmé</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {reminder.to}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {reminder.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatScheduledTime(reminder.scheduledAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(reminder.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                  title="Annuler"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
