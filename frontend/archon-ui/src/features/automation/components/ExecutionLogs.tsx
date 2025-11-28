/**
 * ExecutionLogs Component
 * Displays recent workflow execution logs
 */

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2, ExternalLink } from 'lucide-react';
import type { Execution } from '../types';
import { getExecutionLogs, getN8nUrl } from '../services/n8nService';

interface ExecutionLogsProps {
  workflowId?: string;
  limit?: number;
  className?: string;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDuration(start: string, end?: string): string {
  if (!end) return '...';
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();

  if (diffMs < 1000) return `${diffMs}ms`;
  if (diffMs < 60000) return `${Math.round(diffMs / 1000)}s`;
  return `${Math.round(diffMs / 60000)}min`;
}

export function ExecutionLogs({ workflowId, limit = 10, className = '' }: ExecutionLogsProps) {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getExecutionLogs(workflowId, limit);
      setExecutions(data);
      setLoading(false);
    };
    load();
  }, [workflowId, limit]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className={`text-center py-4 text-gray-500 ${className}`}>
        Aucune exécution récente
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {executions.map((execution) => (
          <a
            key={execution.id}
            href={`${getN8nUrl()}/execution/${execution.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 hover:border-blue-500/30 transition-all group"
          >
            {/* Status icon */}
            <div className="flex-shrink-0">
              {execution.status === 'success' && (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              )}
              {execution.status === 'error' && (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              {execution.status === 'running' && (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              )}
              {execution.status === 'waiting' && (
                <Clock className="w-5 h-5 text-amber-400" />
              )}
            </div>

            {/* Workflow name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {execution.workflowName || `Workflow ${execution.workflowId}`}
              </p>
              <p className="text-xs text-gray-500">
                {formatTime(execution.startedAt)}
              </p>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{getDuration(execution.startedAt, execution.stoppedAt)}</span>
            </div>

            {/* External link icon */}
            <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}
