import { apiClient, unwrap } from '@/api/client';
import { notificationsMock } from '@/api/mocks/notifications';
import { USE_MOCKS } from '@/config/env';
import type { AppNotification } from '@/types';

export type NotificationsApi = {
  list: () => Promise<AppNotification[]>;
  markRead: (id: string) => Promise<AppNotification>;
};

const http: NotificationsApi = {
  list: () => unwrap(apiClient.get<AppNotification[]>('/notifications')),
  markRead: (id) => unwrap(apiClient.patch<AppNotification>(`/notifications/${id}/read`)),
};

export const notificationsService: NotificationsApi = USE_MOCKS ? notificationsMock : http;
