import { ApiError } from '@/api/client';
import type { BanksApi } from '@/api/services/banks';

import { mockRequest, notFound } from './runtime';
import { BANKS } from './seed';
import { me } from './store';

export function resolveAccountName(bankCode: string, accountNumber: string) {
  if (!BANKS.some((bank) => bank.code === bankCode)) {
    throw notFound('Bank');
  }
  if (!/^\d{10}$/.test(accountNumber) || accountNumber.startsWith('0000')) {
    throw new ApiError('ACCOUNT_NOT_FOUND', 'We could not find this account. Check the number and bank.', {
      accountNumber: 'Account not found',
    });
  }
  return me().fullName.toUpperCase();
}

export const banksMock: BanksApi = {
  list: () => mockRequest(() => BANKS),
  resolve: ({ bankCode, accountNumber }) =>
    mockRequest(() => ({ accountName: resolveAccountName(bankCode, accountNumber) })),
};
