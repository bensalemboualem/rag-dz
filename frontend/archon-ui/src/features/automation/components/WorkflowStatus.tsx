/**
 * WorkflowStatus Component
 * Displays workflow status with colored badge
 */

import type { WorkflowStatus as Status } from '../types';

interface WorkflowStatusProps {
  active: boolean;
  hasError?: boolean;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: 'Actif',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  paused: {
    label: 'Pause',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  error: {
    label: 'Erreur',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

export function WorkflowStatus({ active, hasError, className = '' }: WorkflowStatusProps) {
  const status: Status = hasError ? 'error' : active ? 'active' : 'paused';
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-xs font-medium rounded-full border
        ${config.className}
        ${className}
      `}
    >
      <span
        className={`
          w-1.5 h-1.5 rounded-full
          ${status === 'active' ? 'bg-emerald-400 animate-pulse' : ''}
          ${status === 'paused' ? 'bg-amber-400' : ''}
          ${status === 'error' ? 'bg-red-400' : ''}
        `}
      />
      {config.label}
    </span>
  );
}
