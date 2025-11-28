/**
 * WorkflowList Component
 * Displays list of automation workflows
 */

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import type { Workflow } from '../types';
import { getWorkflows, checkN8nHealth } from '../services/n8nService';
import { WorkflowCard } from './WorkflowCard';

interface WorkflowListProps {
  className?: string;
}

export function WorkflowList({ className = '' }: WorkflowListProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [n8nHealthy, setN8nHealthy] = useState<boolean | null>(null);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check n8n health first
      const healthy = await checkN8nHealth();
      setN8nHealthy(healthy);

      // Load workflows
      const data = await getWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-500">Chargement des workflows...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-red-500/10 border border-red-500/30 ${className}`}>
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={loadWorkflows}
          className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
          </span>
          {n8nHealthy !== null && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                n8nHealthy
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  n8nHealthy ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {n8nHealthy ? 'n8n connecté' : 'n8n hors ligne'}
            </span>
          )}
        </div>
        <button
          onClick={loadWorkflows}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Workflow grid */}
      {workflows.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun workflow configuré</p>
          <p className="text-sm mt-1">
            Créez des workflows dans n8n pour les voir ici
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onRefresh={loadWorkflows}
            />
          ))}
        </div>
      )}
    </div>
  );
}
