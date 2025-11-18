import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import type { BMADAgent } from '../types';

interface AgentCardProps {
  agent: BMADAgent;
  onSelect: (agent: BMADAgent) => void;
  onChat?: (agent: BMADAgent) => void;
  selected?: boolean;
}

export function AgentCard({ agent, onSelect, onChat, selected }: AgentCardProps) {
  const { t } = useTranslation();

  const categoryColors = {
    development: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    builder: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    creative: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
  };

  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(agent)}
        className={`
          relative p-6 rounded-xl border-2 transition-all duration-300 w-full
          bg-gradient-to-br ${categoryColors[agent.category]}
          hover:scale-105 hover:shadow-xl
          ${selected ? 'ring-4 ring-blue-500/50 scale-105' : ''}
        `}
      >
        <div className="text-6xl mb-4">{agent.icon}</div>
        <h3 className="text-lg font-bold mb-2 text-white">{agent.name}</h3>
        <p className="text-sm text-gray-300">{agent.description}</p>

        {selected && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
          </div>
        )}

        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      {/* Chat Button - appears on hover */}
      {onChat && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChat(agent);
          }}
          className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg z-10"
          title={`Chat with ${agent.name}`}
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
