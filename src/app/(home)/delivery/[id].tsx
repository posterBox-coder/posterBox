import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { errorMessage } from '@/api/client';
import { useMe } from '@/api/hooks/use-account';
import { useDelivery, useDeliveryAction } from '@/api/hooks/use-deliveries';
import ConfirmSheet from '@/components/shared/ConfirmSheet';
import DeliverySummary from '@/components/shared/delivery/DeliverySummary';
import FormScreen from '@/components/shared/FormScreen';
import QueryStatus from '@/components/shared/QueryStatus';
import StatusChip from '@/components/shared/StatusChip';
import DeliveryTimeline from '@/components/shared/track/DeliveryTimeline';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { canSenderCancel, canTravelerRespond, isActiveForTraveler, isInTransit, PAYMENT_STATUS_LABEL } from '@/constants/delivery';
import { useRouteParam } from '@/hooks/use-route-param';
import { useTheme } from '@/hooks/use-theme';
import { formatNaira } from '@/utils/format';
import { push } from '@/utils/nav';

export default function DeliveryDetailsScreen() {
  const id = useRouteParam('id');
  const theme = useTheme();
  const { data: me } = useMe();
  const query = useDelivery(id);
  const cancel = useDeliveryAction('cancel');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const delivery = query.data;
  const isSender = delivery?.senderId === me?.id;
  const isTraveler = delivery?.travelerId === me?.id;

  const onCancel = async () => {
    try {
      await cancel.mutateAsync(id);
      setConfirmCancel(false);
      router.replace('/(tabs)/activity');
    } catch (error) {
      Alert.alert('Could not cancel', errorMessage(error));
    }
  };

  return (
    <FormScreen
      title="Delivery Details"
      footer={
        delivery ? (
          <View style={styles.actions}>
            {isTraveler && canTravelerRespond(delivery.status) ? (
              <AppButton title="Review request" handlePress={() => push('/(home)/request-details', { id })} />
            ) : null}
            {isTraveler && isActiveForTraveler(delivery.status) ? (
              <AppButton
                title={isInTransit(delivery.status) ? 'Confirm Delivery' : 'Open ongoing delivery'}
                handlePress={() =>
                  push(isInTransit(delivery.status) ? '/(home)/confirm-delivery' : '/(home)/ongoing-delivery', { id })
                }
              />
            ) : null}
            {isSender && delivery.status === 'DECLINED' ? (
              <AppButton title="Find another traveler" handlePress={() => push('/(home)/find-traveler', { id })} />
            ) : null}
            <AppButton
              title="Track"
              variant="secondary"
              handlePress={() =>
                router.push({ pathname: '/(home)/track-details', params: { trackingNo: delivery.trackingId } })
              }
            />
            {isSender && canSenderCancel(delivery.status) ? (
              <AppButton title="Cancel Delivery" variant="secondary" handlePress={() => setConfirmCancel(true)} />
            ) : null}
          </View>
        ) : null
      }>
      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        {delivery ? (
          <>
            <StatusChip status={delivery.status} />
            <Typography size={12} textType="text2">
              Tracking No
            </Typography>
            <Typography size={20} weight="700">
              {delivery.trackingId}
            </Typography>
            {isSender && delivery.deliveryCode ? (
              <Typography size={13} textType="text2">
                Delivery code: {delivery.deliveryCode}
              </Typography>
            ) : null}
            <DeliverySummary delivery={delivery} showHero={false} />
            <Typography size={13} textType="text2">
              Payment: {delivery.paymentMethod === 'BANK_TRANSFER' ? 'Bank transfer' : delivery.paymentMethod === 'CARD' ? 'Card' : '—'} ·{' '}
              {PAYMENT_STATUS_LABEL[delivery.paymentStatus]}
            </Typography>
            {delivery.traveler ? (
              <Typography size={13} textType="text2">
                Agent: {delivery.traveler.fullName}
              </Typography>
            ) : (
              <Typography size={13} color={theme.primary}>
                Agent: Yet to be accepted
              </Typography>
            )}
            <Typography size={14} weight="600">
              Delivery Timeline
            </Typography>
            <DeliveryTimeline events={delivery.timeline} />
            <Typography size={13} textType="text2">
              Fee: {formatNaira(delivery.fee)}
            </Typography>
          </>
        ) : null}
      </QueryStatus>

      <ConfirmSheet
        visible={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel delivery"
        message={
          delivery?.paymentStatus === 'HELD_IN_ESCROW'
            ? 'The amount held in escrow will be refunded to you.'
            : 'This delivery will be cancelled.'
        }
        confirmLabel="Cancel delivery"
        onConfirm={onCancel}
        isLoading={cancel.isPending}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
  },
});
