/**
 * n8n API Service
 * Handles communication with n8n workflow automation
 */

import type { Workflow, Execution, WorkflowStats, DailyExecution } from '../types';

const N8N_HOST = import.meta.env.VITE_N8N_HOST || 'http://localhost:5678';
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY || '';

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (N8N_API_KEY) {
    headers['X-N8N-API-KEY'] = N8N_API_KEY;
  }
  return headers;
};

/**
 * Get all workflows from n8n
 */
export async function getWorkflows(): Promise<Workflow[]> {
  try {
    const response = await fetch(`${N8N_HOST}/api/v1/workflows`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching workflows:', error);
    // Return mock data for development
    return getMockWorkflows();
  }
}

/**
 * Get a single workflow by ID
 */
export async function getWorkflow(id: string): Promise<Workflow | null> {
  try {
    const response = await fetch(`${N8N_HOST}/api/v1/workflows/${id}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workflow: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return null;
  }
}

/**
 * Trigger a workflow manually
 */
export async function triggerWorkflow(id: string, data?: Record<string, unknown>): Promise<Execution | null> {
  try {
    const response = await fetch(`${N8N_HOST}/api/v1/workflows/${id}/execute`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger workflow: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return null;
  }
}

/**
 * Activate or deactivate a workflow
 */
export async function setWorkflowActive(id: string, active: boolean): Promise<boolean> {
  try {
    const endpoint = active ? 'activate' : 'deactivate';
    const response = await fetch(`${N8N_HOST}/api/v1/workflows/${id}/${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error('Error setting workflow active state:', error);
    return false;
  }
}

/**
 * Get execution logs for a workflow
 */
export async function getExecutionLogs(workflowId?: string, limit = 50): Promise<Execution[]> {
  try {
    let url = `${N8N_HOST}/api/v1/executions?limit=${limit}`;
    if (workflowId) {
      url += `&workflowId=${workflowId}`;
    }

    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch executions: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching executions:', error);
    // Return mock data for development
    return getMockExecutions();
  }
}

/**
 * Get workflow statistics for the last 7 days
 */
export async function getWorkflowStats(workflowId: string): Promise<WorkflowStats> {
  const executions = await getExecutionLogs(workflowId, 100);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentExecutions = executions.filter(
    (e) => new Date(e.startedAt) >= sevenDaysAgo
  );

  // Group by day
  const executionsPerDay: DailyExecution[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    const dayExecutions = recentExecutions.filter(
      (e) => e.startedAt.startsWith(dateStr)
    );

    executionsPerDay.push({
      date: dateStr,
      success: dayExecutions.filter((e) => e.status === 'success').length,
      error: dayExecutions.filter((e) => e.status === 'error').length,
    });
  }

  return {
    totalExecutions: recentExecutions.length,
    successCount: recentExecutions.filter((e) => e.status === 'success').length,
    errorCount: recentExecutions.filter((e) => e.status === 'error').length,
    lastExecution: executions[0]?.startedAt,
    executionsPerDay,
  };
}

/**
 * Check n8n connection status
 */
export async function checkN8nHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${N8N_HOST}/healthz`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get n8n URL for external access
 */
export function getN8nUrl(): string {
  return N8N_HOST;
}

// Mock data for development when n8n is not available
function getMockWorkflows(): Workflow[] {
  return [
    {
      id: '1',
      name: 'Rappel RDV (24h avant)',
      active: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ id: '1', name: 'SMS' }, { id: '2', name: 'Twilio' }],
    },
    {
      id: '2',
      name: 'Nouveau RDV Cal.com',
      active: true,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ id: '3', name: 'Webhook' }, { id: '4', name: 'Calendar' }],
    },
    {
      id: '3',
      name: 'Email Auto-Reply',
      active: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ id: '5', name: 'Email' }, { id: '6', name: 'AI' }],
    },
  ];
}

function getMockExecutions(): Execution[] {
  const statuses: Execution['status'][] = ['success', 'success', 'error', 'success'];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `exec-${i + 1}`,
    workflowId: `${(i % 3) + 1}`,
    workflowName: ['Rappel RDV', 'Nouveau RDV', 'Email Auto'][i % 3],
    finished: true,
    mode: 'trigger' as const,
    startedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
    stoppedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000 + 5000).toISOString(),
    status: statuses[i % 4],
  }));
}
