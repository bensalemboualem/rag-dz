export {
  getDashboardStats,
  getTodayAppointments,
  getVoiceAgentStats,
  getRecentEmails,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from './dashboardService';

export type {
  DashboardStats,
  TodayAppointment,
  VoiceAgentStats,
  EmailPreview,
  Notification,
} from './dashboardService';
