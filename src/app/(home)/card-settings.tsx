import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import type { z } from 'zod';

import FormScreen from '@/components/shared/FormScreen';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import { mockRequest } from '@/helpers/auth';
import { cardFormSchema } from '@/schemas/forms';

type CardFormValues = z.infer<typeof cardFormSchema>;

const digitsOnly = (value: string) => value.replace(/\D/g, '');

const formatCardNumber = (value: string) =>
  digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();

const formatExpiry = (value: string) => {
  const digits = digitsOnly(value).slice(0, 6);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function CardSettingsScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { holder: '', number: '', expiry: '', cvv: '' },
  });

  const onAdd = form.handleSubmit(async () => {
    try {
      setIsSubmitting(true);
      await mockRequest();
      router.back();
    } catch {
      Alert.alert('Could not add card', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormScreen
      title="Card"
      footer={<AppButton title="Add card" handlePress={onAdd} isLoading={isSubmitting} disabled={isSubmitting} />}>
      <Input name="holder" control={form.control} label="Card Holder Name" autoCapitalize="words" />
      <Input
        name="number"
        control={form.control}
        label="Card Number"
        keyboardType="number-pad"
        maxLength={19}
        transform={formatCardNumber}
      />
      <View style={styles.split}>
        <View style={styles.half}>
          <Input
            name="expiry"
            control={form.control}
            label="Expiry Date"
            placeholder="MM/YYYY"
            keyboardType="number-pad"
            maxLength={7}
            transform={formatExpiry}
          />
        </View>
        <View style={styles.half}>
          <Input name="cvv" control={form.control} label="CVC/CVV" keyboardType="number-pad" maxLength={4} />
        </View>
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  split: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
});
