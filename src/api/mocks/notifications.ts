import type { NotificationsApi } from '@/api/services/notifications';

import { mockRequest, notFound } from './runtime';
import { db } from './store';

export const notificationsMock: NotificationsApi = {
  list: () => mockRequest(() => [...db.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
  markRead: (id) =>
    mockRequest(() => {
      const notification = db.notifications.find((item) => item.id === id);
      if (!notification) {
        throw notFound('Notification');
      }
      notification.read = true;
      return notification;
    }),
};
