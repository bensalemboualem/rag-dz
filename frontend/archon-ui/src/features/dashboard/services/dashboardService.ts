/**
 * Dashboard Service
 * API calls for dashboard data
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8180';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
// Types
// ============================================

export interface DashboardStats {
  appointmentsToday: number;
  appointmentsTrend: number;
  callsReceived: number;
  callsTrend: number;
  unreadEmails: number;
  emailsTrend: number;
  smssSent: number;
  smsTrend: number;
  documentsProcessed: number;
  activePatients: number;
}

export interface TodayAppointment {
  id: string;
  time: string;
  endTime: string;
  patientName: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  location?: string;
}

export interface VoiceAgentStats {
  status: 'active' | 'inactive' | 'busy';
  callsToday: number;
  callsHandled: number;
  averageDuration: string;
  lastCall?: string;
  missedCalls: number;
}

export interface EmailPreview {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  type: 'rdv' | 'question' | 'result' | 'other';
}

export interface Notification {
  id: string;
  type: 'appointment' | 'email' | 'call' | 'alert';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

// ============================================
// API Calls
// ============================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await apiRequest('/api/dashboard/stats');
  } catch {
    // Return mock data if API fails
    return getMockStats();
  }
}

/**
 * Get today's appointments
 */
export async function getTodayAppointments(): Promise<TodayAppointment[]> {
  try {
    return await apiRequest('/api/calendar/today');
  } catch {
    return getMockAppointments();
  }
}

/**
 * Get voice agent stats
 */
export async function getVoiceAgentStats(): Promise<VoiceAgentStats> {
  try {
    return await apiRequest('/api/voice/stats');
  } catch {
    return getMockVoiceStats();
  }
}

/**
 * Get recent emails
 */
export async function getRecentEmails(limit = 5): Promise<EmailPreview[]> {
  try {
    return await apiRequest(`/api/email/recent?limit=${limit}`);
  } catch {
    return getMockEmails();
  }
}

/**
 * Get notifications
 */
export async function getNotifications(): Promise<Notification[]> {
  try {
    return await apiRequest('/api/notifications');
  } catch {
    return getMockNotifications();
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(id: string): Promise<void> {
  await apiRequest(`/api/notifications/${id}/read`, { method: 'POST' });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(): Promise<void> {
  await apiRequest('/api/notifications/read-all', { method: 'POST' });
}

// ============================================
// Mock Data for Development
// ============================================

function getMockStats(): DashboardStats {
  return {
    appointmentsToday: 12,
    appointmentsTrend: 8,
    callsReceived: 8,
    callsTrend: -5,
    unreadEmails: 5,
    emailsTrend: 12,
    smssSent: 24,
    smsTrend: 15,
    documentsProcessed: 47,
    activePatients: 156,
  };
}

function getMockAppointments(): TodayAppointment[] {
  return [
    { id: '1', time: '09:00', endTime: '09:30', patientName: 'M. Dupont', type: 'Consultation', status: 'confirmed' },
    { id: '2', time: '10:30', endTime: '11:00', patientName: 'Mme Martin', type: 'Suivi', status: 'confirmed' },
    { id: '3', time: '11:30', endTime: '12:00', patientName: 'M. Bernard', type: 'Premiere visite', status: 'pending' },
    { id: '4', time: '14:00', endTime: '14:30', patientName: 'Mme Petit', type: 'Controle', status: 'confirmed' },
    { id: '5', time: '15:30', endTime: '16:00', patientName: 'M. Durand', type: 'Consultation', status: 'confirmed' },
  ];
}

function getMockVoiceStats(): VoiceAgentStats {
  return {
    status: 'active',
    callsToday: 8,
    callsHandled: 7,
    averageDuration: '2m 34s',
    lastCall: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    missedCalls: 1,
  };
}

function getMockEmails(): EmailPreview[] {
  return [
    { id: '1', from: 'patient@email.com', subject: 'Demande de RDV', preview: 'Bonjour, je souhaiterais prendre rendez-vous...', time: '10h32', isRead: false, isStarred: false, type: 'rdv' },
    { id: '2', from: 'marie.dupont@gmail.com', subject: 'Question sur ordonnance', preview: 'Docteur, concernant le traitement prescrit...', time: '09h15', isRead: false, isStarred: true, type: 'question' },
    { id: '3', from: 'labo@analyses.dz', subject: "Resultats d'analyse - M. Bernard", preview: 'Veuillez trouver ci-joint les resultats...', time: '08h45', isRead: true, isStarred: false, type: 'result' },
  ];
}

function getMockNotifications(): Notification[] {
  return [
    { id: '1', type: 'appointment', title: 'RDV dans 30 minutes', message: 'M. Dupont - Consultation', time: 'Il y a 5min', isRead: false },
    { id: '2', type: 'email', title: 'Nouvel email', message: 'Demande de RDV de patient@email.com', time: 'Il y a 15min', isRead: false },
    { id: '3', type: 'call', title: 'Appel manque', message: '+213 555 123 456', time: 'Il y a 23min', isRead: false },
    { id: '4', type: 'alert', title: 'Rappel', message: 'Resultats labo a verifier', time: 'Il y a 1h', isRead: true },
  ];
}
