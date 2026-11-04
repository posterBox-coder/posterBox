import { ApiError } from '@/api/client';
import { MOCK_FAIL_RATE } from '@/config/env';

export const mockSettings = {
  failRate: MOCK_FAIL_RATE,
  /** Dev toggle (Account screen) that makes every mocked request fail. */
  forceFail: false,
};

const randomDelay = () => 300 + Math.random() * 600;

/** Runs a mock handler with realistic latency and optional simulated failures. */
export async function mockRequest<T>(handler: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  if (mockSettings.forceFail || Math.random() < mockSettings.failRate) {
    throw new ApiError('MOCK_FAILURE', 'Simulated network error. Please try again.');
  }
  const result = handler();
  // Clone so screens never mutate the in-memory store by accident.
  return result === undefined ? result : (JSON.parse(JSON.stringify(result)) as T);
}

export const notFound = (what: string) => new ApiError('NOT_FOUND', `${what} not found.`);

export const invalidState = (message: string) => new ApiError('INVALID_STATE', message);

let counter = 1000;
export const nextId = (prefix: string) => `${prefix}_${(counter++).toString(36)}`;

const ALPHANUMERIC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomChars = (length: number, alphabet = ALPHANUMERIC) =>
  Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');

export const generateTrackingId = () => `AKS-${randomChars(10, '0123456789')}`;
export const generateDeliveryCode = () => `PKG-${randomChars(4, '0123456789')}-${randomChars(4)}`;

export const nowIso = () => new Date().toISOString();

export function daysFromNow(days: number, hour = 9) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 20, 0, 0);
  return date;
}
