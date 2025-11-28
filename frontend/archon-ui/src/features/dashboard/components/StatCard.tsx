/**
 * StatCard Component
 * Metric card with icon and trend indicator
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  loading?: boolean;
  onClick?: () => void;
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  green: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  loading = false,
  onClick,
}: StatCardProps) {
  const colors = colorConfig[color];

  if (loading) {
    return (
      <div className="rounded-xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-zinc-800" />
          <div className="flex-1">
            <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-6 w-12 bg-gray-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm transition-all duration-200 hover:border-opacity-50 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      } hover:${colors.border}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs ${
              trend.value > 0
                ? 'text-emerald-400'
                : trend.value < 0
                ? 'text-red-400'
                : 'text-gray-400'
            }`}
          >
            {trend.value > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend.value < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      {trend && (
        <p className="text-xs text-gray-500 mt-2">{trend.label}</p>
      )}
    </div>
  );
}
