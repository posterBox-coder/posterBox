import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { useDeliveries } from '@/api/hooks/use-deliveries';
import EmptyState from '@/components/shared/EmptyState';
import QueryStatus from '@/components/shared/QueryStatus';
import ScreenHeader from '@/components/shared/ScreenHeader';
import StatusChip from '@/components/shared/StatusChip';
import { ThemedView } from '@/components/themed-view';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Role } from '@/types';
import { formatDate, formatLocation } from '@/utils/format';
import { push } from '@/utils/nav';

const ROLES: { value: Role; label: string }[] = [
  { value: 'SENDER', label: 'Sending' },
  { value: 'TRAVELER', label: 'Delivering' },
];

export default function ActivityScreen() {
  const theme = useTheme();
  const [role, setRole] = useState<Role>('SENDER');
  const query = useDeliveries({ role });
  const items = query.data ?? [];

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Activity" showBack={false} />
      <View style={styles.filter}>
        <SegmentedControl options={ROLES} value={role} onChange={setRole} />
      </View>
      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="time-line"
              title="No activity yet"
              message="Your delivery activity will appear here once you start sending or delivering packages."
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => push('/(home)/delivery/[id]', { id: item.id })}
              style={[styles.card, { backgroundColor: theme.background }]}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
             <Typography size={15} weight="700">
                {item.trackingId}
              </Typography>
              <StatusChip status={item.status} />
             </View>
              <Typography size={13} textType="text2">
                {formatLocation(item.sender.location)} → {formatLocation(item.receiver.location)}
              </Typography>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
             {role === 'SENDER' ? (
              <Typography size={12} textType="text3">
                By {item.traveler?.fullName}
              </Typography>
             ) : (
              <Typography size={12} textType="text3">
                To {item.sender?.fullName}
              </Typography>
             )}
              <Typography size={12} textType="text3">
                {formatDate(item.createdAt)}
              </Typography>
             </View>
             
            </Pressable>
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
  filter: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    flexGrow: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    elevation: 3,
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
});
