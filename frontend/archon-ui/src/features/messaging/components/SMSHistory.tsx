/**
 * SMSHistory Component
 * Display SMS message history with status indicators
 */

import { useState, useEffect } from 'react';
import { RefreshCw, Check, CheckCheck, X, Clock, Loader2 } from 'lucide-react';
import { getMessageHistory, getMockHistory } from '../services/twilioService';
import type { SMSMessage, SMSStatus } from '../types';

interface SMSHistoryProps {
  limit?: number;
  className?: string;
}

const statusConfig: Record<SMSStatus, { icon: React.ReactNode; label: string; color: string }> = {
  queued: {
    icon: <Clock className="w-3 h-3" />,
    label: 'En attente',
    color: 'text-gray-400',
  },
  sending: {
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    label: 'Envoi...',
    color: 'text-blue-400',
  },
  sent: {
    icon: <Check className="w-3 h-3" />,
    label: 'Envoyé',
    color: 'text-gray-400',
  },
  delivered: {
    icon: <CheckCheck className="w-3 h-3" />,
    label: 'Livré',
    color: 'text-emerald-400',
  },
  read: {
    icon: <CheckCheck className="w-3 h-3" />,
    label: 'Lu',
    color: 'text-blue-400',
  },
  undelivered: {
    icon: <X className="w-3 h-3" />,
    label: 'Non livré',
    color: 'text-amber-400',
  },
  failed: {
    icon: <X className="w-3 h-3" />,
    label: 'Échec',
    color: 'text-red-400',
  },
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPhone(phone: string): string {
  // Format +213XXXXXXXXX to +213 XXX XX XX XX
  if (phone.startsWith('+213') && phone.length === 13) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)} ${phone.slice(11)}`;
  }
  return phone;
}

export function SMSHistory({ limit = 20, className = '' }: SMSHistoryProps) {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMessageHistory(limit);
      setMessages(data.messages);
    } catch (err) {
      // Use mock data in development
      setMessages(getMockHistory());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [limit]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Historique SMS
        </h3>
        <button
          onClick={loadMessages}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="divide-y divide-gray-200 dark:divide-zinc-800 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p className="text-sm">Aucun SMS envoyé</p>
          </div>
        ) : (
          messages.map((msg) => {
            const status = statusConfig[msg.status];

            return (
              <div key={msg.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Recipient */}
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPhone(msg.to)}
                    </p>

                    {/* Message bubble */}
                    <div className="mt-2 inline-block max-w-full">
                      <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-green-500 text-white text-sm">
                        {msg.body}
                      </div>
                    </div>

                    {/* Status and time */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 ${status.color}`}>
                        {status.icon}
                        <span className="text-xs">{status.label}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    {/* Error message */}
                    {msg.errorMessage && (
                      <p className="mt-1 text-xs text-red-400">
                        {msg.errorMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
