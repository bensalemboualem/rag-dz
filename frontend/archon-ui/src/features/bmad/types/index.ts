export interface BMADAgent {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'builder' | 'creative';
  icon: string;
}

export interface BMADWorkflow {
  id: string;
  name: string;
  description: string;
  agent: string;
  icon: string;
}

export interface WorkflowExecution {
  id: string;
  name: string;
  agent: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
  output?: string;
  error?: string;
}

export interface ExecuteWorkflowRequest {
  name: string;
  description?: string;
  agent: string;
  command?: string;
  parameters?: Record<string, any>;
}
