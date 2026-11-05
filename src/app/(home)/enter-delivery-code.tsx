import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useDeliveries } from '@/api/hooks/use-deliveries';
import FormScreen from '@/components/shared/FormScreen';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { deliveryCodeFormSchema } from '@/schemas/forms';
import type { DeliveryCodeFormValues } from '@/types';
import { push } from '@/utils/nav';

export default function EnterDeliveryCodeScreen() {
  const deliveries = useDeliveries({ role: 'SENDER' });
  const form = useForm<DeliveryCodeFormValues>({
    resolver: zodResolver(deliveryCodeFormSchema),
    defaultValues: { code: '' },
  });

  const onContinue = form.handleSubmit((values) => {
    const match = (deliveries.data ?? []).find((item) => item.deliveryCode?.toUpperCase() === values.code);
    if (!match) {
      form.setError('code', { message: 'No delivery matches this code.' });
      return;
    }
    push('/(home)/delivery/[id]', { id: match.id });
  });

  return (
    <FormScreen title="Enter Delivery Code" footer={<AppButton title="Continue" handlePress={onContinue} />}>
      <Input
        name="code"
        control={form.control}
        label="Delivery Code"
        placeholder="PKG-0000-AAAA"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <Typography size={14} textType="text2">
        Enter the delivery code shared with the receiver.
      </Typography>
    </FormScreen>
  );
}
