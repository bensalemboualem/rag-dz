import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader, Clock, X } from 'lucide-react';
import type { WorkflowExecution } from '../types';

interface WorkflowExecutionCardProps {
  execution: WorkflowExecution;
  onCancel?: (id: string) => void;
}

export function WorkflowExecutionCard({ execution, onCancel }: WorkflowExecutionCardProps) {
  const { t } = useTranslation();

  const statusIcons = {
    queued: <Clock className="w-5 h-5 text-gray-400 animate-pulse" />,
    running: <Loader className="w-5 h-5 text-blue-400 animate-spin" />,
    completed: <CheckCircle className="w-5 h-5 text-green-400" />,
    failed: <XCircle className="w-5 h-5 text-red-400" />,
    cancelled: <X className="w-5 h-5 text-gray-400" />,
  };

  const statusColors = {
    queued: 'border-gray-500/30 bg-gray-500/10',
    running: 'border-blue-500/30 bg-blue-500/10',
    completed: 'border-green-500/30 bg-green-500/10',
    failed: 'border-red-500/30 bg-red-500/10',
    cancelled: 'border-gray-500/30 bg-gray-500/10',
  };

  return (
    <div className={`p-4 rounded-lg border ${statusColors[execution.status]} transition-all duration-300`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{statusIcons[execution.status]}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{execution.name}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span>{execution.agent}</span>
            <span>•</span>
            <span>{new Date(execution.created_at).toLocaleTimeString()}</span>
          </div>

          {execution.output && (
            <div className="mt-2 p-3 rounded bg-black/30 text-sm text-gray-300 font-mono">
              {execution.output}
            </div>
          )}

          {execution.error && (
            <div className="mt-2 p-3 rounded bg-red-500/10 text-sm text-red-300">
              {execution.error}
            </div>
          )}
        </div>

        {(execution.status === 'running' || execution.status === 'queued') && onCancel && (
          <button
            onClick={() => onCancel(execution.id)}
            className="p-2 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}
