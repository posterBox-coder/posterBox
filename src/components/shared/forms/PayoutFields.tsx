import { type Control, useWatch } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useBanks, useResolveAccount } from '@/api/hooks/use-account';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';
import Typography from '@/components/ui/Typography';
import type { PayoutFormValues } from '@/types';
import { useTheme } from '@/hooks/use-theme';

type PayoutFieldsProps = {
  control: Control<PayoutFormValues>;
};

export default function PayoutFields({ control }: PayoutFieldsProps) {
  const theme = useTheme();
  const { data: banks = [], isLoading } = useBanks();
  const bankCode = useWatch({ control, name: 'bankCode' });
  const accountNumber = useWatch({ control, name: 'accountNumber' }) ?? '';
  const resolved = useResolveAccount(bankCode, accountNumber);

  return (
    <View style={styles.wrap}>
      <SelectField
        name="bankCode"
        control={control}
        label="Bank"
        placeholder="Select bank"
        options={banks.map((bank) => ({ label: bank.name, value: bank.code }))}
        isLoading={isLoading}
      />
      <Input
        name="accountNumber"
        control={control}
        label="Account Number"
        keyboardType="number-pad"
        maxLength={10}
      />
      {resolved.isFetching ? (
        <ActivityIndicator color={theme.primary} style={styles.status} />
      ) : resolved.data ? (
        <Typography size={14} weight="600" color={theme.text2}>
          {resolved.data.accountName}
        </Typography>
      ) : resolved.error && accountNumber.length === 10 ? (
        <Typography size={13} color={theme.primary}>
          We could not match this account. Check the number and try again.
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 16,
  },
  status: {
    alignSelf: 'flex-start',
  },
});
