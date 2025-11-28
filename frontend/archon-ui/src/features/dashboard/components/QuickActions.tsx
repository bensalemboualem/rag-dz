/**
 * QuickActions Component
 * Frequent action buttons
 */

import { CalendarPlus, Mail, MessageSquare, FileText, Phone, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  path?: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = '' }: QuickActionsProps) {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'new-rdv',
      label: 'Nouveau RDV',
      icon: <CalendarPlus className="w-5 h-5" />,
      color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
      path: '/calendar',
    },
    {
      id: 'compose-email',
      label: 'Composer email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
      path: '/integrations',
    },
    {
      id: 'send-sms',
      label: 'Envoyer SMS',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
      path: '/messaging',
    },
    {
      id: 'chat-ia',
      label: 'Chat IA',
      icon: <Bot className="w-5 h-5" />,
      color: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
      path: '/',
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
      path: '/knowledge',
    },
    {
      id: 'voice-agent',
      label: 'Agent Vocal',
      icon: <Phone className="w-5 h-5" />,
      color: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20',
      path: '/voice',
    },
  ];

  const handleClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Actions rapides
        </h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${action.color}`}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
