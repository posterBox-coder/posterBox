export const OTP_LENGTH = 6;
export const DEMO_OTP = '123456';
export const RESEND_SECONDS = 120;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailRules = {
  required: 'Email is required',
  pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
};

export const requiredField = (label: string) => ({
  required: `${label} is required`,
});

export function wait(ms = 800) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function mockRequest() {
  await wait();
}

export async function mockVerifyOtp(code: string) {
  await wait();
  if (code !== DEMO_OTP) {
    throw new Error('Invalid verification code');
  }
}

export type OtpPurpose = 'register' | 'reset';

export function isOtpPurpose(value: unknown): value is OtpPurpose {
  return value === 'register' || value === 'reset';
}

export const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};