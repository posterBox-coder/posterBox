import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { errorMessage } from '@/api/client';
import { useDelivery, useMatches, useSelectTraveler } from '@/api/hooks/use-deliveries';
import TravelerCard from '@/components/shared/delivery/TravelerCard';
import TravelerMap from '@/components/shared/delivery/TravelerMap';
import EmptyState from '@/components/shared/EmptyState';
import QueryStatus from '@/components/shared/QueryStatus';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import AppButton from '@/components/ui/AppButton';
import BottomSheetModal from '@/components/ui/BottomSheetModal';
import Typography from '@/components/ui/Typography';
import { useRouteParam } from '@/hooks/use-route-param';
import type { TravelerMatch } from '@/types';
import { formatDate, formatLocation, formatNaira } from '@/utils/format';
import { push } from '@/utils/nav';

export default function FindTravelerScreen() {
  const id = useRouteParam('id');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const delivery = useDelivery(id);
  const matches = useMatches(id);
  const selectTraveler = useSelectTraveler(id);
  const [selectedId, setSelectedId] = useState<string>();
  const [info, setInfo] = useState<TravelerMatch>();
  const items = matches.data ?? [];
  const selected = items.find((item) => item.traveler.id === selectedId);

  const continueWithTraveler = async () => {
    if (!selected) {
      Alert.alert('Pick a traveler', 'Select someone from the list to continue.');
      return;
    }
    try {
      await selectTraveler.mutateAsync({ travelerId: selected.traveler.id, tripId: selected.trip.id });
      push('/(home)/request-details', { id });
    } catch (error) {
      Alert.alert('Could not assign traveler', errorMessage(error));
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Find a traveler" />
      <View style={styles.map}>
        <TravelerMap matches={items} selectedId={selectedId} onSelect={setSelectedId} />
      </View>
      <View style={[styles.sheet, { backgroundColor: theme.background, paddingBottom: Math.max(insets.bottom, 24) }]}>
        <QueryStatus isLoading={matches.isLoading || delivery.isLoading} error={matches.error ?? delivery.error} onRetry={matches.refetch}>
          {items.length ? (
            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
              {items.map((item) => (
                <TravelerCard
                  key={item.traveler.id}
                  match={item}
                  selected={item.traveler.id === selectedId}
                  onPress={() => setSelectedId(item.traveler.id)}
                  onInfo={() => setInfo(item)}
                />
              ))}
            </ScrollView>
          ) : (
            <EmptyState
              icon="user-location-line"
              title="No travelers on this route"
              message="Try a wider delivery window or check again later."
            />
          )}
        </QueryStatus>
        <AppButton
          title="Continue"
          handlePress={continueWithTraveler}
          isLoading={selectTraveler.isPending}
          disabled={selectTraveler.isPending || !selected}
        />
      </View>

      <BottomSheetModal visible={!!info} onClose={() => setInfo(undefined)} title={info?.traveler.fullName ?? 'Traveler'}>
        {info ? (
          <View style={styles.info}>
            <Typography size={14} textType="text2">
              {formatLocation(info.currentLocation)}
            </Typography>
            <Typography size={14}>Rating: {info.traveler.rating?.toFixed(1) ?? 'New'}</Typography>
            <Typography size={14}>Departs {formatDate(info.trip.departureDate)}</Typography>
            <Typography size={14}>Space: {info.trip.availableCapacityKg}kg</Typography>
            <Typography size={14}>Estimated fee: {formatNaira(info.estimatedFee)}</Typography>
          </View>
        ) : null}
      </BottomSheetModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
    marginTop: -28,
    maxHeight: '52%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    gap: 10,
    paddingBottom: 8,
  },
  info: {
    gap: 10,
    paddingBottom: 8,
  },
});
