import { useState } from 'react';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import Icon, { type IconName } from 'react-native-remix-icon';

import LocationSheet from '@/components/shared/forms/LocationSheet';
import FieldShell from '@/components/ui/FieldShell';
import Typography from '@/components/ui/Typography';
import type { LocationFormValues } from '@/types';
import { formatLocation } from '@/utils/format';
import { useTheme } from '@/hooks/use-theme';

type LocationFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  sheetTitle: string;
  icon?: IconName;
};

export default function LocationField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  sheetTitle,
  icon = 'map-pin-line',
}: LocationFieldProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });
  const location = value as LocationFormValues | undefined;
  const filled = !!location?.city && !!location?.state;

  return (
    <>
      <FieldShell
        label={label}
        error={error?.message}
        onPress={() => setOpen(true)}
        accessibilityLabel={label}>
        <Typography size={16} weight={filled ? '600' : '400'} color={filled ? theme.text : theme.text2} style={{ flex: 1 }} numberOfLines={1}>
          {filled ? formatLocation(location) : placeholder}
        </Typography>
        <Icon name={icon} size={20} color={theme.primary} />
      </FieldShell>
      <LocationSheet
        visible={open}
        title={sheetTitle}
        value={location}
        onClose={() => setOpen(false)}
        onSave={(next) => {
          onChange(next);
          setOpen(false);
        }}
      />
    </>
  );
}
