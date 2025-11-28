/**
 * Twilio SMS Service
 * Handles SMS sending, scheduling, and history
 */

import type {
  SMSMessage,
  SendSMSRequest,
  BulkSMSRequest,
  ScheduledReminder,
  ScheduleReminderRequest,
  SMSTemplate,
  SMSStats,
  TwilioConfig,
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
// SMS Operations
// ============================================

/**
 * Send a single SMS
 */
export async function sendSMS(request: SendSMSRequest): Promise<SMSMessage> {
  return apiRequest<SMSMessage>('/api/twilio/sms/send', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Send bulk SMS to multiple recipients
 */
export async function sendBulkSMS(request: BulkSMSRequest): Promise<{
  success: number;
  failed: number;
  messages: SMSMessage[];
}> {
  return apiRequest('/api/twilio/sms/bulk', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get SMS message history
 */
export async function getMessageHistory(
  limit = 50,
  offset = 0,
  direction?: 'outbound' | 'inbound'
): Promise<{ messages: SMSMessage[]; total: number }> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (direction) params.set('direction', direction);

  return apiRequest(`/api/twilio/sms/history?${params}`);
}

/**
 * Get a single message by ID
 */
export async function getMessage(messageId: string): Promise<SMSMessage> {
  return apiRequest(`/api/twilio/sms/${messageId}`);
}

// ============================================
// Reminder Scheduling
// ============================================

/**
 * Schedule a reminder SMS
 */
export async function scheduleReminder(
  request: ScheduleReminderRequest
): Promise<ScheduledReminder> {
  return apiRequest<ScheduledReminder>('/api/twilio/reminders', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get scheduled reminders
 */
export async function getScheduledReminders(
  status?: 'pending' | 'sent' | 'cancelled'
): Promise<ScheduledReminder[]> {
  const params = status ? `?status=${status}` : '';
  return apiRequest(`/api/twilio/reminders${params}`);
}

/**
 * Cancel a scheduled reminder
 */
export async function cancelReminder(reminderId: string): Promise<void> {
  await apiRequest(`/api/twilio/reminders/${reminderId}/cancel`, {
    method: 'POST',
  });
}

// ============================================
// Templates
// ============================================

/**
 * Get all SMS templates
 */
export async function getTemplates(): Promise<SMSTemplate[]> {
  return apiRequest('/api/twilio/templates');
}

/**
 * Get a template by ID
 */
export async function getTemplate(templateId: string): Promise<SMSTemplate> {
  return apiRequest(`/api/twilio/templates/${templateId}`);
}

/**
 * Render a template with variables
 */
export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return rendered;
}

// ============================================
// Statistics
// ============================================

/**
 * Get SMS statistics
 */
export async function getSMSStats(): Promise<SMSStats> {
  return apiRequest('/api/twilio/stats');
}

// ============================================
// Configuration
// ============================================

/**
 * Check Twilio configuration status
 */
export async function getTwilioConfig(): Promise<TwilioConfig> {
  try {
    return await apiRequest('/api/twilio/config');
  } catch {
    return { isConfigured: false };
  }
}

/**
 * Test Twilio connection
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  return apiRequest('/api/twilio/test');
}

// ============================================
// Mock Data for Development
// ============================================

export function getMockHistory(): SMSMessage[] {
  const statuses: SMSMessage['status'][] = ['delivered', 'delivered', 'sent', 'failed'];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `msg-${i + 1}`,
    to: `+2135550${String(i).padStart(4, '0')}`,
    from: '+12345678901',
    body: i % 2 === 0
      ? `Rappel: Votre RDV est prévu demain à 14h00. Dr. Benali`
      : `Votre RDV du 15/01 à 10h00 est confirmé.`,
    status: statuses[i % 4],
    direction: 'outbound',
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000 + 60000).toISOString(),
  }));
}

export function getMockStats(): SMSStats {
  return {
    totalSent: 1247,
    totalDelivered: 1198,
    totalFailed: 49,
    deliveryRate: 96.1,
    thisMonth: {
      sent: 312,
      delivered: 301,
      failed: 11,
    },
    byDay: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
      sent: Math.floor(Math.random() * 50) + 20,
      delivered: Math.floor(Math.random() * 45) + 18,
      failed: Math.floor(Math.random() * 5),
    })),
  };
}
