import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-remix-icon';

import { errorMessage } from '@/api/client';
import { useDelivery, useDeliveryAction } from '@/api/hooks/use-deliveries';
import ConfirmSheet from '@/components/shared/ConfirmSheet';
import QueryStatus from '@/components/shared/QueryStatus';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { isInTransit } from '@/constants/delivery';
import Images from '@/constants/images';
import { useRouteParam } from '@/hooks/use-route-param';
import { useTheme } from '@/hooks/use-theme';
import { formatLocation } from '@/utils/format';
import { push } from '@/utils/nav';

export default function OngoingDeliveryScreen() {
  const id = useRouteParam('id');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const query = useDelivery(id);
  const pickup = useDeliveryAction('pickup');
  const cancel = useDeliveryAction('cancel');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const delivery = query.data;
  const pickedUp = delivery ? isInTransit(delivery.status) : false;

  const markPickedUp = async () => {
    try {
      await pickup.mutateAsync(id);
    } catch (error) {
      Alert.alert('Could not update delivery', errorMessage(error));
    }
  };

  const onCancel = async () => {
    try {
      await cancel.mutateAsync(id);
      setConfirmCancel(false);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Could not cancel', errorMessage(error));
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Typography size={16} weight="700" align="center" style={styles.title}>
          Ongoing Delivery
        </Typography>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.close} accessibilityLabel="Close">
          <Icon name="close-line" size={24} color={theme.text} />
        </Pressable>
      </View>

      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        {delivery ? (
          <View style={styles.body}>
            <Image source={Images.deliveryRider} style={styles.hero} contentFit="contain" />
            <View style={styles.route}>
              <Typography size={13} textType="text2" align="center">
                From
              </Typography>
              <Typography size={16} weight="600" align="center">
                {delivery.sender.fullName}, {formatLocation(delivery.sender.location)}.
              </Typography>
              <Typography size={13} textType="text2" align="center" style={styles.to}>
                To
              </Typography>
              <Typography size={16} weight="600" align="center">
                {delivery.receiver.fullName}, {formatLocation(delivery.receiver.location)}.
              </Typography>
            </View>
          </View>
        ) : null}
      </QueryStatus>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <Pressable onPress={() => setConfirmCancel(true)} hitSlop={8}>
          <Typography size={15} weight="600" color={theme.primary} align="center">
            Cancel Delivery
          </Typography>
        </Pressable>
        <AppButton
          title={pickedUp ? 'Confirm Delivery' : 'Package Picked Up'}
          handlePress={() => {
            if (pickedUp) {
              push('/(home)/confirm-delivery', { id });
              return;
            }
            markPickedUp();
          }}
          isLoading={pickup.isPending}
          disabled={pickup.isPending}
        />
      </View>

      <ConfirmSheet
        visible={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel delivery"
        message="This request will go back to the sender so they can pick another traveler."
        confirmLabel="Cancel delivery"
        onConfirm={onCancel}
        isLoading={cancel.isPending}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  title: {
    paddingHorizontal: 40,
  },
  close: {
    position: 'absolute',
    right: 16,
    top: undefined,
    bottom: 8,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  hero: {
    alignSelf: 'center',
    height: 220,
    width: 220,
  },
  route: {
    gap: 6,
    marginTop: 28,
  },
  to: {
    marginTop: 12,
  },
  footer: {
    gap: 16,
    paddingHorizontal: 16,
  },
});
