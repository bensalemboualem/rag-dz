/**
 * useDashboardWebSocket Hook
 * Real-time updates for dashboard via WebSocket
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface DashboardEvent {
  type: 'stats_update' | 'new_appointment' | 'new_call' | 'new_email' | 'new_notification';
  data: Record<string, unknown>;
  timestamp: string;
}

interface UseDashboardWebSocketOptions {
  onStatsUpdate?: (data: Record<string, unknown>) => void;
  onNewAppointment?: (data: Record<string, unknown>) => void;
  onNewCall?: (data: Record<string, unknown>) => void;
  onNewEmail?: (data: Record<string, unknown>) => void;
  onNewNotification?: (data: Record<string, unknown>) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

interface WebSocketState {
  isConnected: boolean;
  lastMessage: DashboardEvent | null;
  error: string | null;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8180/ws';

export function useDashboardWebSocket(options: UseDashboardWebSocketOptions = {}) {
  const {
    onStatsUpdate,
    onNewAppointment,
    onNewCall,
    onNewEmail,
    onNewNotification,
    autoReconnect = true,
    reconnectInterval = 5000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    lastMessage: null,
    error: null,
  });

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/dashboard`);
      wsRef.current = ws;

      ws.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true, error: null }));
        console.log('[Dashboard WS] Connected');

        // Subscribe to dashboard events
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'dashboard' }));
      };

      ws.onmessage = (event) => {
        try {
          const message: DashboardEvent = JSON.parse(event.data);
          setState((prev) => ({ ...prev, lastMessage: message }));

          // Route message to appropriate handler
          switch (message.type) {
            case 'stats_update':
              onStatsUpdate?.(message.data);
              break;
            case 'new_appointment':
              onNewAppointment?.(message.data);
              break;
            case 'new_call':
              onNewCall?.(message.data);
              break;
            case 'new_email':
              onNewEmail?.(message.data);
              break;
            case 'new_notification':
              onNewNotification?.(message.data);
              break;
          }
        } catch (err) {
          console.error('[Dashboard WS] Parse error:', err);
        }
      };

      ws.onclose = () => {
        setState((prev) => ({ ...prev, isConnected: false }));
        console.log('[Dashboard WS] Disconnected');

        // Auto-reconnect
        if (autoReconnect) {
          reconnectTimeoutRef.current = window.setTimeout(() => {
            console.log('[Dashboard WS] Reconnecting...');
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        setState((prev) => ({ ...prev, error: 'Connection error' }));
        console.error('[Dashboard WS] Error:', error);
      };
    } catch (err) {
      setState((prev) => ({ ...prev, error: 'Failed to connect' }));
      console.error('[Dashboard WS] Connection failed:', err);
    }
  }, [
    autoReconnect,
    reconnectInterval,
    onStatsUpdate,
    onNewAppointment,
    onNewCall,
    onNewEmail,
    onNewNotification,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ...state,
    send,
    reconnect: connect,
    disconnect,
  };
}

/**
 * Polling-based alternative for when WebSocket is not available
 */
export function useDashboardPolling(
  fetchFn: () => Promise<Record<string, unknown>>,
  interval = 30000
) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch error');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    // Initial fetch
    refresh();

    // Set up polling
    intervalRef.current = window.setInterval(refresh, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, interval]);

  return { data, loading, error, refresh };
}
