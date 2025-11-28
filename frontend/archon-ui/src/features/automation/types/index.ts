/**
 * n8n Automation Types
 */

export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes?: WorkflowNode[];
  tags?: WorkflowTag[];
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
}

export interface WorkflowTag {
  id: string;
  name: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  workflowName?: string;
  finished: boolean;
  mode: 'trigger' | 'manual' | 'webhook' | 'cli';
  startedAt: string;
  stoppedAt?: string;
  status: 'success' | 'error' | 'running' | 'waiting';
  data?: ExecutionData;
}

export interface ExecutionData {
  resultData?: {
    runData?: Record<string, unknown>;
    error?: {
      message: string;
      stack?: string;
    };
  };
}

export interface WorkflowStats {
  totalExecutions: number;
  successCount: number;
  errorCount: number;
  lastExecution?: string;
  executionsPerDay: DailyExecution[];
}

export interface DailyExecution {
  date: string;
  success: number;
  error: number;
}

export type WorkflowStatus = 'active' | 'paused' | 'error';
