/**
 * AutomationView Component
 * Main view for the automation/n8n integration page
 */

import { ExternalLink, Zap } from 'lucide-react';
import { WorkflowList } from '../components/WorkflowList';
import { ExecutionLogs } from '../components/ExecutionLogs';
import { getN8nUrl } from '../services/n8nService';

export function AutomationView() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30">
            <Zap className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Automatisations
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gérez vos workflows n8n et leurs exécutions
            </p>
          </div>
        </div>

        <a
          href={getN8nUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-colors"
        >
          <span>Ouvrir n8n</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Workflows Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Workflows actifs
        </h2>
        <WorkflowList />
      </section>

      {/* Execution Logs Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Exécutions récentes
        </h2>
        <div className="bg-white/5 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
          <ExecutionLogs limit={15} />
        </div>
      </section>
    </div>
  );
}
