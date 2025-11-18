import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Zap, Activity, MessageCircle } from 'lucide-react';
import { AgentCard } from '../components/AgentCard';
import { WorkflowCard } from '../components/WorkflowCard';
import { WorkflowExecutionCard } from '../components/WorkflowExecutionCard';
import { AgentChatInterface } from '../components/AgentChatInterface';
import { bmadService } from '../services/bmadService';
import type { BMADAgent, BMADWorkflow, WorkflowExecution } from '../types';

export function BMADView() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<BMADAgent[]>([]);
  const [workflows, setWorkflows] = useState<BMADWorkflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<BMADAgent | null>(null);
  const [chatAgent, setChatAgent] = useState<BMADAgent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadExecutions, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [agentsRes, workflowsRes, executionsRes] = await Promise.all([
        bmadService.listAgents(),
        bmadService.listWorkflows(),
        bmadService.getActiveWorkflows(),
      ]);
      setAgents(agentsRes.agents);
      setWorkflows(workflowsRes.workflows);
      setExecutions(executionsRes.workflows);
    } catch (error) {
      console.error('Failed to load BMAD data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadExecutions() {
    try {
      const res = await bmadService.getActiveWorkflows();
      setExecutions(res.workflows);
    } catch (error) {
      console.error('Failed to load executions:', error);
    }
  }

  async function handleExecuteWorkflow(workflow: BMADWorkflow) {
    try {
      const execution = await bmadService.executeWorkflow({
        name: workflow.name,
        agent: selectedAgent?.id || workflow.agent,
        description: workflow.description,
      });
      setExecutions([execution, ...executions]);
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    }
  }

  async function handleCancelWorkflow(id: string) {
    try {
      await bmadService.cancelWorkflow(id);
      await loadExecutions();
    } catch (error) {
      console.error('Failed to cancel workflow:', error);
    }
  }

  const filteredWorkflows = selectedAgent
    ? workflows.filter(w => w.agent === selectedAgent.id)
    : workflows;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-pulse" />
          <p className="text-gray-400">Loading BMAD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              BMAD Agent Orchestration
            </h1>
          </div>
          {selectedAgent && (
            <button
              onClick={() => setChatAgent(selectedAgent)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with {selectedAgent.name}</span>
            </button>
          )}
        </div>
        <p className="text-gray-400">
          Human-AI Collaboration Platform • C.O.R.E. Philosophy
        </p>
      </div>

      {/* Chat Interface Modal */}
      {chatAgent && (
        <AgentChatInterface
          agent={chatAgent}
          onClose={() => setChatAgent(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">AI Agents</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgent?.id === agent.id}
                  onSelect={setSelectedAgent}
                  onChat={setChatAgent}
                />
              ))}
            </div>
          </div>

          {/* Workflows Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">
                {selectedAgent ? `${selectedAgent.name} Workflows` : 'All Workflows'}
              </h2>
            </div>
            <div className="space-y-3">
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onExecute={handleExecuteWorkflow}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active Executions Sidebar */}
        <div>
          <div className="sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Active Workflows ({executions.length})
            </h2>
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {executions.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-gray-700 rounded-lg">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-500 text-sm">No active workflows</p>
                </div>
              ) : (
                executions.map((execution) => (
                  <WorkflowExecutionCard
                    key={execution.id}
                    execution={execution}
                    onCancel={handleCancelWorkflow}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
