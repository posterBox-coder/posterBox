import { apiClient, unwrap } from '@/api/client';
import { usersMock } from '@/api/mocks/users';
import { USE_MOCKS } from '@/config/env';
import type { PayoutAccount, PayoutFormValues, User } from '@/types';

export type UsersApi = {
  getMe: () => Promise<User>;
  savePayoutAccount: (body: PayoutFormValues) => Promise<PayoutAccount>;
};

const http: UsersApi = {
  getMe: () => unwrap(apiClient.get<User>('/me')),
  savePayoutAccount: (body) => unwrap(apiClient.put<PayoutAccount>('/me/payout-account', body)),
};

export const usersService: UsersApi = USE_MOCKS ? usersMock : http;
