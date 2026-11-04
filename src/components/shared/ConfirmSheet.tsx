import { StyleSheet, View } from 'react-native';

import AppButton from '@/components/ui/AppButton';
import BottomSheetModal from '@/components/ui/BottomSheetModal';
import Typography from '@/components/ui/Typography';

type ConfirmSheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function ConfirmSheet({
  visible,
  onClose,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  isLoading,
}: ConfirmSheetProps) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} title={title}>
      <Typography size={14} textType="text2" lineHeight={20} style={styles.message}>
        {message}
      </Typography>
      <View style={styles.row}>
        <AppButton title={cancelLabel} variant="secondary" handlePress={onClose} disabled={isLoading} style={styles.half} />
        <AppButton title={confirmLabel} handlePress={onConfirm} isLoading={isLoading} disabled={isLoading} style={styles.half} />
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  message: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
    width: undefined,
  },
});
