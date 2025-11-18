/**
 * Navigation Globale - Solution Pro pour RAG.dz
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Database,
  Bot,
  MessageSquare,
  FileText,
  Search,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation.tsx';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    id: 'knowledge',
    label: 'Knowledge Base',
    path: '/knowledge',
    icon: Database,
    description: 'Upload documents & search with RAG',
  },
  {
    id: 'bmad',
    label: 'BMAD Agents',
    path: '/bmad',
    icon: Bot,
    description: '19 AI agents for development',
    badge: '19',
  },
  {
    id: 'chat',
    label: 'AI Chat',
    path: '/chat',
    icon: MessageSquare,
    description: 'Chat with RAG + Agents',
    badge: 'New',
  },
  {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    icon: FileText,
    description: 'Manage uploaded files',
  },
];

export function GlobalNav() {
  const location = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // Auto-hide par défaut
  const [isHovering, setIsHovering] = useState(false);

  // Auto-show/hide basé sur le hover
  const shouldExpand = isOpen || isHovering;

  // Navigation items avec traductions
  const navItemsTranslated = navItems.map(item => ({
    ...item,
    label: t(`nav.${item.id === 'knowledge' ? 'knowledgeBase' : item.id === 'bmad' ? 'bmadAgents' : item.id === 'chat' ? 'aiChat' : 'documents'}`),
    description: t(`nav.${item.id === 'knowledge' ? 'knowledgeDesc' : item.id === 'bmad' ? 'bmadDesc' : item.id === 'chat' ? 'aiChatDesc' : 'documentsDesc'}`),
  }));

  return (
    <>
      {/* Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Sidebar avec auto-hide hover */}
      <aside
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          border-r border-gray-700 z-40 transition-all duration-300
          ${shouldExpand ? 'w-64' : 'w-16'}
          ${isOpen && !shouldExpand ? '-translate-x-full lg:translate-x-0' : ''}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-blue-400 flex-shrink-0" />
            {shouldExpand && (
              <div>
                <h1 className="text-xl font-bold text-white">{t('nav.platformName')}</h1>
                <p className="text-xs text-gray-400">{t('nav.platformDesc')}</p>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          {shouldExpand && (
            <div className="mt-3">
              <LanguageSwitcher />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItemsTranslated.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all group
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                  ${!shouldExpand ? 'justify-center' : ''}
                `}
                title={!shouldExpand ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'}`} />

                {shouldExpand && (
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full font-bold
                          ${isActive
                            ? 'bg-white text-blue-600'
                            : 'bg-blue-600 text-white'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
          <button
            className={`
              w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-cyan-600
              rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all text-white font-medium shadow-lg
              ${!shouldExpand ? 'justify-center' : ''}
            `}
            title={!shouldExpand ? t('nav.quickSearch') : undefined}
          >
            <Search className="w-5 h-5 flex-shrink-0" />
            {shouldExpand && <span>{t('nav.quickSearch')}</span>}
          </button>
        </div>
      </aside>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
