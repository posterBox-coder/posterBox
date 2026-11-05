import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useDelivery } from '@/api/hooks/use-deliveries';
import PackageHero from '@/components/shared/delivery/PackageHero';
import FormScreen from '@/components/shared/FormScreen';
import QueryStatus from '@/components/shared/QueryStatus';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { useRouteParam } from '@/hooks/use-route-param';
import { formatDate, formatWeightRange } from '@/utils/format';

export default function TrackingCodeScreen() {
  const id = useRouteParam('id');
  const query = useDelivery(id);
  const delivery = query.data;

  return (
    <FormScreen
    onBack={() => router.replace('/(tabs)')}
      title="Package code"
      footer={<AppButton title="Continue" handlePress={() => router.replace('/(tabs)')} />}>
      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        {delivery ? (
          <PackageHero
            title="Package code generated"
            message="Your tracking number is ready. Share the delivery code with the receiver — they will give it to the traveler at drop-off."
            code={delivery.trackingId}
            shareMessage={`Track this PosterBox delivery with ${delivery.trackingId}`}>
            {delivery.deliveryCode ? (
              <View style={styles.codeBlock}>
                <Typography size={12} textType="text2">
                  Delivery code (for the receiver)
                </Typography>
                <Typography size={18} weight="700">
                  {delivery.deliveryCode}
                </Typography>
              </View>
            ) : null}
            <View style={styles.summary}>
              <Typography size={14}>Sender: {delivery.sender.fullName}</Typography>
              <Typography size={14}>Receiver: {delivery.receiver.fullName}</Typography>
              <Typography size={14}>
                Package: {delivery.package.size.toLowerCase()} {formatWeightRange(delivery.package.weightRangeKg)}
              </Typography>
              <Typography size={14}>Delivery date: {formatDate(delivery.window.to)}</Typography>
            </View>
          </PackageHero>
        ) : null}
      </QueryStatus>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  codeBlock: {
    alignItems: 'center',
    gap: 4,
  },
  summary: {
    alignSelf: 'stretch',
    gap: 8,
    paddingTop: 12,
  },
});
