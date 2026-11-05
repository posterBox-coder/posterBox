import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { useDelivery } from '@/api/hooks/use-deliveries';
import FormScreen from '@/components/shared/FormScreen';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { Palette } from '@/constants/theme';
import { useRouteParam } from '@/hooks/use-route-param';
import { formatNaira } from '@/utils/format';
import { replace } from '@/utils/nav';

export default function PaymentSuccessScreen() {
  const id = useRouteParam('id');
  const { data: delivery } = useDelivery(id);

  return (
    <FormScreen
      title="Payment"
      footer={
        <AppButton
          title="Get Package Code"
          handlePress={() => replace('/(home)/tracking-code', { id })}
        />
      }>
      <View style={styles.hero}>
        <View style={styles.icon}>
          <Icon name="checkbox-circle-fill" size={72} color={Palette.successGreen} />
        </View>
        <Typography size={22} weight="700" align="center">
          Payment successful
        </Typography>
        <Typography size={14} textType="text2" align="center" style={styles.copy}>
          {delivery ? formatNaira(delivery.fee) : 'Your payment'} is now held in escrow by PosterBox. We only
          release it to the traveler after the receiver confirms delivery.
        </Typography>
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    paddingTop: 40,
  },
  icon: {
    marginBottom: 8,
  },
  copy: {
    maxWidth: 320,
  },
});
