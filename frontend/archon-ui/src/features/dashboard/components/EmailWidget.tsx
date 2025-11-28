/**
 * EmailWidget Component
 * Recent emails preview
 */

import { useState, useEffect } from 'react';
import { Mail, Star, ExternalLink, Loader2 } from 'lucide-react';

interface EmailPreview {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  type: 'rdv' | 'question' | 'result' | 'other';
}

interface EmailWidgetProps {
  className?: string;
  onEmailClick?: (email: EmailPreview) => void;
}

function getMockEmails(): EmailPreview[] {
  return [
    {
      id: '1',
      from: 'patient@email.com',
      subject: 'Demande de RDV',
      preview: 'Bonjour, je souhaiterais prendre rendez-vous...',
      time: '10h32',
      isRead: false,
      isStarred: false,
      type: 'rdv',
    },
    {
      id: '2',
      from: 'marie.dupont@gmail.com',
      subject: 'Question sur ordonnance',
      preview: 'Docteur, concernant le traitement prescrit...',
      time: '09h15',
      isRead: false,
      isStarred: true,
      type: 'question',
    },
    {
      id: '3',
      from: 'labo@analyses.dz',
      subject: 'Résultats d\'analyse - M. Bernard',
      preview: 'Veuillez trouver ci-joint les résultats...',
      time: '08h45',
      isRead: true,
      isStarred: false,
      type: 'result',
    },
    {
      id: '4',
      from: 'secretariat@clinique.dz',
      subject: 'Planning semaine prochaine',
      preview: 'Voici le planning actualisé pour la semaine...',
      time: 'Hier',
      isRead: true,
      isStarred: false,
      type: 'other',
    },
  ];
}

const typeColors = {
  rdv: 'bg-blue-500',
  question: 'bg-amber-500',
  result: 'bg-emerald-500',
  other: 'bg-gray-500',
};

export function EmailWidget({ className = '', onEmailClick }: EmailWidgetProps) {
  const [emails, setEmails] = useState<EmailPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEmails(getMockEmails());
      setLoading(false);
    }, 700);
  }, []);

  const unreadCount = emails.filter((e) => !e.isRead).length;

  if (loading) {
    return (
      <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-4 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-red-400" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-red-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Derniers emails
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <a
          href="/integrations"
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          Voir tout
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Emails */}
      <div className="max-h-64 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p className="text-sm">Aucun email récent</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => onEmailClick?.(email)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${
                  !email.isRead ? 'bg-blue-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Type indicator */}
                  <div className={`w-1 h-full min-h-[40px] rounded-full ${typeColors[email.type]}`} />

                  <div className="flex-1 min-w-0">
                    {/* From and time */}
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${
                        email.isRead
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'font-semibold text-gray-900 dark:text-white'
                      }`}>
                        {email.from}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {email.isStarred && (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        )}
                        <span className="text-xs text-gray-500">{email.time}</span>
                      </div>
                    </div>

                    {/* Subject */}
                    <p className={`text-sm truncate ${
                      email.isRead
                        ? 'text-gray-500'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {email.subject}
                    </p>

                    {/* Preview */}
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {email.preview}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
