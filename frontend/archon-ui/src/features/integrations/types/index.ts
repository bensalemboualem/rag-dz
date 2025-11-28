/**
 * Google Integration Types
 */

export interface GoogleAuthState {
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  email?: string;
  picture?: string;
  scopes: string[];
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: CalendarAttendee[];
  location?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  htmlLink?: string;
}

export interface CalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  self?: boolean;
}

export interface CreateEventRequest {
  summary: string;
  description?: string;
  start: string;
  end: string;
  attendees?: string[];
  location?: string;
  sendUpdates?: 'all' | 'externalOnly' | 'none';
}

export interface Email {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  date: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  hasAttachments: boolean;
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailThread {
  id: string;
  messages: EmailMessage[];
  subject: string;
}

export interface EmailMessage {
  id: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  date: string;
  body: string;
  bodyHtml?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface SendEmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  replyToMessageId?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'loading';
