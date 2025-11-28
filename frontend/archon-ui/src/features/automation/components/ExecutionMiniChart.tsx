/**
 * ExecutionMiniChart Component
 * Mini bar chart showing executions for the last 7 days
 */

import type { DailyExecution } from '../types';

interface ExecutionMiniChartProps {
  data: DailyExecution[];
  className?: string;
}

export function ExecutionMiniChart({ data, className = '' }: ExecutionMiniChartProps) {
  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.success + d.error), 1);

  return (
    <div className={`flex items-end gap-1 h-8 ${className}`}>
      {data.map((day, index) => {
        const total = day.success + day.error;
        const height = Math.max((total / maxValue) * 100, 5);
        const successRatio = total > 0 ? (day.success / total) * 100 : 100;

        return (
          <div
            key={day.date}
            className="flex-1 flex flex-col justify-end"
            title={`${day.date}: ${day.success} succès, ${day.error} erreurs`}
          >
            <div
              className="w-full rounded-t-sm relative overflow-hidden"
              style={{ height: `${height}%` }}
            >
              {/* Success portion */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-emerald-500/60"
                style={{ height: `${successRatio}%` }}
              />
              {/* Error portion */}
              {day.error > 0 && (
                <div
                  className="absolute top-0 left-0 right-0 bg-red-500/60"
                  style={{ height: `${100 - successRatio}%` }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
