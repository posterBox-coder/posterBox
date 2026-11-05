import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deliveriesService } from '@/api/services/deliveries';
import { paymentsService } from '@/api/services/payments';
import { trackingService } from '@/api/services/tracking';
import type { DeliveryListParams, DeliveryRequest, PaymentMethod } from '@/types';

import { queryKeys } from './query-keys';

export const useDeliveries = (params: DeliveryListParams) =>
  useQuery({ queryKey: queryKeys.deliveryList(params), queryFn: () => deliveriesService.list(params) });

export const useDelivery = (id: string) =>
  useQuery({ queryKey: queryKeys.delivery(id), queryFn: () => deliveriesService.get(id), enabled: !!id });

export const useMatches = (id: string) =>
  useQuery({ queryKey: queryKeys.matches(id), queryFn: () => deliveriesService.matches(id), enabled: !!id });

export const useTracking = (trackingId: string) =>
  useQuery({
    queryKey: queryKeys.tracking(trackingId),
    queryFn: () => trackingService.get(trackingId),
    enabled: !!trackingId,
    retry: false,
  });

/** Keeps the detail cache fresh and refreshes every list that could show the request. */
function useSyncDelivery() {
  const queryClient = useQueryClient();
  return (delivery: DeliveryRequest) => {
    queryClient.setQueryData(queryKeys.delivery(delivery.id), delivery);
    queryClient.invalidateQueries({ queryKey: queryKeys.deliveries });
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    queryClient.invalidateQueries({ queryKey: ['tracking'] });
  };
}

export function useCreateDelivery() {
  const sync = useSyncDelivery();
  return useMutation({ mutationFn: deliveriesService.create, onSuccess: sync });
}

export function useSelectTraveler(id: string) {
  const sync = useSyncDelivery();
  return useMutation({
    mutationFn: (body: { travelerId: string; tripId: string }) => deliveriesService.selectTraveler(id, body),
    onSuccess: sync,
  });
}

export function useStartPayment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (method: PaymentMethod) => paymentsService.start(id, method),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.deliveries }),
  });
}

type DeliveryAction = 'cancel' | 'accept' | 'decline' | 'pickup';

export function useDeliveryAction(action: DeliveryAction) {
  const sync = useSyncDelivery();
  return useMutation({ mutationFn: (id: string) => deliveriesService[action](id), onSuccess: sync });
}

export function useConfirmDelivery(id: string) {
  const sync = useSyncDelivery();
  return useMutation({
    mutationFn: (code: string) => deliveriesService.confirmDelivery(id, { code }),
    onSuccess: sync,
  });
}
