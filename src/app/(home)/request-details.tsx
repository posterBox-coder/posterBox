import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { errorMessage } from '@/api/client';
import { useMe } from '@/api/hooks/use-account';
import { useDelivery, useDeliveryAction, useStartPayment } from '@/api/hooks/use-deliveries';
import ConfirmSheet from '@/components/shared/ConfirmSheet';
import DeliverySummary from '@/components/shared/delivery/DeliverySummary';
import FormScreen from '@/components/shared/FormScreen';
import QueryStatus from '@/components/shared/QueryStatus';
import AppButton from '@/components/ui/AppButton';
import { RadioDot } from '@/components/ui/RadioGroup';
import Typography from '@/components/ui/Typography';
import { PAYMENT_METHODS } from '@/constants/delivery';
import { useRouteParam } from '@/hooks/use-route-param';
import type { PaymentMethod } from '@/types';
import { formatNaira } from '@/utils/format';
import { push, replace } from '@/utils/nav';

export default function RequestDetailsScreen() {
  const id = useRouteParam('id');
  const { data: me } = useMe();
  const query = useDelivery(id);
  const startPayment = useStartPayment(id);
  const accept = useDeliveryAction('accept');
  const decline = useDeliveryAction('decline');
  const cancel = useDeliveryAction('cancel');
  const [method, setMethod] = useState<PaymentMethod>('CARD');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const delivery = query.data;
  const isTraveler = !!delivery && delivery.travelerId === me?.id;
  const awaitingTraveler = delivery?.status === 'AWAITING_TRAVELER';
  const pendingPayment = delivery?.status === 'PENDING_PAYMENT';

  const pay = async () => {
    try {
      await startPayment.mutateAsync(method);
      replace('/(home)/payment-success', { id });
    } catch (error) {
      Alert.alert('Payment failed', errorMessage(error));
    }
  };

  const respond = async (action: 'accept' | 'decline') => {
    try {
      await (action === 'accept' ? accept : decline).mutateAsync(id);
      if (action === 'accept') {
        replace('/(home)/ongoing-delivery', { id });
        return;
      }
      router.back();
    } catch (error) {
      Alert.alert('Could not update request', errorMessage(error));
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
    <FormScreen
      title="Request Details"
      footer={
        delivery ? (
          isTraveler && awaitingTraveler ? (
            <View style={styles.row}>
              <AppButton title="Decline" variant="secondary" handlePress={() => respond('decline')} style={styles.half} />
              <AppButton
                title="Accept"
                handlePress={() => respond('accept')}
                isLoading={accept.isPending}
                disabled={accept.isPending || decline.isPending}
                style={styles.half}
              />
            </View>
          ) : pendingPayment ? (
            <View style={styles.row}>
              <AppButton title="Cancel" variant="secondary" handlePress={() => setConfirmCancel(true)} style={styles.half} />
              <AppButton
                title="Proceed"
                handlePress={pay}
                isLoading={startPayment.isPending}
                disabled={startPayment.isPending}
                style={styles.half}
              />
            </View>
          ) : (
            <AppButton title="View delivery" handlePress={() => push('/(home)/delivery/[id]', { id })} />
          )
        ) : null
      }>
      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        {delivery ? (
          <>
            <DeliverySummary delivery={delivery} />
            {delivery.traveler ? (
              <Typography size={13} textType="text2">
                Traveler: {delivery.traveler.fullName}
                {delivery.traveler.rating ? ` · ${delivery.traveler.rating.toFixed(1)}` : ''}
              </Typography>
            ) : null}
            {pendingPayment ? (
              <View style={styles.payment}>
                <Typography size={14} weight="500">
                  Payment option
                </Typography>
                <View style={styles.methods}>
                  {PAYMENT_METHODS.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => setMethod(option.value)}
                      style={styles.method}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: method === option.value }}>
                      <RadioDot selected={method === option.value} />
                      <Typography size={14}>{option.label}</Typography>
                    </Pressable>
                  ))}
                </View>
                <Typography size={12} textType="text3">
                  {formatNaira(delivery.fee)} is held in escrow by PosterBox until delivery is confirmed.
                </Typography>
              </View>
            ) : null}
          </>
        ) : null}
      </QueryStatus>

      <ConfirmSheet
        visible={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel delivery"
        message="This request will be cancelled. If you have already paid, the amount held in escrow will be refunded."
        confirmLabel="Cancel delivery"
        onConfirm={onCancel}
        isLoading={cancel.isPending}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
    width: undefined,
  },
  payment: {
    gap: 12,
  },
  methods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 28,
  },
  method: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
