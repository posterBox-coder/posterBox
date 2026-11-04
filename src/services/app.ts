import {
  CURRENT_LOCATION,
  HOME_ACTIONS,
  MOCK_ACTIVITIES,
  MOCK_NOTIFICATIONS,
  MOCK_SCHEDULE,
  MOCK_TRACKING,
  type ActivityItem,
  type AppNotification,
  type HomeAction,
  type ScheduleItem,
  type TrackingRecord,
} from '@/data/mock';
import { wait } from '@/helpers/auth';

function normalizeTrackingNo(value: string) {
  return value.trim().toUpperCase();
}

export const appService = {
  getHomeActions: async (): Promise<HomeAction[]> => HOME_ACTIONS,

  getCurrentLocation: async (): Promise<string> => CURRENT_LOCATION,

  getNotifications: async (): Promise<AppNotification[]> => {
    await wait(400);
    return MOCK_NOTIFICATIONS.map((item) => ({ ...item }));
  },

  getActivities: async (): Promise<ActivityItem[]> => {
    await wait(350);
    return MOCK_ACTIVITIES;
  },

  getSchedule: async (): Promise<ScheduleItem[]> => {
    await wait(350);
    return MOCK_SCHEDULE;
  },

  trackPackage: async (trackingNo: string): Promise<TrackingRecord | null> => {
    await wait(500);
    const key = normalizeTrackingNo(trackingNo);
    return MOCK_TRACKING[key] ?? null;
  },
};
