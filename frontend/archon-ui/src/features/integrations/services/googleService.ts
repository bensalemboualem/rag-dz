/**
 * Google API Service
 * Handles OAuth2, Calendar, and Gmail integrations
 */

import type {
  GoogleAuthState,
  CalendarEvent,
  CreateEventRequest,
  Email,
  EmailThread,
  SendEmailRequest,
  DateRange,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8180';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// OAuth2 scopes needed
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

const STORAGE_KEY = 'google_auth_state';

/**
 * Get stored auth state from localStorage
 */
export function getStoredAuthState(): GoogleAuthState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const state = JSON.parse(stored) as GoogleAuthState;
    // Check if token is expired
    if (state.expiresAt && Date.now() > state.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

/**
 * Save auth state to localStorage
 */
function saveAuthState(state: GoogleAuthState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Clear auth state
 */
export function clearAuthState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Initialize Google OAuth2 flow
 * Opens popup for Google consent screen
 */
export function initGoogleAuth(): Promise<GoogleAuthState> {
  return new Promise((resolve, reject) => {
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const state = crypto.randomUUID();

    // Store state for verification
    sessionStorage.setItem('google_oauth_state', state);

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPES.join(' '));
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    // Open popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl.toString(),
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    // Listen for callback message
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'google-oauth-callback') {
        window.removeEventListener('message', handleMessage);

        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          const authState: GoogleAuthState = {
            isConnected: true,
            accessToken: event.data.accessToken,
            refreshToken: event.data.refreshToken,
            expiresAt: event.data.expiresAt,
            email: event.data.email,
            picture: event.data.picture,
            scopes: SCOPES,
          };
          saveAuthState(authState);
          resolve(authState);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Poll to check if popup closed without completing
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        reject(new Error('Authentication cancelled'));
      }
    }, 500);
  });
}

/**
 * Exchange authorization code for tokens (called from callback page)
 */
export async function exchangeCodeForTokens(code: string): Promise<GoogleAuthState> {
  const response = await fetch(`${API_URL}/api/auth/google/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();

  const authState: GoogleAuthState = {
    isConnected: true,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    email: data.email,
    picture: data.picture,
    scopes: SCOPES,
  };

  saveAuthState(authState);
  return authState;
}

/**
 * Disconnect Google account
 */
export async function disconnectGoogle(): Promise<void> {
  const authState = getStoredAuthState();
  if (authState?.accessToken) {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${authState.accessToken}`, {
        method: 'POST',
      });
    } catch {
      // Ignore revoke errors
    }
  }
  clearAuthState();
}

// ============================================
// Calendar API
// ============================================

/**
 * Get calendar events for a date range
 */
export async function getCalendarEvents(dateRange: DateRange): Promise<CalendarEvent[]> {
  const authState = getStoredAuthState();
  if (!authState?.accessToken) {
    throw new Error('Not authenticated with Google');
  }

  const response = await fetch(`${API_URL}/api/google/calendar/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authState.accessToken}`,
    },
    body: JSON.stringify({
      timeMin: dateRange.start.toISOString(),
      timeMax: dateRange.end.toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  const data = await response.json();
  return data.events || [];
}

/**
 * Create a calendar event
 */
export async function createCalendarEvent(event: CreateEventRequest): Promise<CalendarEvent> {
  const authState = getStoredAuthState();
  if (!authState?.accessToken) {
    throw new Error('Not authenticated with Google');
  }

  const response = await fetch(`${API_URL}/api/google/calendar/events`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authState.accessToken}`,
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error('Failed to create calendar event');
  }

  return await response.json();
}

/**
 * Get today's events
 */
export async function getTodayEvents(): Promise<CalendarEvent[]> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return getCalendarEvents({ start: startOfDay, end: endOfDay });
}

// ============================================
// Gmail API
// ============================================

/**
 * Get emails with optional query filter
 */
export async function getEmails(query?: string, maxResults = 20): Promise<Email[]> {
  const authState = getStoredAuthState();
  if (!authState?.accessToken) {
    throw new Error('Not authenticated with Google');
  }

  const params = new URLSearchParams();
  if (query) params.set('q', query);
  params.set('maxResults', String(maxResults));

  const response = await fetch(`${API_URL}/api/google/gmail/messages?${params}`, {
    headers: {
      'Authorization': `Bearer ${authState.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }

  const data = await response.json();
  return data.emails || [];
}

/**
 * Get unread emails
 */
export async function getUnreadEmails(maxResults = 10): Promise<Email[]> {
  return getEmails('is:unread', maxResults);
}

/**
 * Get email thread
 */
export async function getEmailThread(threadId: string): Promise<EmailThread> {
  const authState = getStoredAuthState();
  if (!authState?.accessToken) {
    throw new Error('Not authenticated with Google');
  }

  const response = await fetch(`${API_URL}/api/google/gmail/threads/${threadId}`, {
    headers: {
      'Authorization': `Bearer ${authState.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch email thread');
  }

  return await response.json();
}

/**
 * Send email
 */
export async function sendEmail(request: SendEmailRequest): Promise<{ id: string; threadId: string }> {
  const authState = getStoredAuthState();
  if (!authState?.accessToken) {
    throw new Error('Not authenticated with Google');
  }

  const response = await fetch(`${API_URL}/api/google/gmail/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authState.accessToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return await response.json();
}

/**
 * Mark email as read
 */
export async function markAsRead(messageId: string): Promise<void> {
  const authState = getStoredAuthState();
  if (!authState?.accessToken) {
    throw new Error('Not authenticated with Google');
  }

  await fetch(`${API_URL}/api/google/gmail/messages/${messageId}/read`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authState.accessToken}`,
    },
  });
}

/**
 * Get unread count
 */
export async function getUnreadCount(): Promise<number> {
  const authState = getStoredAuthState();
  if (!authState?.accessToken) {
    return 0;
  }

  try {
    const response = await fetch(`${API_URL}/api/google/gmail/unread-count`, {
      headers: {
        'Authorization': `Bearer ${authState.accessToken}`,
      },
    });

    if (!response.ok) return 0;

    const data = await response.json();
    return data.count || 0;
  } catch {
    return 0;
  }
}

/**
 * Check if Google is connected
 */
export function isGoogleConnected(): boolean {
  const state = getStoredAuthState();
  return state?.isConnected === true && !!state.accessToken;
}
