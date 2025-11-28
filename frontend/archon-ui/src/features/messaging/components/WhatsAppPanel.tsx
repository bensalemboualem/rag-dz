/**
 * WhatsApp Panel Component
 * WhatsApp messaging interface with templates and chat view
 */

import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
  Smartphone,
} from 'lucide-react';
import type { WhatsAppMessage, WhatsAppTemplate, WhatsAppStats, WhatsAppConfig } from '../types';
import {
  getWhatsAppConfig,
  getWhatsAppMessages,
  getWhatsAppStats,
  getWhatsAppTemplates,
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  getMockWhatsAppConfig,
  getMockWhatsAppStats,
  getMockWhatsAppMessages,
  getMockWhatsAppTemplates,
} from '../services/whatsappService';

interface WhatsAppPanelProps {
  className?: string;
}

export function WhatsAppPanel({ className = '' }: WhatsAppPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'templates' | 'stats'>('chat');
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [stats, setStats] = useState<WhatsAppStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Message form state
  const [recipient, setRecipient] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [templateParams, setTemplateParams] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [configData, messagesData, templatesData, statsData] = await Promise.all([
        getWhatsAppConfig().catch(() => getMockWhatsAppConfig()),
        getWhatsAppMessages().catch(() => getMockWhatsAppMessages()),
        getWhatsAppTemplates().catch(() => ({ templates: getMockWhatsAppTemplates() })),
        getWhatsAppStats().catch(() => getMockWhatsAppStats()),
      ]);

      setConfig(configData);
      setMessages(messagesData);
      setTemplates(templatesData.templates);
      setStats(statsData);
    } catch (err) {
      setError('Erreur de chargement des données WhatsApp');
      // Use mock data as fallback
      setConfig(getMockWhatsAppConfig());
      setMessages(getMockWhatsAppMessages());
      setTemplates(getMockWhatsAppTemplates());
      setStats(getMockWhatsAppStats());
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!recipient.trim() || !messageBody.trim()) {
      setError('Veuillez remplir le numéro et le message');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await sendWhatsAppMessage({ to: recipient, body: messageBody });
      setRecipient('');
      setMessageBody('');
      loadData(); // Refresh messages
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi");
    } finally {
      setSending(false);
    }
  };

  const handleSendTemplate = async () => {
    if (!recipient.trim() || !selectedTemplate) {
      setError('Veuillez sélectionner un destinataire et un template');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const params = selectedTemplate.params.map((p) => templateParams[p] || '');
      await sendWhatsAppTemplate({
        to: recipient,
        templateName: selectedTemplate.name,
        templateParams: params,
      });
      setRecipient('');
      setSelectedTemplate(null);
      setTemplateParams({});
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi du template");
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'read':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent':
      case 'queued':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <MessageCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">WhatsApp Business</h3>
            <p className="text-xs text-gray-400">
              {config?.isConfigured ? (
                <>
                  {config.isSandbox ? 'Mode Sandbox' : 'Production'} - {config.whatsappNumber}
                </>
              ) : (
                'Non configuré'
              )}
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Rafraîchir"
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'chat', label: 'Messages', icon: MessageCircle },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'stats', label: 'Statistiques', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-green-500 border-b-2 border-green-500 bg-green-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {/* Send Message Form */}
            <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Numéro WhatsApp</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="+213555123456"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Votre message..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={sending || !recipient.trim() || !messageBody.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Envoyer
              </button>
            </div>

            {/* Message History */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Historique</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Aucun message</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.direction === 'outbound'
                          ? 'bg-green-500/20 ml-8'
                          : 'bg-gray-800 mr-8'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-white">{msg.body}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {msg.direction === 'outbound' ? `→ ${msg.to}` : `← ${msg.profileName || msg.to}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Template Selection */}
            <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Numéro WhatsApp</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="+213555123456"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Template</label>
                <select
                  value={selectedTemplate?.name || ''}
                  onChange={(e) => {
                    const template = templates.find((t) => t.name === e.target.value);
                    setSelectedTemplate(template || null);
                    setTemplateParams({});
                  }}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un template</option>
                  {templates.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.description}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplate && (
                <>
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Aperçu:</p>
                    <p className="text-sm text-gray-300">{selectedTemplate.body}</p>
                  </div>

                  {selectedTemplate.params.map((param) => (
                    <div key={param}>
                      <label className="block text-sm text-gray-400 mb-1 capitalize">
                        {param.replace('_', ' ')}
                      </label>
                      <input
                        type="text"
                        value={templateParams[param] || ''}
                        onChange={(e) =>
                          setTemplateParams((prev) => ({ ...prev, [param]: e.target.value }))
                        }
                        placeholder={`Valeur pour ${param}`}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </>
              )}

              <button
                onClick={handleSendTemplate}
                disabled={sending || !recipient.trim() || !selectedTemplate}
                className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Envoyer Template
              </button>
            </div>

            {/* Available Templates */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Templates disponibles</h4>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.name}
                    className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-500/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setTemplateParams({});
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{template.description}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          template.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {template.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{template.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Envoyés aujourd'hui</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.messagesSentToday}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Reçus aujourd'hui</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.messagesReceivedToday}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Taux de livraison</span>
                </div>
                <p className="text-2xl font-bold text-green-500">{(stats.deliveryRate * 100).toFixed(0)}%</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Taux de lecture</span>
                </div>
                <p className="text-2xl font-bold text-blue-500">{(stats.readRate * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Cette semaine</h4>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-400">Messages envoyés</p>
                  <p className="text-xl font-bold text-white">{stats.messagesSentWeek}</p>
                </div>
                <div>
                  <p className="text-gray-400">Messages reçus</p>
                  <p className="text-xl font-bold text-white">{stats.messagesReceivedWeek}</p>
                </div>
                <div>
                  <p className="text-gray-400">Temps de réponse</p>
                  <p className="text-xl font-bold text-white">{stats.averageResponseTime}</p>
                </div>
              </div>
            </div>

            {/* Configuration Status */}
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={config?.isConfigured ? 'text-green-500' : 'text-red-500'}>
                    {config?.isConfigured ? 'Configuré' : 'Non configuré'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mode</span>
                  <span className="text-white">{config?.isSandbox ? 'Sandbox' : 'Production'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Numéro</span>
                  <span className="text-white">{config?.whatsappNumber || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
