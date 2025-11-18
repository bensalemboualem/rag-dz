/**
 * BMAD Chat Service - Real conversation with BMAD agents using Claude API
 */

import { apiClient } from '../../shared/api/apiClient';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  agent_id: string;
  messages: ChatMessage[];
  temperature?: number;
}

export interface ChatResponse {
  message: string;
  agent_id: string;
  timestamp: string;
}

export const bmadChatService = {
  /**
   * Send a chat message to a BMAD agent
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/api/bmad/chat', request);
    return response.data;
  },

  /**
   * Get agent personality (for debugging)
   */
  async getAgentPersonality(agentId: string): Promise<{
    agent_id: string;
    personality: string;
    source: string;
  }> {
    const response = await apiClient.get(`/api/bmad/agents/${agentId}/personality`);
    return response.data;
  },

  /**
   * Health check for chat service
   */
  async health(): Promise<{
    status: string;
    claude_api: string;
    model: string;
    agents_loaded: number;
  }> {
    const response = await apiClient.get('/api/bmad/chat/health');
    return response.data;
  },
};
