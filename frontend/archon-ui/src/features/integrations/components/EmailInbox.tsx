/**
 * EmailInbox Component
 * Compact list of recent emails
 */

import { useState, useEffect } from 'react';
import { Mail, Star, Paperclip, RefreshCw, Loader2 } from 'lucide-react';
import { getUnreadEmails, markAsRead, isGoogleConnected } from '../services/googleService';
import type { Email } from '../types';

interface EmailInboxProps {
  maxItems?: number;
  onEmailClick?: (email: Email) => void;
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  }

  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export function EmailInbox({ maxItems = 5, onEmailClick, className = '' }: EmailInboxProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmails = async () => {
    if (!isGoogleConnected()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUnreadEmails(maxItems);
      setEmails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, [maxItems]);

  const handleEmailClick = async (email: Email) => {
    if (!email.isRead) {
      try {
        await markAsRead(email.id);
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
        );
      } catch {
        // Ignore mark as read errors
      }
    }
    onEmailClick?.(email);
  };

  if (!isGoogleConnected()) {
    return (
      <div className={`p-4 rounded-lg bg-gray-100 dark:bg-zinc-800/50 text-center ${className}`}>
        <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Connectez Gmail</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-red-500/10 border border-red-500/30 ${className}`}>
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={loadEmails} className="mt-2 text-xs text-red-400 underline">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-red-400" />
          <span className="font-medium text-gray-900 dark:text-white">Emails non lus</span>
          {emails.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
              {emails.length}
            </span>
          )}
        </div>
        <button
          onClick={loadEmails}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Emails */}
      <div className="divide-y divide-gray-200 dark:divide-zinc-800">
        {emails.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <p className="text-sm">Aucun email non lu</p>
          </div>
        ) : (
          emails.map((email) => (
            <button
              key={email.id}
              onClick={() => handleEmailClick(email)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Unread indicator */}
                <div className="flex-shrink-0 mt-1.5">
                  {!email.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* From */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-sm truncate ${
                        email.isRead
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'font-semibold text-gray-900 dark:text-white'
                      }`}
                    >
                      {email.from.name || email.from.email}
                    </span>
                    <span className="flex-shrink-0 text-xs text-gray-500">
                      {formatDate(email.date)}
                    </span>
                  </div>

                  {/* Subject */}
                  <p
                    className={`text-sm truncate ${
                      email.isRead
                        ? 'text-gray-500 dark:text-gray-500'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {email.subject || '(Sans sujet)'}
                  </p>

                  {/* Snippet */}
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {email.snippet}
                  </p>

                  {/* Icons */}
                  <div className="flex items-center gap-2 mt-1">
                    {email.isStarred && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    )}
                    {email.hasAttachments && (
                      <Paperclip className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
