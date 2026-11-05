import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-remix-icon';

import { useTracking } from '@/api/hooks/use-deliveries';
import QueryStatus from '@/components/shared/QueryStatus';
import ScreenHeader from '@/components/shared/ScreenHeader';
import StatusChip from '@/components/shared/StatusChip';
import DeliveryTimeline from '@/components/shared/track/DeliveryTimeline';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { useRouteParam } from '@/hooks/use-route-param';
import { useTheme } from '@/hooks/use-theme';
import { formatLocation } from '@/utils/format';
import { push } from '@/utils/nav';

export default function TrackDetailsScreen() {
  const trackingNo = useRouteParam('trackingNo');
  return <TrackDetailsBody key={trackingNo} trackingNo={trackingNo} />;
}

function TrackDetailsBody({ trackingNo }: { trackingNo: string }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const query = useTracking(trackingNo.trim().toUpperCase());
  const record = query.data;

  return (
    <ThemedView style={styles.screen}>
      <ScreenHeader title="Track Delivery" />
      <View style={[styles.sheet, { backgroundColor: theme.background }]}>
        <View style={styles.sheetHeader}>
          <Typography size={16} weight="700" align="center" style={styles.sheetTitle}>
            Tracking Details
          </Typography>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.close} accessibilityLabel="Close">
            <Icon name="close-line" size={22} color={theme.text} />
          </Pressable>
        </View>

        <QueryStatus
          isLoading={query.isLoading}
          error={query.error}
          onRetry={() => (query.error ? router.replace('/(home)/track') : query.refetch())}>
          {record ? (
            <>
              <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <StatusChip status={record.status} />
                <Typography size={12} textType="text2" style={styles.label}>
                  Tracking No
                </Typography>
                <Typography size={20} weight="700" style={styles.trackingNo}>
                  {record.trackingId}
                </Typography>
                <Typography size={13} textType="text2">
                  {formatLocation(record.from)} → {formatLocation(record.to)}
                </Typography>
                <Typography size={13} textType="text2" style={styles.timelineLabel}>
                  Delivery Timeline
                </Typography>
                <DeliveryTimeline events={record.timeline} />
              </ScrollView>
              <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                <AppButton
                  title="Delivery Details"
                  handlePress={() => push('/(home)/delivery/[id]', { id: record.id })}
                />
              </View>
            </>
          ) : null}
        </QueryStatus>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    marginTop: -16,
    paddingTop: 16,
  },
  sheetHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 16,
  },
  sheetTitle: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    right: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  label: {
    marginTop: 12,
  },
  trackingNo: {
    marginBottom: 8,
    marginTop: 4,
  },
  timelineLabel: {
    marginBottom: 16,
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 16,
  },
});
