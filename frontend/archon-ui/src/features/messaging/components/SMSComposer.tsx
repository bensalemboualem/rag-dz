/**
 * SMSComposer Component
 * Compose and send SMS messages
 */

import { useState } from 'react';
import { Send, Loader2, User, MessageSquare } from 'lucide-react';
import { sendSMS, renderTemplate } from '../services/twilioService';
import { TemplateSelector } from './TemplateSelector';
import type { SMSTemplate } from '../types';

interface SMSComposerProps {
  defaultTo?: string;
  onSent?: () => void;
  className?: string;
}

export function SMSComposer({ defaultTo = '', onSent, className = '' }: SMSComposerProps) {
  const [to, setTo] = useState(defaultTo);
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | undefined>();
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTemplateSelect = (template: SMSTemplate) => {
    setSelectedTemplate(template);
    setMessage(template.body);
    // Reset template vars
    const vars: Record<string, string> = {};
    template.variables.forEach((v) => (vars[v] = ''));
    setTemplateVars(vars);
  };

  const handleVarChange = (key: string, value: string) => {
    const newVars = { ...templateVars, [key]: value };
    setTemplateVars(newVars);
    // Update message with rendered template
    if (selectedTemplate) {
      setMessage(renderTemplate(selectedTemplate.body, newVars));
    }
  };

  const handleSend = async () => {
    if (!to.trim() || !message.trim()) {
      setError('Veuillez remplir le numéro et le message');
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      await sendSMS({
        to: to.trim(),
        message: message.trim(),
        templateId: selectedTemplate?.id,
        templateVars,
      });
      setSuccess(true);
      setTo('');
      setMessage('');
      setSelectedTemplate(undefined);
      setTemplateVars({});
      onSent?.();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi");
    } finally {
      setSending(false);
    }
  };

  const charCount = message.length;
  const smsCount = Math.ceil(charCount / 160) || 1;

  return (
    <div className={`rounded-xl bg-white/5 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-400" />
          Nouveau SMS
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Template Selector */}
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelect={handleTemplateSelect}
        />

        {/* Template Variables */}
        {selectedTemplate && selectedTemplate.variables.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Variables du template:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedTemplate.variables.map((v) => (
                <div key={v}>
                  <label className="text-xs text-gray-500 mb-1 block">{v}</label>
                  <input
                    type="text"
                    value={templateVars[v] || ''}
                    onChange={(e) => handleVarChange(v, e.target.value)}
                    placeholder={`Valeur pour {${v}}`}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phone Number */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Destinataire</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="+213 5XX XX XX XX"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-500">Message</label>
            <span className="text-xs text-gray-500">
              {charCount}/160 ({smsCount} SMS)
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Error/Success */}
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-xs text-emerald-400">SMS envoyé avec succès!</p>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sending || !to.trim() || !message.trim()}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
