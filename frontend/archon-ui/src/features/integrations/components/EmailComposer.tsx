/**
 * EmailComposer Component
 * Email composition with AI assistance
 */

import { useState } from 'react';
import { Send, Sparkles, X, Loader2 } from 'lucide-react';
import { sendEmail, isGoogleConnected } from '../services/googleService';
import type { SendEmailRequest } from '../types';

interface EmailComposerProps {
  replyTo?: {
    messageId: string;
    to: string;
    subject: string;
  };
  onClose?: () => void;
  onSent?: () => void;
  className?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8180';

export function EmailComposer({ replyTo, onClose, onSent, className = '' }: EmailComposerProps) {
  const [to, setTo] = useState(replyTo?.to || '');
  const [subject, setSubject] = useState(replyTo?.subject ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!isGoogleConnected()) {
      setError('Veuillez vous connecter à Google');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const request: SendEmailRequest = {
        to: to.split(',').map((e) => e.trim()),
        subject,
        body,
        replyToMessageId: replyTo?.messageId,
      };

      await sendEmail(request);
      onSent?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi");
    } finally {
      setSending(false);
    }
  };

  const handleAiAssist = async () => {
    if (!body.trim()) {
      setError('Écrivez quelques mots pour obtenir une suggestion IA');
      return;
    }

    setAiLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_API_SECRET_KEY || 'change-me-in-production';
      const response = await fetch(`${API_URL}/api/agent/email-assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          draft: body,
          context: subject,
          action: 'improve',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur IA');
      }

      const data = await response.json();
      if (data.improved_text) {
        setBody(data.improved_text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur IA');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={`rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {replyTo ? 'Répondre' : 'Nouveau message'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Form */}
      <div className="p-4 space-y-3">
        {/* To */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">À</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="email@exemple.com"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sujet</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet du message"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-500">Message</label>
            <button
              onClick={handleAiAssist}
              disabled={aiLoading || !body.trim()}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50"
              title="Améliorer avec l'IA"
            >
              {aiLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>IA</span>
            </button>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Écrivez votre message..."
            rows={8}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={sending || !to.trim() || !subject.trim() || !body.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
