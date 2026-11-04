import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tripsService } from '@/api/services/trips';
import type { TripPayload } from '@/types';

import { queryKeys } from './query-keys';

export const useTrips = () => useQuery({ queryKey: queryKeys.trips, queryFn: tripsService.list });

export const useTrip = (id?: string) =>
  useQuery({ queryKey: queryKeys.trip(id ?? ''), queryFn: () => tripsService.get(id!), enabled: !!id });

export function useSaveTrip(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TripPayload) => (id ? tripsService.update(id, payload) : tripsService.create(payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trips }),
  });
}

export function useDeleteTrips() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => tripsService.remove(id))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trips }),
  });
}
