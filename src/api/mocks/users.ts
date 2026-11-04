import type { UsersApi } from '@/api/services/users';

import { resolveAccountName } from './banks';
import { mockRequest } from './runtime';
import { BANKS } from './seed';
import { me } from './store';

export const usersMock: UsersApi = {
  getMe: () => mockRequest(me),
  savePayoutAccount: ({ bankCode, accountNumber }) =>
    mockRequest(() => {
      const account = {
        bankCode,
        bankName: BANKS.find((bank) => bank.code === bankCode)?.name ?? '',
        accountNumber,
        accountName: resolveAccountName(bankCode, accountNumber),
      };
      me().payoutAccount = account;
      return account;
    }),
};
