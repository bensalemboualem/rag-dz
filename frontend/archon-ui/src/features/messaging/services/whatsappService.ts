/**
 * WhatsApp Service
 * API calls for WhatsApp messaging via Twilio
 */

import type {
  WhatsAppMessage,
  SendWhatsAppRequest,
  SendWhatsAppTemplateRequest,
  BulkWhatsAppRequest,
  WhatsAppTemplate,
  WhatsAppStats,
  WhatsAppConfig,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8180';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = import.meta.env.VITE_API_SECRET_KEY || 'change-me-in-production';
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// WhatsApp Operations
// ============================================

/**
 * Get WhatsApp configuration status
 */
export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  return apiRequest<WhatsAppConfig>('/api/whatsapp/config');
}

/**
 * Send a WhatsApp message
 */
export async function sendWhatsAppMessage(request: SendWhatsAppRequest): Promise<WhatsAppMessage> {
  return apiRequest<WhatsAppMessage>('/api/whatsapp/send', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Send a WhatsApp template message
 */
export async function sendWhatsAppTemplate(request: SendWhatsAppTemplateRequest): Promise<WhatsAppMessage> {
  return apiRequest<WhatsAppMessage>('/api/whatsapp/send-template', {
    method: 'POST',
    body: JSON.stringify({
      to: request.to,
      template_name: request.templateName,
      template_params: request.templateParams,
    }),
  });
}

/**
 * Send bulk WhatsApp messages
 */
export async function sendBulkWhatsApp(request: BulkWhatsAppRequest): Promise<{
  status: string;
  taskId: string;
  recipientCount: number;
  message: string;
}> {
  return apiRequest('/api/whatsapp/send-bulk', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get WhatsApp message history
 */
export async function getWhatsAppMessages(
  limit = 50,
  direction?: 'inbound' | 'outbound'
): Promise<WhatsAppMessage[]> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (direction) {
    params.append('direction', direction);
  }
  return apiRequest<WhatsAppMessage[]>(`/api/whatsapp/messages?${params}`);
}

/**
 * Get received WhatsApp messages
 */
export async function getReceivedWhatsAppMessages(limit = 50): Promise<WhatsAppMessage[]> {
  return apiRequest<WhatsAppMessage[]>(`/api/whatsapp/messages/received?limit=${limit}`);
}

/**
 * Get WhatsApp statistics
 */
export async function getWhatsAppStats(): Promise<WhatsAppStats> {
  return apiRequest<WhatsAppStats>('/api/whatsapp/stats');
}

/**
 * Get available WhatsApp templates
 */
export async function getWhatsAppTemplates(): Promise<{ templates: WhatsAppTemplate[] }> {
  return apiRequest<{ templates: WhatsAppTemplate[] }>('/api/whatsapp/templates');
}

/**
 * Test WhatsApp sandbox connection
 */
export async function testWhatsAppSandbox(): Promise<{
  status: string;
  message: string;
  instructions?: string[];
  isSandbox?: boolean;
  whatsappNumber?: string;
}> {
  return apiRequest('/api/whatsapp/test-sandbox', {
    method: 'POST',
  });
}

// ============================================
// Mock Data for Development
// ============================================

export function getMockWhatsAppConfig(): WhatsAppConfig {
  return {
    isConfigured: true,
    whatsappNumber: '+14155238886',
    isSandbox: true,
    templatesAvailable: ['appointment_reminder', 'appointment_confirmation', 'results_ready'],
  };
}

export function getMockWhatsAppStats(): WhatsAppStats {
  return {
    messagesSentToday: 24,
    messagesReceivedToday: 18,
    messagesSentWeek: 156,
    messagesReceivedWeek: 132,
    deliveryRate: 0.95,
    readRate: 0.82,
    responseRate: 0.68,
    averageResponseTime: '5m 30s',
  };
}

export function getMockWhatsAppMessages(): WhatsAppMessage[] {
  return [
    {
      id: '1',
      to: '+213555123456',
      body: 'Bonjour, rappel de votre RDV demain à 10h',
      status: 'delivered',
      direction: 'outbound',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      sentAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      to: '+213555789012',
      body: 'Oui je confirme, à demain',
      status: 'read',
      direction: 'inbound',
      profileName: 'Ahmed Benali',
      receivedAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '3',
      to: '+213555456789',
      body: 'Vos résultats sont disponibles',
      status: 'sent',
      direction: 'outbound',
      templateName: 'results_ready',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      sentAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

export function getMockWhatsAppTemplates(): WhatsAppTemplate[] {
  return [
    {
      name: 'appointment_reminder',
      description: 'Rappel de rendez-vous',
      body: 'Bonjour {{1}}, rappel de votre RDV le {{2}} à {{3}}. Répondez OUI pour confirmer.',
      params: ['patient_name', 'date', 'time'],
      status: 'approved',
    },
    {
      name: 'appointment_confirmation',
      description: 'Confirmation de rendez-vous',
      body: 'Votre RDV du {{1}} à {{2}} est confirmé. Cabinet Dr {{3}}.',
      params: ['date', 'time', 'doctor_name'],
      status: 'approved',
    },
    {
      name: 'results_ready',
      description: 'Résultats disponibles',
      body: 'Bonjour {{1}}, vos résultats d\'analyse sont disponibles. Contactez-nous au {{2}}.',
      params: ['patient_name', 'phone'],
      status: 'approved',
    },
  ];
}
