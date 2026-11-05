import { apiClient, unwrap } from '@/api/client';
import { banksMock } from '@/api/mocks/banks';
import { USE_MOCKS } from '@/config/env';
import type { Bank, PayoutFormValues } from '@/types';

export type BanksApi = {
  list: () => Promise<Bank[]>;
  resolve: (body: PayoutFormValues) => Promise<{ accountName: string }>;
};

const http: BanksApi = {
  list: () => unwrap(apiClient.get<Bank[]>('/banks')),
  resolve: (body) => unwrap(apiClient.post<{ accountName: string }>('/banks/resolve', body)),
};

export const banksService: BanksApi = USE_MOCKS ? banksMock : http;
