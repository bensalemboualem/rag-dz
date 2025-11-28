/**
 * MessagingView Component
 * Main view for SMS and WhatsApp messaging
 */

import { useState } from 'react';
import { MessageSquare, Bell, BarChart3, History, MessageCircle } from 'lucide-react';
import { SMSComposer } from '../components/SMSComposer';
import { SMSHistory } from '../components/SMSHistory';
import { ReminderScheduler } from '../components/ReminderScheduler';
import { SMSStats } from '../components/SMSStats';
import { WhatsAppPanel } from '../components/WhatsAppPanel';

type Tab = 'compose' | 'history' | 'reminders' | 'stats' | 'whatsapp';

export function MessagingView() {
  const [activeTab, setActiveTab] = useState<Tab>('compose');
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'compose', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'history', label: 'Historique', icon: <History className="w-4 h-4" /> },
    { id: 'reminders', label: 'Rappels', icon: <Bell className="w-4 h-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleSMSSent = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
          <MessageSquare className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messagerie
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            SMS et WhatsApp via Twilio
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'compose' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SMSComposer onSent={handleSMSSent} />
            <SMSHistory key={refreshKey} limit={10} />
          </div>
        )}

        {activeTab === 'history' && (
          <SMSHistory key={refreshKey} limit={50} />
        )}

        {activeTab === 'reminders' && (
          <ReminderScheduler />
        )}

        {activeTab === 'stats' && (
          <SMSStats />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppPanel />
        )}
      </div>
    </div>
  );
}
