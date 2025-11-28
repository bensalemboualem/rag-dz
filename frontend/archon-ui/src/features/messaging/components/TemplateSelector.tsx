/**
 * TemplateSelector Component
 * Select and preview SMS templates
 */

import { useState } from 'react';
import { FileText, Check, ChevronDown } from 'lucide-react';
import type { SMSTemplate } from '../types';

// Pre-defined templates
export const SMS_TEMPLATES: SMSTemplate[] = [
  {
    id: 'rappel_rdv_24h',
    name: 'Rappel RDV (24h)',
    description: 'Rappel automatique 24h avant le rendez-vous',
    body: 'Rappel: Votre RDV est prévu demain {date} à {heure}. Pour annuler: {link}',
    variables: ['date', 'heure', 'link'],
    category: 'appointment',
    isActive: true,
  },
  {
    id: 'confirmation_rdv',
    name: 'Confirmation RDV',
    description: 'Confirmation de rendez-vous',
    body: 'Votre RDV du {date} à {heure} est confirmé. Dr. {nom}',
    variables: ['date', 'heure', 'nom'],
    category: 'appointment',
    isActive: true,
  },
  {
    id: 'rappel_document',
    name: 'Rappel Document',
    description: 'Rappel pour apporter un document',
    body: "Merci d'apporter {document} à votre prochain RDV.",
    variables: ['document'],
    category: 'reminder',
    isActive: true,
  },
  {
    id: 'annulation',
    name: 'Annulation RDV',
    description: 'Notification d\'annulation',
    body: 'Votre RDV du {date} a été annulé. Contactez-nous pour reprogrammer.',
    variables: ['date'],
    category: 'appointment',
    isActive: true,
  },
  {
    id: 'bienvenue',
    name: 'Bienvenue',
    description: 'Message de bienvenue nouveau patient',
    body: 'Bienvenue chez {clinique}! Votre dossier patient a été créé. Dr. {nom}',
    variables: ['clinique', 'nom'],
    category: 'notification',
    isActive: true,
  },
];

interface TemplateSelectorProps {
  selectedTemplate?: SMSTemplate;
  onSelect: (template: SMSTemplate) => void;
  className?: string;
}

export function TemplateSelector({
  selectedTemplate,
  onSelect,
  className = '',
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categoryLabels: Record<string, string> = {
    appointment: 'Rendez-vous',
    reminder: 'Rappels',
    notification: 'Notifications',
    marketing: 'Marketing',
  };

  const groupedTemplates = SMS_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = [];
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, SMSTemplate[]>);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-blue-500/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-900 dark:text-white">
            {selectedTemplate ? selectedTemplate.name : 'Choisir un template'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl max-h-80 overflow-y-auto">
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <div key={category}>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                {categoryLabels[category] || category}
              </div>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelect(template);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {template.description}
                      </p>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {selectedTemplate && (
        <div className="mt-3 p-3 rounded-lg bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700">
          <p className="text-xs text-gray-500 mb-1">Aperçu:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {selectedTemplate.body}
          </p>
          {selectedTemplate.variables.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedTemplate.variables.map((v) => (
                <span
                  key={v}
                  className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                >
                  {`{${v}}`}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
