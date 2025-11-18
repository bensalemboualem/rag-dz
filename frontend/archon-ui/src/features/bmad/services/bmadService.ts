import { apiClient } from '../../shared/api/apiClient';
import type { BMADAgent, BMADWorkflow, WorkflowExecution, ExecuteWorkflowRequest } from '../types';

export const bmadService = {
  async listAgents(): Promise<{ agents: BMADAgent[]; total: number }> {
    const response = await apiClient.get('/api/bmad/agents');
    return response.data;
  },

  async listWorkflows(): Promise<{ workflows: BMADWorkflow[]; total: number }> {
    const response = await apiClient.get('/api/bmad/workflows');
    return response.data;
  },

  async getActiveWorkflows(): Promise<{ workflows: WorkflowExecution[]; total: number }> {
    const response = await apiClient.get('/api/bmad/workflows/active');
    return response.data;
  },

  async executeWorkflow(request: ExecuteWorkflowRequest): Promise<WorkflowExecution> {
    const response = await apiClient.post('/api/bmad/workflows/execute', request);
    return response.data;
  },

  async getWorkflowStatus(workflowId: string): Promise<WorkflowExecution> {
    const response = await apiClient.get(`/api/bmad/workflows/${workflowId}`);
    return response.data;
  },

  async cancelWorkflow(workflowId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/api/bmad/workflows/${workflowId}`);
    return response.data;
  },

  async getHealth(): Promise<{
    status: string;
    bmad_installed: boolean;
    node_version: string;
    active_workflows: number;
  }> {
    const response = await apiClient.get('/api/bmad/health');
    return response.data;
  },
};
