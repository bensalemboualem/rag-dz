/**
 * VoiceAgentWidget Component
 * Voice agent status and mini stats
 */

import { useState, useEffect } from 'react';
import { Phone, PhoneCall, Clock, Loader2 } from 'lucide-react';

interface VoiceAgentStats {
  status: 'active' | 'inactive' | 'busy';
  callsToday: number;
  callsHandled: number;
  averageDuration: string;
  lastCall?: string;
  missedCalls: number;
}

interface VoiceAgentWidgetProps {
  className?: string;
}

function getMockStats(): VoiceAgentStats {
  return {
    status: 'active',
    callsToday: 8,
    callsHandled: 7,
    averageDuration: '2m 34s',
    lastCall: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    missedCalls: 1,
  };
}

function formatLastCall(dateStr?: string): string {
  if (!dateStr) return 'Aucun appel';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return date.toLocaleDateString('fr-FR');
}

export function VoiceAgentWidget({ className = '' }: VoiceAgentWidgetProps) {
  const [stats, setStats] = useState<VoiceAgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats(getMockStats());
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4 ${className}`}>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statusConfig = {
    active: {
      label: 'Actif',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      pulse: true,
    },
    inactive: {
      label: 'Inactif',
      color: 'text-gray-400',
      bg: 'bg-gray-500/20',
      pulse: false,
    },
    busy: {
      label: 'En appel',
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      pulse: true,
    },
  };

  const status = statusConfig[stats.status];

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-purple-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Agent Vocal
          </h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}>
          <span
            className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-')} ${
              status.pulse ? 'animate-pulse' : ''
            }`}
          />
          <span className={`text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
            <PhoneCall className="w-3 h-3" />
            <span className="text-xs">Appels traités</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.callsHandled}
          </p>
          <p className="text-xs text-gray-500">sur {stats.callsToday} reçus</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-xs">Durée moy.</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.averageDuration}
          </p>
          <p className="text-xs text-gray-500">par appel</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <Clock className="w-3 h-3 inline mr-1" />
          Dernier appel: {formatLastCall(stats.lastCall)}
        </div>
        {stats.missedCalls > 0 && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
            {stats.missedCalls} manqué{stats.missedCalls > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
