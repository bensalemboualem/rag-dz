/**
 * Twilio SMS/Messaging Types
 */

export interface SMSMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  status: SMSStatus;
  direction: 'outbound' | 'inbound';
  createdAt: string;
  updatedAt: string;
  errorCode?: string;
  errorMessage?: string;
  price?: string;
  priceUnit?: string;
}

export type SMSStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'undelivered'
  | 'failed'
  | 'read';

export interface SendSMSRequest {
  to: string;
  message: string;
  templateId?: string;
  templateVars?: Record<string, string>;
}

export interface BulkSMSRequest {
  recipients: string[];
  template: string;
  templateVars?: Record<string, string>;
}

export interface ScheduledReminder {
  id: string;
  to: string;
  message: string;
  scheduledAt: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  createdAt: string;
  sentAt?: string;
  relatedTo?: {
    type: 'appointment' | 'document' | 'other';
    id: string;
  };
}

export interface ScheduleReminderRequest {
  to: string;
  message: string;
  scheduledAt: string;
  templateId?: string;
  templateVars?: Record<string, string>;
  relatedTo?: {
    type: 'appointment' | 'document' | 'other';
    id: string;
  };
}

export interface SMSTemplate {
  id: string;
  name: string;
  description: string;
  body: string;
  variables: string[];
  category: 'appointment' | 'reminder' | 'notification' | 'marketing';
  isActive: boolean;
}

export interface SMSStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  thisMonth: {
    sent: number;
    delivered: number;
    failed: number;
  };
  byDay: DailySMSStats[];
}

export interface DailySMSStats {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
}

export interface TwilioConfig {
  isConfigured: boolean;
  phoneNumber?: string;
  accountStatus?: 'active' | 'suspended' | 'closed';
}

// ============================================
// WhatsApp Types
// ============================================

export interface WhatsAppMessage {
  id: string;
  to: string;
  body: string;
  mediaUrl?: string;
  templateName?: string;
  templateParams?: string[];
  status: WhatsAppStatus;
  direction: 'outbound' | 'inbound';
  profileName?: string;
  createdAt?: string;
  sentAt?: string;
  receivedAt?: string;
}

export type WhatsAppStatus =
  | 'pending'
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export interface SendWhatsAppRequest {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface SendWhatsAppTemplateRequest {
  to: string;
  templateName: string;
  templateParams?: string[];
}

export interface BulkWhatsAppRequest {
  recipients: string[];
  body: string;
  mediaUrl?: string;
}

export interface WhatsAppTemplate {
  name: string;
  description: string;
  body: string;
  params: string[];
  status: 'approved' | 'pending' | 'rejected';
}

export interface WhatsAppStats {
  messagesSentToday: number;
  messagesReceivedToday: number;
  messagesSentWeek: number;
  messagesReceivedWeek: number;
  deliveryRate: number;
  readRate: number;
  responseRate: number;
  averageResponseTime: string;
}

export interface WhatsAppConfig {
  isConfigured: boolean;
  whatsappNumber?: string;
  isSandbox: boolean;
  templatesAvailable: string[];
}
