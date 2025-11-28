/**
 * DashboardView Component
 * Main dashboard with unified view of IA Factory PRO
 */

import { useState, useEffect } from 'react';
import {
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Users,
  Activity,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { AgendaWidget } from '../components/AgendaWidget';
import { VoiceAgentWidget } from '../components/VoiceAgentWidget';
import { EmailWidget } from '../components/EmailWidget';
import { QuickActions } from '../components/QuickActions';
import { NotificationBell } from '../components/NotificationBell';

interface DashboardStats {
  appointmentsToday: number;
  appointmentsTrend: number;
  callsReceived: number;
  callsTrend: number;
  unreadEmails: number;
  emailsTrend: number;
  smssSent: number;
  smsTrend: number;
  documentsProcessed: number;
  activePatients: number;
}

function getMockStats(): DashboardStats {
  return {
    appointmentsToday: 12,
    appointmentsTrend: 8,
    callsReceived: 8,
    callsTrend: -5,
    unreadEmails: 5,
    emailsTrend: 12,
    smssSent: 24,
    smsTrend: 15,
    documentsProcessed: 47,
    activePatients: 156,
  };
}

export function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load stats
  useEffect(() => {
    setTimeout(() => {
      setStats(getMockStats());
      setLoading(false);
    }, 300);

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      setStats(getMockStats());
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header - use site-page color so header matches the body */}
      <header className="sticky top-0 z-40 site-header backdrop-blur-lg border-b border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    IA Factory PRO
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {greeting()}, Dr. Benali
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {formatDate()}
                </p>
                <p className="text-2xl font-bold text-blue-500">
                  {formatTime()}
                </p>
              </div>
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="RDV Aujourd'hui"
            value={stats?.appointmentsToday ?? '-'}
            icon={Calendar}
            color="blue"
            trend={stats ? { value: stats.appointmentsTrend, label: 'vs semaine dernière' } : undefined}
            loading={loading}
            onClick={() => window.location.href = '/calendar'}
          />
          <StatCard
            title="Appels Reçus"
            value={stats?.callsReceived ?? '-'}
            icon={Phone}
            color="purple"
            trend={stats ? { value: stats.callsTrend, label: 'vs hier' } : undefined}
            loading={loading}
          />
          <StatCard
            title="Emails non lus"
            value={stats?.unreadEmails ?? '-'}
            icon={Mail}
            color="red"
            trend={stats ? { value: stats.emailsTrend, label: 'nouveaux aujourd\'hui' } : undefined}
            loading={loading}
            onClick={() => window.location.href = '/integrations'}
          />
          <StatCard
            title="SMS Envoyés"
            value={stats?.smssSent ?? '-'}
            icon={MessageSquare}
            color="green"
            trend={stats ? { value: stats.smsTrend, label: 'ce mois' } : undefined}
            loading={loading}
            onClick={() => window.location.href = '/messaging'}
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Agenda */}
          <div className="lg:col-span-2 space-y-6">
            <AgendaWidget />

            {/* Secondary Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                title="Documents traités"
                value={stats?.documentsProcessed ?? '-'}
                icon={FileText}
                color="amber"
                loading={loading}
              />
              <StatCard
                title="Patients actifs"
                value={stats?.activePatients ?? '-'}
                icon={Users}
                color="green"
                loading={loading}
              />
            </div>

            {/* Email Widget */}
            <EmailWidget />
          </div>

          {/* Right Column - Widgets */}
          <div className="space-y-6">
            <VoiceAgentWidget />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
