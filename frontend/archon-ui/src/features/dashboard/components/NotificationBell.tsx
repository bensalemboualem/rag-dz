/**
 * NotificationBell Component
 * Notification dropdown with alerts
 */

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Calendar, Mail, Phone, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment' | 'email' | 'call' | 'alert';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationBellProps {
  className?: string;
}

function getMockNotifications(): Notification[] {
  return [
    {
      id: '1',
      type: 'appointment',
      title: 'RDV dans 30 minutes',
      message: 'M. Dupont - Consultation',
      time: 'Il y a 5min',
      isRead: false,
    },
    {
      id: '2',
      type: 'email',
      title: 'Nouvel email',
      message: 'Demande de RDV de patient@email.com',
      time: 'Il y a 15min',
      isRead: false,
    },
    {
      id: '3',
      type: 'call',
      title: 'Appel manqué',
      message: '+213 555 123 456',
      time: 'Il y a 23min',
      isRead: false,
    },
    {
      id: '4',
      type: 'alert',
      title: 'Rappel',
      message: 'Résultats labo à vérifier',
      time: 'Il y a 1h',
      isRead: true,
    },
  ];
}

const typeConfig = {
  appointment: {
    icon: Calendar,
    color: 'text-blue-400 bg-blue-500/10',
  },
  email: {
    icon: Mail,
    color: 'text-red-400 bg-red-500/10',
  },
  call: {
    icon: Phone,
    color: 'text-purple-400 bg-purple-500/10',
  },
  alert: {
    icon: AlertCircle,
    color: 'text-amber-400 bg-amber-500/10',
  },
};

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(getMockNotifications());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 flex gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${
                      !notification.isRead ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 p-2 rounded-lg ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${
                          notification.isRead
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'font-medium text-gray-900 dark:text-white'
                        }`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Marquer lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
