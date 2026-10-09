import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import AuthScreen from '@/components/shared/auth/AuthScreen';
import ImageUploadField from '@/components/shared/kyc/ImageUploadField';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';
import TopHeader from '@/components/ui/TopHeader';
import { ID_TYPES, NIGERIAN_STATES } from '@/constants/kyc';
import { mockRequest, requiredField } from '@/helpers/auth';
import { useKyc, type KycIdDetails } from '@/providers/kyc-provider';

export default function UploadValidId() {
  const { idDetails, saveIdDetails } = useKyc();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<KycIdDetails>({
    defaultValues: idDetails,
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await mockRequest();
      saveIdDetails(values);
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <AuthScreen
      footer={
        <AppButton
          title="Continue"
          handlePress={onSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      }>
      <TopHeader title="Upload Valid ID" />
      <View style={styles.fields}>
        <Input name="fullName" control={control} label="Full Name on ID" rules={requiredField('Full name')} />
        <Input
          name="dateOfBirth"
          control={control}
          label="Date Of Birth"
          placeholder="DD/MM/YYYY"
          rules={requiredField('Date of birth')}
        />
        <SelectField
          name="stateOfResidence"
          control={control}
          label="State Of Residence"
          options={NIGERIAN_STATES}
          rules={requiredField('State of residence')}
        />
        <SelectField
          name="idType"
          control={control}
          label="ID Type"
          options={ID_TYPES}
          rules={requiredField('ID type')}
        />
        <Input name="idNumber" control={control} label="ID Number" rules={requiredField('ID number')} />
        <ImageUploadField
          name="idImageUri"
          control={control}
          label="Image Of ID"
          rules={requiredField('ID image')}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
    marginTop: 24,
  },
});
