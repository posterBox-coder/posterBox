import { type Control, useController, useWatch } from 'react-hook-form';

import { useLgas, useStates } from '@/api/hooks/use-locations';
import Input from '@/components/ui/Input';
import SelectField from '@/components/ui/SelectField';
import type { ContactFormInput } from '@/types';

type ContactFieldsProps = {
  control: Control<ContactFormInput>;
};

export default function ContactFields({ control }: ContactFieldsProps) {
  const state = useWatch({ control, name: 'state' });
  const city = useController({ control, name: 'city' });
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: lgas = [], isLoading: isLoadingLgas } = useLgas(state);

  return (
    <>
      <Input name="fullName" control={control} label="Full Name" autoCapitalize="words" />
      <Input name="phone" control={control} label="Mobile Number" keyboardType="phone-pad" />
      <Input name="address" control={control} label="House Address" />
      <SelectField
        name="state"
        control={control}
        label="State"
        placeholder="Select state"
        options={states}
        isLoading={isLoadingStates}
        onSelect={() => {
          city.field.onChange('');
        }}
      />
      <SelectField
        name="city"
        control={control}
        label="City/LGA"
        placeholder="Select"
        options={lgas}
        disabled={!state}
        isLoading={isLoadingLgas}
      />
    </>
  );
}
