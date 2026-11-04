import { apiClient, unwrap } from '@/api/client';
import { tripsMock } from '@/api/mocks/trips';
import { USE_MOCKS } from '@/config/env';
import type { Trip, TripPayload } from '@/types';

export type TripsApi = {
  list: () => Promise<Trip[]>;
  get: (id: string) => Promise<Trip>;
  create: (payload: TripPayload) => Promise<Trip>;
  update: (id: string, payload: TripPayload) => Promise<Trip>;
  remove: (id: string) => Promise<void>;
};

const http: TripsApi = {
  list: () => unwrap(apiClient.get<Trip[]>('/trips')),
  get: (id) => unwrap(apiClient.get<Trip>(`/trips/${id}`)),
  create: (payload) => unwrap(apiClient.post<Trip>('/trips', payload)),
  update: (id, payload) => unwrap(apiClient.patch<Trip>(`/trips/${id}`, payload)),
  remove: (id) => unwrap(apiClient.delete<void>(`/trips/${id}`)),
};

export const tripsService: TripsApi = USE_MOCKS ? tripsMock : http;
