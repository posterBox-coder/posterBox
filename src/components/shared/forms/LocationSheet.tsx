import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from 'react-native-remix-icon';

import { useLgas, useStates } from '@/api/hooks/use-locations';
import AppButton from '@/components/ui/AppButton';
import BottomSheetModal from '@/components/ui/BottomSheetModal';
import SelectField from '@/components/ui/SelectField';
import { locationFormSchema } from '@/schemas/forms';
import type { LocationFormValues } from '@/types';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useTheme } from '@/hooks/use-theme';

type LocationSheetProps = {
  visible: boolean;
  title: string;
  value?: LocationFormValues;
  onClose: () => void;
  onSave: (value: LocationFormValues) => void;
};

export default function LocationSheet({ visible, title, value, onClose, onSave }: LocationSheetProps) {
  const theme = useTheme();
  const { locate, isLocating } = useCurrentLocation();
  const { control, handleSubmit, setValue, reset } = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: value ?? { city: '', state: '' },
  });
  const state = useWatch({ control, name: 'state' });
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: lgas = [], isLoading: isLoadingLgas } = useLgas(state);

  useEffect(() => {
    if (visible) {
      reset(value ?? { city: '', state: '' });
    }
  }, [reset, value, visible]);

  const fillFromGps = async () => {
    const next = await locate();
    if (!next) {
      return;
    }
    setValue('state', next.state, { shouldValidate: true });
    setValue('city', next.city, { shouldValidate: true });
    if (next.lat) {
      setValue('lat', next.lat);
    }
    if (next.lng) {
      setValue('lng', next.lng);
    }
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} title={title}>
      <View style={styles.fields}>
        <SelectField
          name="city"
          control={control}
          label="City"
          placeholder="City"
          options={lgas}
          isLoading={isLoadingLgas}
          accessory={
            <Pressable
              onPress={fillFromGps}
              disabled={isLocating}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Use my current location">
              {isLocating ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Icon name="focus-3-line" size={22} color={theme.primary} />
              )}
            </Pressable>
          }
        />
        <SelectField
          name="state"
          control={control}
          label="State"
          placeholder="State"
          options={states}
          isLoading={isLoadingStates}
          onSelect={() => setValue('city', '')}
        />
      </View>
      <AppButton title="Save" handlePress={handleSubmit(onSave)} />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
    marginBottom: 24,
  },
});
