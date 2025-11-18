import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import type { BMADWorkflow } from '../types';

interface WorkflowCardProps {
  workflow: BMADWorkflow;
  onExecute: (workflow: BMADWorkflow) => void;
}

export function WorkflowCard({ workflow, onExecute }: WorkflowCardProps) {
  const { t } = useTranslation();

  return (
    <div className="relative p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 hover:from-white/10 hover:to-black/10 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{workflow.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{workflow.name}</h3>
          <p className="text-sm text-gray-400 mb-4">{workflow.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Agent:</span>
            <span className="px-2 py-1 bg-white/10 rounded">{workflow.agent}</span>
          </div>
        </div>
        <button
          onClick={() => onExecute(workflow)}
          className="
            p-3 rounded-lg
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:from-blue-600 hover:to-cyan-600
            text-white
            transition-all duration-300
            hover:scale-110
            group-hover:shadow-lg group-hover:shadow-blue-500/50
          "
        >
          <Play className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
