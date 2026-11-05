import { apiClient, unwrap } from '@/api/client';
import { deliveriesMock } from '@/api/mocks/deliveries';
import { USE_MOCKS } from '@/config/env';
import type { CreateDeliveryPayload, DeliveryListParams, DeliveryRequest, TravelerMatch } from '@/types';

export type DeliveriesApi = {
  list: (params: DeliveryListParams) => Promise<DeliveryRequest[]>;
  get: (id: string) => Promise<DeliveryRequest>;
  create: (payload: CreateDeliveryPayload) => Promise<DeliveryRequest>;
  matches: (id: string) => Promise<TravelerMatch[]>;
  selectTraveler: (id: string, body: { travelerId: string; tripId: string }) => Promise<DeliveryRequest>;
  cancel: (id: string) => Promise<DeliveryRequest>;
  accept: (id: string) => Promise<DeliveryRequest>;
  decline: (id: string) => Promise<DeliveryRequest>;
  pickup: (id: string) => Promise<DeliveryRequest>;
  confirmDelivery: (id: string, body: { code: string }) => Promise<DeliveryRequest>;
};

const path = (id: string, action = '') => `/delivery-requests/${id}${action ? `/${action}` : ''}`;

const http: DeliveriesApi = {
  list: (params) =>
    unwrap(apiClient.get<DeliveryRequest[]>('/delivery-requests', { params: { ...params, role: params.role.toLowerCase() } })),
  get: (id) => unwrap(apiClient.get<DeliveryRequest>(path(id))),
  create: (payload) => unwrap(apiClient.post<DeliveryRequest>('/delivery-requests', payload)),
  matches: (id) => unwrap(apiClient.get<TravelerMatch[]>(path(id, 'matches'))),
  selectTraveler: (id, body) => unwrap(apiClient.patch<DeliveryRequest>(path(id, 'traveler'), body)),
  cancel: (id) => unwrap(apiClient.post<DeliveryRequest>(path(id, 'cancel'))),
  accept: (id) => unwrap(apiClient.post<DeliveryRequest>(path(id, 'accept'))),
  decline: (id) => unwrap(apiClient.post<DeliveryRequest>(path(id, 'decline'))),
  pickup: (id) => unwrap(apiClient.post<DeliveryRequest>(path(id, 'pickup'))),
  confirmDelivery: (id, body) => unwrap(apiClient.post<DeliveryRequest>(path(id, 'confirm-delivery'), body)),
};

export const deliveriesService: DeliveriesApi = USE_MOCKS ? deliveriesMock : http;
