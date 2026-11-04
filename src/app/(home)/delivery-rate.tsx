import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

import { errorMessage } from '@/api/client';
import { useCreateQuote } from '@/api/hooks/use-locations';
import FormScreen from '@/components/shared/FormScreen';
import LocationField from '@/components/shared/forms/LocationField';
import ParcelSizePicker from '@/components/shared/forms/ParcelSizePicker';
import AppButton from '@/components/ui/AppButton';
import BottomSheetModal from '@/components/ui/BottomSheetModal';
import Input from '@/components/ui/Input';
import QuantityStepper from '@/components/ui/QuantityStepper';
import Typography from '@/components/ui/Typography';
import { PARCEL_SIZES } from '@/constants/delivery';
import { quoteFormSchema } from '@/schemas/forms';
import type { Quote, QuoteFormInput } from '@/types';
import { formatLocation, formatNaira, formatWeightRange, toKobo } from '@/utils/format';

export default function DeliveryRateScreen() {
  const createQuote = useCreateQuote();
  const [quote, setQuote] = useState<Quote>();
  const form = useForm<QuoteFormInput>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      from: undefined,
      to: undefined,
      quantity: 1,
      size: 'SMALL',
      declaredValue: '',
    },
  });

  const onQuote = form.handleSubmit(async (values) => {
    if (!values.from || !values.to) {
      return;
    }
    try {
      const result = await createQuote.mutateAsync({
        from: values.from,
        to: values.to,
        quantity: values.quantity,
        size: values.size,
        declaredValue: values.declaredValue ? toKobo(Number(values.declaredValue)) : undefined,
      });
      setQuote(result);
    } catch (error) {
      Alert.alert('Could not get a quote', errorMessage(error));
    }
  });

  const requestDelivery = () => {
    if (!quote) {
      return;
    }
    setQuote(undefined);
    router.push({
      pathname: '/(home)/send-package',
      params: {
        fromState: quote.from.state,
        fromCity: quote.from.city,
        toState: quote.to.state,
        toCity: quote.to.city,
        quantity: String(quote.quantity),
        size: quote.size,
        declaredValue: form.getValues('declaredValue') ?? '',
      },
    });
  };

  return (
    <FormScreen
      title="Delivery Rate"
      footer={
        <AppButton
          title="Get Quote"
          handlePress={onQuote}
          isLoading={createQuote.isPending}
          disabled={createQuote.isPending}
        />
      }>
      <Typography size={16} weight="700">
        Check delivery rate
      </Typography>
      <LocationField
        name="from"
        control={form.control}
        label="From"
        placeholder="Sending from"
        sheetTitle="Sending from"
        icon="focus-3-line"
      />
      <LocationField
        name="to"
        control={form.control}
        label="To"
        placeholder="Sending to"
        sheetTitle="Sending to"
        icon="map-pin-2-fill"
      />
      <QuantityStepper name="quantity" control={form.control} />
      <ParcelSizePicker name="size" control={form.control} />
      <Input
        name="declaredValue"
        control={form.control}
        label="Value of Package (optional)"
        keyboardType="number-pad"
        placeholder="Amount in naira"
      />

      <BottomSheetModal visible={!!quote} onClose={() => setQuote(undefined)} title="Delivery Quote">
        {quote ? (
          <View style={styles.quote}>
            <QuoteRow label="From" value={formatLocation(quote.from)} />
            <QuoteRow label="To" value={formatLocation(quote.to)} />
            <QuoteRow label="Quantity" value={String(quote.quantity)} />
            <QuoteRow label="Weight" value={formatWeightRange(PARCEL_SIZES[quote.size].weightRangeKg)} />
            <QuoteRow label="Cost" value={formatNaira(quote.cost)} />
            <AppButton title="Request Delivery" handlePress={requestDelivery} />
          </View>
        ) : null}
      </BottomSheetModal>
    </FormScreen>
  );
}

function QuoteRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.quoteRow}>
      <Typography size={13} textType="text2">
        {label}
      </Typography>
      <Typography size={15} weight="600">
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  quote: {
    gap: 14,
    paddingBottom: 8,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
