/**
 * WorkflowCard Component
 * Displays a workflow with status, stats, and actions
 */

import { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Mail,
  Zap,
  Clock,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { Workflow, WorkflowStats } from '../types';
import { WorkflowStatus } from './WorkflowStatus';
import { TriggerButton } from './TriggerButton';
import { ExecutionMiniChart } from './ExecutionMiniChart';
import { getWorkflowStats, setWorkflowActive, getN8nUrl } from '../services/n8nService';

interface WorkflowCardProps {
  workflow: Workflow;
  onRefresh?: () => void;
}

// Icon mapping based on workflow name/tags
function getWorkflowIcon(workflow: Workflow) {
  const name = workflow.name.toLowerCase();
  const tags = workflow.tags?.map((t) => t.name.toLowerCase()) || [];

  if (name.includes('rappel') || name.includes('reminder')) {
    return <Bell className="w-5 h-5" />;
  }
  if (name.includes('rdv') || name.includes('calendar') || tags.includes('calendar')) {
    return <Calendar className="w-5 h-5" />;
  }
  if (name.includes('email') || name.includes('mail') || tags.includes('email')) {
    return <Mail className="w-5 h-5" />;
  }
  return <Zap className="w-5 h-5" />;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR');
}

export function WorkflowCard({ workflow, onRefresh }: WorkflowCardProps) {
  const [stats, setStats] = useState<WorkflowStats | null>(null);
  const [isActive, setIsActive] = useState(workflow.active);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    getWorkflowStats(workflow.id).then(setStats);
  }, [workflow.id]);

  const handleToggleActive = async () => {
    if (toggling) return;
    setToggling(true);

    const success = await setWorkflowActive(workflow.id, !isActive);
    if (success) {
      setIsActive(!isActive);
      onRefresh?.();
    }

    setToggling(false);
  };

  return (
    <div className="bg-white/5 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 hover:border-blue-500/30 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            {getWorkflowIcon(workflow)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {workflow.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <WorkflowStatus active={isActive} />
              {workflow.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={handleToggleActive}
          disabled={toggling}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title={isActive ? 'Désactiver' : 'Activer'}
        >
          {isActive ? (
            <ToggleRight className="w-6 h-6 text-emerald-400" />
          ) : (
            <ToggleLeft className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-3">
          <ExecutionMiniChart data={stats.executionsPerDay} />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {stats.successCount} succès, {stats.errorCount} erreurs (7j)
            </span>
            {stats.lastExecution && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(stats.lastExecution)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-zinc-800">
        <TriggerButton
          workflowId={workflow.id}
          workflowName={workflow.name}
          disabled={!isActive}
          onTriggered={() => {
            // Refresh stats after trigger
            setTimeout(() => getWorkflowStats(workflow.id).then(setStats), 2000);
          }}
        />

        <a
          href={`${getN8nUrl()}/workflow/${workflow.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400 transition-colors"
        >
          <span>Éditer dans n8n</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
