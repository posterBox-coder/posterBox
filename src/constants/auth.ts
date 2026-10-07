export const OTP_LENGTH = 4;
export const DEMO_OTP = '1234';
export const OTP_RESEND_SECONDS = 30;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailRules = {
  required: 'Email is required',
  pattern: {
    value: EMAIL_PATTERN,
    message: 'Enter a valid email address',
  },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
};

export const requiredField = (label: string) => ({
  required: `${label} is required`,
});
