/**
 * SMSStats Component
 * Display SMS statistics and delivery rates
 */

import { useState, useEffect } from 'react';
import { TrendingUp, Send, CheckCheck, XCircle, Loader2 } from 'lucide-react';
import { getSMSStats, getMockStats } from '../services/twilioService';
import type { SMSStats as Stats } from '../types';

interface SMSStatsProps {
  className?: string;
}

export function SMSStats({ className = '' }: SMSStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSMSStats();
        setStats(data);
      } catch {
        setStats(getMockStats());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-green-400" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: 'Envoyés ce mois',
      value: stats.thisMonth.sent,
      icon: <Send className="w-5 h-5" />,
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      label: 'Livrés',
      value: stats.thisMonth.delivered,
      icon: <CheckCheck className="w-5 h-5" />,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'Échecs',
      value: stats.thisMonth.failed,
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-400 bg-red-500/10',
    },
    {
      label: 'Taux de livraison',
      value: `${stats.deliveryRate.toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-amber-400 bg-amber-500/10',
    },
  ];

  // Calculate max for chart scaling
  const maxValue = Math.max(...stats.byDay.map((d) => d.sent), 1);

  return (
    <div className={className}>
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Activité des 7 derniers jours
        </h3>

        <div className="flex items-end gap-2 h-32">
          {stats.byDay.map((day) => {
            const height = (day.sent / maxValue) * 100;
            const deliveredHeight = day.sent > 0 ? (day.delivered / day.sent) * height : 0;
            const failedHeight = day.sent > 0 ? (day.failed / day.sent) * height : 0;

            const date = new Date(day.date);
            const dayLabel = date.toLocaleDateString('fr-FR', { weekday: 'short' });

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full relative rounded-t"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${day.sent} envoyés, ${day.delivered} livrés, ${day.failed} échecs`}
                >
                  {/* Delivered (green) */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/60 rounded-t"
                    style={{ height: `${deliveredHeight}%` }}
                  />
                  {/* Failed (red) */}
                  {failedHeight > 0 && (
                    <div
                      className="absolute left-0 right-0 bg-red-500/60"
                      style={{
                        bottom: `${deliveredHeight}%`,
                        height: `${failedHeight}%`,
                      }}
                    />
                  )}
                </div>
                <span className="text-xs text-gray-500">{dayLabel}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500/60" />
            <span className="text-xs text-gray-500">Livrés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/60" />
            <span className="text-xs text-gray-500">Échecs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
