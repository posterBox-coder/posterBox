import { Alert, FlatList, StyleSheet } from 'react-native';

import { errorMessage } from '@/api/client';
import { useDeliveries, useDeliveryAction } from '@/api/hooks/use-deliveries';
import { useMarkNotificationRead, useNotifications } from '@/api/hooks/use-notifications';
import EmptyState from '@/components/shared/EmptyState';
import NotificationCard from '@/components/shared/notifications/NotificationCard';
import QueryStatus from '@/components/shared/QueryStatus';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { ThemedView } from '@/components/themed-view';
import { daysBetween, formatDays, toISODate } from '@/utils/format';
import type { AppNotification } from '@/types';
import { push } from '@/utils/nav';

export default function NotificationsScreen() {
  const query = useNotifications();
  const pending = useDeliveries({ role: 'TRAVELER', status: 'AWAITING_TRAVELER' });
  const accept = useDeliveryAction('accept');
  const decline = useDeliveryAction('decline');
  const markRead = useMarkNotificationRead();
  const items = query.data ?? [];

  const metaFor = (item: AppNotification) => {
    const delivery = pending.data?.find((entry) => entry.id === item.requestId);
    if (item.type === 'DELIVERY_REQUEST' && delivery) {
      return `Within: ${formatDays(daysBetween(toISODate(new Date()), delivery.window.to))}`;
    }
    return undefined;
  };

  const open = (item: AppNotification) => {
    if (!item.requestId) {
      return;
    }
    markRead.mutate(item.id);
    if (item.type === 'DELIVERY_REQUEST') {
      push('/(home)/request-details', { id: item.requestId });
      return;
    }
    push('/(home)/delivery/[id]', { id: item.requestId });
  };

  const respond = async (item: AppNotification, action: 'accept' | 'decline') => {
    if (!item.requestId) {
      return;
    }
    try {
      await (action === 'accept' ? accept : decline).mutateAsync(item.requestId);
      if (action === 'accept') {
        push('/(home)/ongoing-delivery', { id: item.requestId });
      }
    } catch (error) {
      Alert.alert('Could not update request', errorMessage(error));
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Notifications" />
      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="notification-3-line"
              title="No notifications"
              message="New delivery requests and package updates will appear here."
            />
          }
          renderItem={({ item }) => (
            <NotificationCard
              item={item}
              meta={metaFor(item)}
              onAccept={(current) => respond(current, 'accept')}
              onDecline={(current) => respond(current, 'decline')}
              onView={open}
            />
          )}
        />
      </QueryStatus>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
});
