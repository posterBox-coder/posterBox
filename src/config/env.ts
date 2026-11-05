export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.posterbox.com.ng/v1';

export const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false';

/** Probability (0–1) that a mocked request fails, to exercise error states. */
export const MOCK_FAIL_RATE = Number(process.env.EXPO_PUBLIC_MOCK_FAIL_RATE ?? 0);
