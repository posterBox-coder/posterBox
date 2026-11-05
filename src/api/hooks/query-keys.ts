import type { DeliveryListParams } from '@/types';

export const queryKeys = {
  me: ['me'] as const,
  banks: ['banks'] as const,
  bankAccount: (bankCode: string, accountNumber: string) => ['banks', 'resolve', bankCode, accountNumber] as const,
  states: ['locations', 'states'] as const,
  lgas: (state: string) => ['locations', 'lgas', state] as const,
  deliveries: ['deliveries'] as const,
  deliveryList: (params: DeliveryListParams) => ['deliveries', 'list', params] as const,
  delivery: (id: string) => ['deliveries', 'detail', id] as const,
  matches: (id: string) => ['deliveries', 'matches', id] as const,
  tracking: (trackingId: string) => ['tracking', trackingId] as const,
  trips: ['trips'] as const,
  trip: (id: string) => ['trips', id] as const,
  notifications: ['notifications'] as const,
};
