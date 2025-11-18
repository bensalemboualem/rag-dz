/**
 * Quick Actions - Boutons pour naviguer entre features
 * Solution Pro pour intégration RAG + BMAD + Chat
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Database, MessageSquare, FileText, Sparkles } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

const actions: QuickAction[] = [
  {
    id: 'bmad',
    label: 'Ask BMAD Agent',
    description: 'Chat with 19 AI experts',
    path: '/bmad',
    icon: Bot,
    color: 'from-blue-600 to-cyan-600',
    badge: '19 agents',
  },
  {
    id: 'knowledge',
    label: 'Search Knowledge',
    description: 'RAG-powered document search',
    path: '/knowledge',
    icon: Database,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'chat',
    label: 'AI Chat',
    description: 'RAG + Agents combined',
    path: '/chat',
    icon: MessageSquare,
    color: 'from-green-600 to-teal-600',
    badge: 'New',
  },
  {
    id: 'documents',
    label: 'Documents',
    description: 'Manage your files',
    path: '/documents',
    icon: FileText,
    color: 'from-orange-600 to-red-600',
  },
];

interface QuickActionsProps {
  currentPath?: string;
  variant?: 'horizontal' | 'grid';
  excludePaths?: string[];
}

export function QuickActions({
  currentPath,
  variant = 'horizontal',
  excludePaths = []
}: QuickActionsProps) {
  const navigate = useNavigate();

  const filteredActions = actions.filter(
    action => action.path !== currentPath && !excludePaths.includes(action.path)
  );

  if (filteredActions.length === 0) return null;

  return (
    <div className={`
      ${variant === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        : 'flex gap-3 overflow-x-auto pb-2'
      }
    `}>
      {filteredActions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`
              ${variant === 'horizontal' ? 'flex-shrink-0 w-64' : ''}
              group relative p-4 rounded-xl bg-gradient-to-br ${action.color}
              hover:scale-105 transition-all duration-200 shadow-lg
              hover:shadow-2xl text-left
            `}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{action.label}</h3>
                  {action.badge && (
                    <span className="text-xs px-2 py-0.5 bg-white/30 rounded-full text-white font-bold backdrop-blur-sm">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Floating Quick Action Button - Always accessible
 */
export function FloatingQuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-4 w-80 space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => {
                  window.location.href = action.path;
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left group"
              >
                <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <div className="flex-1">
                  <div className="font-medium text-white">{action.label}</div>
                  <div className="text-xs text-gray-400">{action.description}</div>
                </div>
                {action.badge && (
                  <span className="text-xs px-2 py-1 bg-blue-600 rounded-full text-white">
                    {action.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
      >
        {isOpen ? (
          <span className="text-white text-2xl">×</span>
        ) : (
          <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        )}
      </button>
    </div>
  );
}
