import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { errorMessage } from '@/api/client';
import { useDeleteTrips, useTrips } from '@/api/hooks/use-trips';
import ConfirmSheet from '@/components/shared/ConfirmSheet';
import EmptyState from '@/components/shared/EmptyState';
import QueryStatus from '@/components/shared/QueryStatus';
import ScreenHeader from '@/components/shared/ScreenHeader';
import TripCard from '@/components/shared/schedule/TripCard';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/AppButton';

export default function ScheduleScreen() {
  const query = useTrips();
  const remove = useDeleteTrips();
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const items = query.data ?? [];

  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const onDelete = async () => {
    try {
      await remove.mutateAsync(selected);
      setSelected([]);
      setSelecting(false);
      setConfirm(false);
    } catch (error) {
      Alert.alert('Could not delete trips', errorMessage(error));
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Schedule" showBack={false} />
      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-schedule-line"
              title="No trips scheduled"
              message="Tap Do Delivery on Home to publish a trip and start receiving requests."
              actionLabel="Do Delivery"
              onAction={() => router.push('/(home)/do-delivery')}
            />
          }
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              selecting={selecting}
              selected={selected.includes(item.id)}
              onPress={() => {
                if (selecting) {
                  toggle(item.id);
                  return;
                }
                router.push({ pathname: '/(home)/do-delivery', params: { id: item.id } });
              }}
            />
          )}
        />
      </QueryStatus>
      {items.length ? (
        <View style={styles.footer}>
          {selecting ? (
            <View style={styles.row}>
              <AppButton
                title="Cancel"
                variant="secondary"
                handlePress={() => {
                  setSelecting(false);
                  setSelected([]);
                }}
                style={styles.half}
              />
              <AppButton
                title="Delete"
                handlePress={() => setConfirm(true)}
                disabled={!selected.length}
                style={styles.half}
              />
            </View>
          ) : (
            <View style={styles.row}>
              <AppButton title="Select" variant="secondary" handlePress={() => setSelecting(true)} style={styles.half} />
              <AppButton title="Add trip" handlePress={() => router.push('/(home)/do-delivery')} style={styles.half} />
            </View>
          )}
        </View>
      ) : null}

      <ConfirmSheet
        visible={confirm}
        onClose={() => setConfirm(false)}
        title="Delete trips"
        message="Selected trips will be cancelled and will no longer appear to senders."
        confirmLabel="Delete"
        onConfirm={onDelete}
        isLoading={remove.isPending}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
    width: undefined,
  },
});
