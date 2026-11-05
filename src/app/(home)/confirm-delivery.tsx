import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { ApiError, errorMessage } from '@/api/client';
import { useConfirmDelivery } from '@/api/hooks/use-deliveries';
import FormScreen from '@/components/shared/FormScreen';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import { useRouteParam } from '@/hooks/use-route-param';
import { deliveryCodeFormSchema } from '@/schemas/forms';
import type { DeliveryCodeFormValues } from '@/types';
import { replace } from '@/utils/nav';

export default function ConfirmDeliveryScreen() {
  const id = useRouteParam('id');
  const confirm = useConfirmDelivery(id);
  const form = useForm<DeliveryCodeFormValues>({
    resolver: zodResolver(deliveryCodeFormSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = form.handleSubmit(async ({ code }) => {
    try {
      await confirm.mutateAsync(code);
      replace('/(home)/delivered', { id });
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors?.code) {
        form.setError('code', { message: error.fieldErrors.code });
        return;
      }
      Alert.alert('Could not confirm delivery', errorMessage(error));
    }
  });

  return (
    <FormScreen
      title="Package code"
      footer={
        <AppButton
          title="Confirm package"
          handlePress={onSubmit}
          isLoading={confirm.isPending}
          disabled={confirm.isPending}
        />
      }>
      <Input
        name="code"
        control={form.control}
        label="Enter Package Code"
        placeholder="PKG-0000-AAAA"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <Typography size={14} textType="text2">
        Input the package code of your delivery. Ask the receiver to read it out.
      </Typography>
    </FormScreen>
  );
}
