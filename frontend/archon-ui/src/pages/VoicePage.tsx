/**
 * VoicePage
 * Page component for /voice route - Agent Vocal Vapi.ai
 */

import { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOff, Settings, Clock, TrendingUp } from 'lucide-react';

interface CallLog {
  id: string;
  from: string;
  duration: string;
  status: 'completed' | 'missed' | 'failed';
  timestamp: string;
  summary?: string;
}

export function VoicePage() {
  const [isAgentActive, setIsAgentActive] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [stats] = useState({
    callsToday: 8,
    callsHandled: 7,
    averageDuration: '2m 34s',
    missedCalls: 1,
  });

  useEffect(() => {
    // Mock call logs
    setCallLogs([
      { id: '1', from: '+213 555 123 456', duration: '3m 12s', status: 'completed', timestamp: 'Il y a 23min', summary: 'Demande de RDV pour consultation' },
      { id: '2', from: '+213 555 789 012', duration: '1m 45s', status: 'completed', timestamp: 'Il y a 1h', summary: 'Question sur horaires' },
      { id: '3', from: '+213 555 345 678', duration: '-', status: 'missed', timestamp: 'Il y a 2h' },
      { id: '4', from: '+213 555 901 234', duration: '4m 22s', status: 'completed', timestamp: 'Il y a 3h', summary: 'Annulation RDV et reprogrammation' },
      { id: '5', from: '+213 555 567 890', duration: '2m 08s', status: 'completed', timestamp: 'Hier', summary: 'Confirmation RDV' },
    ]);
  }, []);

  const statusConfig = {
    completed: { color: 'text-emerald-400 bg-emerald-500/20', label: 'Termine' },
    missed: { color: 'text-red-400 bg-red-500/20', label: 'Manque' },
    failed: { color: 'text-amber-400 bg-amber-500/20', label: 'Echec' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Phone className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Vocal</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Vapi.ai</p>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isAgentActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isAgentActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
              {isAgentActive ? 'Actif' : 'Inactif'}
            </span>
            <button
              onClick={() => setIsAgentActive(!isAgentActive)}
              className={`p-3 rounded-lg transition-colors ${
                isAgentActive
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isAgentActive ? <PhoneOff className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <PhoneCall className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.callsToday}</p>
                <p className="text-xs text-gray-500">Appels aujourd'hui</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.callsHandled}</p>
                <p className="text-xs text-gray-500">Appels traites</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageDuration}</p>
                <p className="text-xs text-gray-500">Duree moyenne</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <PhoneOff className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.missedCalls}</p>
                <p className="text-xs text-gray-500">Appels manques</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call Logs */}
        <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Historique des appels</h3>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {callLogs.map((log) => {
              const status = statusConfig[log.status];
              return (
                <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${status.color}`}>
                      {log.status === 'completed' ? (
                        <PhoneCall className="w-4 h-4" />
                      ) : (
                        <PhoneOff className="w-4 h-4" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">{log.from}</p>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                      {log.summary && (
                        <p className="text-sm text-gray-500 mt-1">{log.summary}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                        {log.duration !== '-' && (
                          <span className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {log.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
