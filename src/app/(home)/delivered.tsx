import { router } from 'expo-router';

import { useDelivery } from '@/api/hooks/use-deliveries';
import PackageHero from '@/components/shared/delivery/PackageHero';
import FormScreen from '@/components/shared/FormScreen';
import QueryStatus from '@/components/shared/QueryStatus';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { PAYOUT_STATUS_LABEL } from '@/constants/delivery';
import { useRouteParam } from '@/hooks/use-route-param';
import { formatNaira } from '@/utils/format';

export default function DeliveredScreen() {
  const id = useRouteParam('id');
  const query = useDelivery(id);
  const delivery = query.data;

  return (
    <FormScreen title="Package code" footer={<AppButton title="Done" handlePress={() => router.replace('/(tabs)')} />}>
      <QueryStatus isLoading={query.isLoading} error={query.error} onRetry={query.refetch}>
        {delivery ? (
          <PackageHero
            title="You have delivered this package successfully"
            message="Escrow will be released to your payout account once PosterBox confirms the drop-off."
            code={delivery.trackingId}
            shareMessage={`PosterBox delivery ${delivery.trackingId} has been completed.`}>
            <Typography size={14} textType="text2">
              {formatNaira(delivery.fee)} · {PAYOUT_STATUS_LABEL[delivery.paymentStatus]}
            </Typography>
          </PackageHero>
        ) : null}
      </QueryStatus>
    </FormScreen>
  );
}
