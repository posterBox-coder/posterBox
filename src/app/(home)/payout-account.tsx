import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { errorMessage } from '@/api/client';
import { useMe, useSavePayoutAccount } from '@/api/hooks/use-account';
import FormScreen from '@/components/shared/FormScreen';
import PayoutFields from '@/components/shared/forms/PayoutFields';
import AppButton from '@/components/ui/AppButton';
import Typography from '@/components/ui/Typography';
import { payoutFormSchema } from '@/schemas/forms';
import type { PayoutFormValues } from '@/types';
import { maskAccountNumber } from '@/utils/format';

export default function PayoutAccountScreen() {
  const { data: me } = useMe();
  const savePayout = useSavePayoutAccount();
  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: {
      bankCode: me?.payoutAccount?.bankCode ?? '',
      accountNumber: me?.payoutAccount?.accountNumber ?? '',
    },
  });

  const onSave = form.handleSubmit(async (values) => {
    try {
      await savePayout.mutateAsync(values);
      router.back();
    } catch (error) {
      Alert.alert('Could not save account', errorMessage(error));
    }
  });

  return (
    <FormScreen
      title="Payout settings"
      footer={
        <AppButton title="Save" handlePress={onSave} isLoading={savePayout.isPending} disabled={savePayout.isPending} />
      }>
      <Typography size={16} weight="700">
        Bank Info
      </Typography>
      <Typography size={13} textType="text2">
        Earnings from deliveries are paid into this account after escrow is released.
      </Typography>
      {me?.payoutAccount ? (
        <Typography size={13} textType="text2">
          Current: {me.payoutAccount.accountName} · {maskAccountNumber(me.payoutAccount.accountNumber)}
        </Typography>
      ) : null}
      <PayoutFields control={form.control} />
    </FormScreen>
  );
}
