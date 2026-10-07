import { type Ref } from 'react';
import { StyleSheet } from 'react-native';
import { OtpInput as OtpEntry, type OtpInputRef } from 'react-native-otp-entry';

import { Fonts, Palette } from '@/constants/theme';
import { OTP_LENGTH } from '@/helpers/auth';
import { useTheme } from '@/hooks/use-theme';

type OtpInputProps = {
  onTextChange: (code: string) => void;
  hasError?: boolean;
  inputRef?: Ref<OtpInputRef>;
};

export default function OtpInput({ onTextChange, hasError, inputRef }: OtpInputProps) {
  const theme = useTheme();

  return (
    <OtpEntry
      ref={inputRef}
      numberOfDigits={OTP_LENGTH}
      type="numeric"
      autoFocus
      blurOnFilled
      focusColor={hasError ? Palette.error : theme.primary}
      onTextChange={onTextChange}
      theme={{
        containerStyle: styles.container,
        pinCodeContainerStyle: {
          ...styles.cell,
          borderColor: hasError ? Palette.error : theme.borderColor,
          backgroundColor: theme.background,
        },
        focusedPinCodeContainerStyle: {
          borderColor: hasError ? Palette.error : theme.primary,
        },
        filledPinCodeContainerStyle: {
          borderColor: hasError ? Palette.error : theme.primary,
        },
        pinCodeTextStyle: {
          ...styles.digit,
          color: theme.text,
        },
      }}
      textInputProps={{
        textContentType: 'oneTimeCode',
        autoComplete: 'sms-otp',
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    justifyContent: 'center',
  },
  cell: {
    borderRadius: 6,
    borderWidth: 0.5,
    height: 46,
    width: 46,
  },
  digit: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
  },
});
