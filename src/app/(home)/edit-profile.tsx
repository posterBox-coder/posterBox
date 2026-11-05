import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import type { z } from 'zod';

import { useMe } from '@/api/hooks/use-account';
import FormScreen from '@/components/shared/FormScreen';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import { mockRequest } from '@/helpers/auth';
import { useSession } from '@/providers/session-provider';
import { profileFormSchema } from '@/schemas/forms';

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfileScreen() {
  const { session, updateProfile } = useSession();
  const { data: me } = useMe();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: session?.name ?? '',
      phone: session?.phone ?? '',
      oldPassword: '',
      newPassword: '',
    },
  });

  useEffect(() => {
    if (form.getValues('phone') || !me?.phone) {
      return;
    }
    form.setValue('phone', me.phone);
  }, [form, me?.phone]);

  const onConfirm = form.handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);
      await mockRequest();
      await updateProfile({ name: values.fullName, phone: values.phone });
      router.back();
    } catch {
      Alert.alert('Could not save profile', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormScreen
      title="Edit Profile"
      footer={<AppButton title="Confirm" handlePress={onConfirm} isLoading={isSubmitting} disabled={isSubmitting} />}>
      <Input name="fullName" control={form.control} label="Full Name" autoCapitalize="words" />
      <Input name="phone" control={form.control} label="Telephone Number" keyboardType="phone-pad" />
      <Input name="oldPassword" control={form.control} label="Old Password" isPassword />
      <Input name="newPassword" control={form.control} label="New Password" isPassword />
    </FormScreen>
  );
}
