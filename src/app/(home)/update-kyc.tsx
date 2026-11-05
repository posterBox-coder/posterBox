import { useForm } from 'react-hook-form';

import FormScreen from '@/components/shared/FormScreen';
import ImageUploadField from '@/components/shared/kyc/ImageUploadField';
import AppButton from '@/components/ui/AppButton';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';
import { ID_TYPES, NIGERIAN_STATES } from '@/constants/kyc';
import { requiredField } from '@/helpers/auth';
import { useKyc, type KycIdDetails } from '@/providers/kyc-provider';
import { useSession } from '@/providers/session-provider';
import { push } from '@/utils/nav';

export default function UpdateKycScreen() {
  const { session } = useSession();
  const { idDetails, saveIdDetails } = useKyc();
  const form = useForm<KycIdDetails>({
    defaultValues: {
      ...idDetails,
      fullName: idDetails.fullName || session?.name || '',
    },
  });

  const onContinue = form.handleSubmit((values) => {
    if (!values.dateOfBirth) {
      form.setError('dateOfBirth', { message: 'Date of birth is required' });
      return;
    }
    saveIdDetails(values);
    push('/(home)/upload-selfie');
  });

  return (
    <FormScreen title="Update KYC" footer={<AppButton title="Continue" handlePress={onContinue} />}>
      <Input name="fullName" control={form.control} label="Full Name" autoCapitalize="words" rules={requiredField('Full name')} />
      <Input
        name="dateOfBirth"
        control={form.control}
        label="Date Of Birth"
        placeholder="DD/MM/YYYY"
        rules={requiredField('Date of birth')}
      />
      <SelectField
        name="stateOfResidence"
        control={form.control}
        label="State Of Residence"
        options={NIGERIAN_STATES}
        rules={requiredField('State of residence')}
      />
      <SelectField name="idType" control={form.control} label="ID Type" options={ID_TYPES} rules={requiredField('ID type')} />
      <Input name="idNumber" control={form.control} label="ID Number" rules={requiredField('ID number')} />
      <ImageUploadField name="idImageUri" control={form.control} label="Image Of ID" rules={requiredField('ID image')} />
    </FormScreen>
  );
}
