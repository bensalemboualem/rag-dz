/**
 * IntegrationsView Component
 * Main view for Google Calendar and Gmail integrations
 */

import { useState } from 'react';
import { Link2, Calendar, Mail, Pen, ExternalLink } from 'lucide-react';
import { GoogleConnectButton } from '../components/GoogleConnectButton';
import { CalendarPreview } from '../components/CalendarPreview';
import { EmailInbox } from '../components/EmailInbox';
import { EmailComposer } from '../components/EmailComposer';
import { isGoogleConnected, getStoredAuthState } from '../services/googleService';
import type { Email, GoogleAuthState } from '../types';

export function IntegrationsView() {
  const [authState, setAuthState] = useState<GoogleAuthState | null>(getStoredAuthState());
  const [showComposer, setShowComposer] = useState(false);
  const [replyTo, setReplyTo] = useState<{ messageId: string; to: string; subject: string } | undefined>();

  const handleConnect = (state: GoogleAuthState) => {
    setAuthState(state);
  };

  const handleDisconnect = () => {
    setAuthState(null);
  };

  const handleEmailClick = (email: Email) => {
    setReplyTo({
      messageId: email.id,
      to: email.from.email,
      subject: email.subject,
    });
    setShowComposer(true);
  };

  const handleNewEmail = () => {
    setReplyTo(undefined);
    setShowComposer(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-blue-500/30">
            <Link2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Intégrations
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connectez Google Calendar et Gmail à IA Factory
            </p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white/5 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Connexion Google
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Connectez votre compte Google pour accéder à votre calendrier et vos emails
            </p>
            <GoogleConnectButton
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>
          {authState?.picture && (
            <img
              src={authState.picture}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Google Calendar
              </h2>
            </div>
            {isGoogleConnected() && (
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400 transition-colors"
              >
                <span>Ouvrir Calendar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <CalendarPreview />
        </section>

        {/* Gmail Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gmail
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {isGoogleConnected() && (
                <>
                  <button
                    onClick={handleNewEmail}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"
                  >
                    <Pen className="w-3 h-3" />
                    <span>Nouveau</span>
                  </button>
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <span>Ouvrir Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>
          <EmailInbox onEmailClick={handleEmailClick} />
        </section>
      </div>

      {/* Quick Actions */}
      {isGoogleConnected() && (
        <section className="bg-white/5 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actions rapides
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={handleNewEmail}
              className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-blue-500/50 transition-colors text-left"
            >
              <Pen className="w-5 h-5 text-blue-400 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Rédiger un email
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Avec assistance IA
              </p>
            </button>

            <a
              href="https://calendar.google.com/calendar/r/eventedit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-blue-500/50 transition-colors text-left"
            >
              <Calendar className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Créer un événement
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Dans Google Calendar
              </p>
            </a>

            <a
              href="https://mail.google.com/mail/u/0/#search/is%3Aunread"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-blue-500/50 transition-colors text-left"
            >
              <Mail className="w-5 h-5 text-red-400 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Voir tous les emails
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Emails non lus
              </p>
            </a>

            <a
              href="/automations"
              className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-orange-500/50 transition-colors text-left"
            >
              <Link2 className="w-5 h-5 text-orange-400 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                Automatisations
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Workflows n8n
              </p>
            </a>
          </div>
        </section>
      )}

      {/* Email Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <EmailComposer
            replyTo={replyTo}
            onClose={() => setShowComposer(false)}
            onSent={() => setShowComposer(false)}
            className="w-full max-w-2xl"
          />
        </div>
      )}
    </div>
  );
}
