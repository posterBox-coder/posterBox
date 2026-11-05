import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { errorMessage } from '@/api/client';
import { useMe, useSavePayoutAccount } from '@/api/hooks/use-account';
import { useSaveTrip, useTrip } from '@/api/hooks/use-trips';
import FormScreen from '@/components/shared/FormScreen';
import LocationField from '@/components/shared/forms/LocationField';
import PayoutFields from '@/components/shared/forms/PayoutFields';
import AppButton from '@/components/ui/AppButton';
import DateField from '@/components/ui/DateField';
import RadioGroup from '@/components/ui/RadioGroup';
import Typography from '@/components/ui/Typography';
import { CAPACITY_OPTIONS } from '@/constants/delivery';
import { useRouteParam } from '@/hooks/use-route-param';
import { payoutFormSchema, tripFormSchema } from '@/schemas/forms';
import type { PayoutFormValues, TripFormInput } from '@/types';

export default function DoDeliveryScreen() {
  const tripId = useRouteParam('id');
  const { data: existing } = useTrip(tripId || undefined);
  const { data: me } = useMe();
  const saveTrip = useSaveTrip(tripId || undefined);
  const savePayout = useSavePayoutAccount();
  const [step, setStep] = useState<'trip' | 'payout'>('trip');
  const today = useMemo(() => new Date(), []);

  const tripForm = useForm<TripFormInput>({
    resolver: zodResolver(tripFormSchema),
    values: existing
      ? {
          from: existing.from,
          to: existing.to,
          departureDate: existing.departureDate,
          availableCapacityKg: existing.availableCapacityKg,
        }
      : undefined,
    defaultValues: {
      from: undefined,
      to: undefined,
      departureDate: '',
      availableCapacityKg: 2,
    },
  });

  const payoutForm = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: { bankCode: '', accountNumber: '' },
  });

  const createTrip = async (values: TripFormInput) => {
    if (!values.from || !values.to) {
      return;
    }
    await saveTrip.mutateAsync({
      from: values.from,
      to: values.to,
      departureDate: values.departureDate,
      availableCapacityKg: values.availableCapacityKg,
    });
    router.replace('/(tabs)/schedule');
  };

  const onConfirmTrip = tripForm.handleSubmit(async (values) => {
    try {
      if (!tripId && !me?.payoutAccount) {
        setStep('payout');
        return;
      }
      await createTrip(values);
    } catch (error) {
      Alert.alert('Could not save trip', errorMessage(error));
    }
  });

  const onConfirmPayout = payoutForm.handleSubmit(async (payout) => {
    try {
      await savePayout.mutateAsync(payout);
      await createTrip(tripForm.getValues());
    } catch (error) {
      Alert.alert('Could not save payout details', errorMessage(error));
    }
  });

  if (step === 'payout') {
    return (
      <FormScreen
        title="Bank Info"
        onBack={() => setStep('trip')}
        footer={
          <AppButton
            title="Confirm"
            handlePress={onConfirmPayout}
            isLoading={savePayout.isPending || saveTrip.isPending}
            disabled={savePayout.isPending || saveTrip.isPending}
          />
        }>
        <Typography size={16} weight="700">
          Where should we pay you?
        </Typography>
        <Typography size={13} textType="text2">
          We only ask for this once. You can change it later in Account.
        </Typography>
        <PayoutFields control={payoutForm.control} />
      </FormScreen>
    );
  }

  return (
    <FormScreen
      title="Do Delivery"
      footer={
        <AppButton
          title="Confirm"
          handlePress={onConfirmTrip}
          isLoading={saveTrip.isPending}
          disabled={saveTrip.isPending}
        />
      }>
      <Typography size={16} weight="700">
        Schedule a day to do delivery.
      </Typography>
      <LocationField
        name="from"
        control={tripForm.control}
        label=""
        placeholder="Traveling from"
        sheetTitle="Traveling from"
        icon="focus-3-line"
      />
      <LocationField
        name="to"
        control={tripForm.control}
        label=""
        placeholder="Traveling to"
        sheetTitle="Traveling to"
        icon="map-pin-2-fill"
      />
      <Typography size={14} weight="500">
        Select Date of Departure
      </Typography>
      <DateField name="departureDate" control={tripForm.control} label="Date" minimumDate={today} />
      <RadioGroup
        name="availableCapacityKg"
        control={tripForm.control}
        label="Available Space"
        variant="list"
        options={[...CAPACITY_OPTIONS]}
      />
    </FormScreen>
  );
}
