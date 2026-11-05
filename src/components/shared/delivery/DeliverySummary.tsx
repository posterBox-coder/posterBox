import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import DetailsCard, { DetailDivider, DetailRow } from '@/components/shared/DetailsCard';
import { PARCEL_SIZES } from '@/constants/delivery';
import Images from '@/constants/images';
import type { DeliveryRequest } from '@/types';
import { daysBetween, formatDateRange, formatDays, formatLocation, formatNaira, formatWeightRange } from '@/utils/format';

type DeliverySummaryProps = {
  delivery: DeliveryRequest;
  showHero?: boolean;
};

export default function DeliverySummary({ delivery, showHero = true }: DeliverySummaryProps) {
  const size = PARCEL_SIZES[delivery.package.size];
  const days = daysBetween(delivery.window.from, delivery.window.to);

  return (
    <DetailsCard>
      {showHero ? (
        <View style={styles.hero}>
          <Image source={Images.packageBox} style={styles.box} contentFit="contain" />
        </View>
      ) : null}
      <DetailRow
        label="From"
        value={`${delivery.sender.fullName} · ${formatLocation(delivery.sender.location)}`}
        caption={delivery.sender.location.address}
      />
      <DetailRow
        label="To"
        value={`${delivery.receiver.fullName} · ${formatLocation(delivery.receiver.location)}`}
        caption={delivery.receiver.location.address}
      />
      <DetailRow label="Timeline" value={formatDays(days)} caption={formatDateRange(delivery.window.from, delivery.window.to)} />
      <DetailRow
        label="Weight"
        value={formatWeightRange(delivery.package.weightRangeKg)}
        caption={`${size.label}${delivery.package.quantity > 1 ? ` · ${delivery.package.quantity} items` : ''}`}
      />
      {delivery.package.description ? <DetailRow label="Package" value={delivery.package.description} /> : null}
      <DetailRow label="Instructions" value={delivery.package.instructions || 'None'} caption={delivery.package.instructions ? undefined : 'Optional'} />
      <DetailDivider />
      <DetailRow label="Fee" value={formatNaira(delivery.fee)} caption={formatWeightRange(delivery.package.weightRangeKg)} emphasis />
    </DetailsCard>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
  },
  box: {
    height: 120,
    width: 120,
  },
});
