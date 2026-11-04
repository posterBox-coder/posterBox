import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationsService } from '@/api/services/notifications';

import { queryKeys } from './query-keys';

export const useNotifications = () =>
  useQuery({ queryKey: queryKeys.notifications, queryFn: notificationsService.list });

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsService.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
}
