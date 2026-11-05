import { apiClient, unwrap } from '@/api/client';
import { trackingMock } from '@/api/mocks/tracking';
import { USE_MOCKS } from '@/config/env';
import type { TrackingInfo } from '@/types';

export type TrackingApi = {
  get: (trackingId: string) => Promise<TrackingInfo>;
};

const http: TrackingApi = {
  get: (trackingId) => unwrap(apiClient.get<TrackingInfo>(`/tracking/${encodeURIComponent(trackingId)}`)),
};

export const trackingService: TrackingApi = USE_MOCKS ? trackingMock : http;
