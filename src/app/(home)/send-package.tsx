import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';

import { useCreateDelivery } from '@/api/hooks/use-deliveries';
import { useMe } from '@/api/hooks/use-account';
import { errorMessage } from '@/api/client';
import ContactFields from '@/components/shared/forms/ContactFields';
import ParcelSizePicker from '@/components/shared/forms/ParcelSizePicker';
import FormScreen from '@/components/shared/FormScreen';
import StepIndicator from '@/components/shared/StepIndicator';
import AppButton from '@/components/ui/AppButton';
import DateField from '@/components/ui/DateField';
import Input from '@/components/ui/Input';
import QuantityStepper from '@/components/ui/QuantityStepper';
import Typography from '@/components/ui/Typography';
import { PARCEL_SIZES } from '@/constants/delivery';
import { useRouteParam } from '@/hooks/use-route-param';
import { contactFormSchema, packageFormSchema } from '@/schemas/forms';
import type { ContactFormInput, PackageFormValues, ParcelSize } from '@/types';
import { toContactPayload, contactDefaults } from '@/utils/contact';
import { parseDate, toKobo } from '@/utils/format';
import { push } from '@/utils/nav';

const TITLES = ['Sender Details', 'Receiver Details', 'Package Details'] as const;
const QUESTIONS = ['Where are you sending from?', 'Who are you sending to?', 'What are you sending?'] as const;

export default function SendPackageScreen() {
  const { data: me } = useMe();
  const createDelivery = useCreateDelivery();
  const [step, setStep] = useState(1);
  const fromState = useRouteParam('fromState');
  const fromCity = useRouteParam('fromCity');
  const toState = useRouteParam('toState');
  const toCity = useRouteParam('toCity');
  const quantityParam = useRouteParam('quantity');
  const sizeParam = useRouteParam('size') as ParcelSize | '';
  const declaredValueParam = useRouteParam('declaredValue');

  const senderForm = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      ...contactDefaults(me),
      state: fromState,
      city: fromCity,
    },
  });
  const receiverForm = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      state: toState,
      city: toCity,
    },
  });
  useEffect(() => {
    if (!me) {
      return;
    }
    senderForm.reset({
      ...contactDefaults(me),
      state: fromState || senderForm.getValues('state'),
      city: fromCity || senderForm.getValues('city'),
    });
    // Prefill once the signed-in profile is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

  const packageForm = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      quantity: Number(quantityParam) || 1,
      size: sizeParam && sizeParam in PARCEL_SIZES ? sizeParam : 'SMALL',
      declaredValue: declaredValueParam,
      description: '',
      instructions: '',
      windowFrom: '',
      windowTo: '',
    },
  });

  const today = useMemo(() => new Date(), []);
  const windowFrom = useWatch({ control: packageForm.control, name: 'windowFrom' });

  const goBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  const submitPackage = packageForm.handleSubmit(async (pkg) => {
    const sender = contactFormSchema.parse(senderForm.getValues());
    const receiver = contactFormSchema.parse(receiverForm.getValues());
    try {
      const delivery = await createDelivery.mutateAsync({
        sender: toContactPayload(sender),
        receiver: toContactPayload(receiver),
        package: {
          quantity: pkg.quantity,
          size: pkg.size,
          weightRangeKg: PARCEL_SIZES[pkg.size].weightRangeKg,
          declaredValue: pkg.declaredValue ? toKobo(Number(pkg.declaredValue)) : undefined,
          description: pkg.description || undefined,
          instructions: pkg.instructions || undefined,
        },
        window: { from: pkg.windowFrom, to: pkg.windowTo },
      });
      push('/(home)/find-traveler', { id: delivery.id });
    } catch (error) {
      Alert.alert('Could not find a match', errorMessage(error));
    }
  });

  return (
    <FormScreen
      title={TITLES[step - 1]}
      onBack={goBack}
      footer={
        step < 3 ? (
          <AppButton
            title="Continue"
            handlePress={
              step === 1 ? senderForm.handleSubmit(() => setStep(2)) : receiverForm.handleSubmit(() => setStep(3))
            }
          />
        ) : (
          <AppButton
            title="Find A Match"
            handlePress={submitPackage}
            isLoading={createDelivery.isPending}
            disabled={createDelivery.isPending}
          />
        )
      }>
      <StepIndicator current={step} />
      <Typography size={18} weight="700">
        {QUESTIONS[step - 1]}
      </Typography>

      {step === 1 ? <ContactFields control={senderForm.control} /> : null}
      {step === 2 ? <ContactFields control={receiverForm.control} /> : null}
      {step === 3 ? (
        <>
          <QuantityStepper name="quantity" control={packageForm.control} />
          <ParcelSizePicker name="size" control={packageForm.control} />
          <Input
            name="declaredValue"
            control={packageForm.control}
            label="Value of Package (optional)"
            keyboardType="number-pad"
            placeholder="Amount in naira"
          />
          <Input name="description" control={packageForm.control} label="Package description" placeholder="What’s inside?" />
          <Input
            name="instructions"
            control={packageForm.control}
            label="Instructions (optional)"
            placeholder="Any drop-off notes"
          />
          <Typography size={14} weight="500">
            Delivery Timeline
          </Typography>
          <View style={styles.dates}>
            <View style={styles.date}>
              <DateField name="windowFrom" control={packageForm.control} label="From" minimumDate={today} />
            </View>
            <View style={styles.date}>
              <DateField
                name="windowTo"
                control={packageForm.control}
                label="To"
                minimumDate={windowFrom ? parseDate(windowFrom) : today}
              />
            </View>
          </View>
        </>
      ) : null}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  dates: {
    flexDirection: 'row',
    gap: 12,
  },
  date: {
    flex: 1,
  },
});
