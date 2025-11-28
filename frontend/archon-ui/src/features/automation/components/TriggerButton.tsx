/**
 * TriggerButton Component
 * Button to manually trigger a workflow
 */

import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { triggerWorkflow } from '../services/n8nService';

interface TriggerButtonProps {
  workflowId: string;
  workflowName: string;
  disabled?: boolean;
  onTriggered?: () => void;
  className?: string;
}

export function TriggerButton({
  workflowId,
  workflowName,
  disabled = false,
  onTriggered,
  className = '',
}: TriggerButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleTrigger = async () => {
    if (disabled || loading) return;

    setLoading(true);
    setSuccess(null);

    try {
      const result = await triggerWorkflow(workflowId);
      setSuccess(result !== null);
      onTriggered?.();
    } catch (error) {
      console.error('Failed to trigger workflow:', error);
      setSuccess(false);
    } finally {
      setLoading(false);
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  return (
    <button
      onClick={handleTrigger}
      disabled={disabled || loading}
      title={`Exécuter ${workflowName}`}
      className={`
        inline-flex items-center justify-center gap-2
        px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200
        ${
          success === true
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : success === false
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">
        {loading ? 'Exécution...' : success === true ? 'Lancé!' : success === false ? 'Erreur' : 'Exécuter'}
      </span>
    </button>
  );
}
