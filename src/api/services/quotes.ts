import { apiClient, unwrap } from '@/api/client';
import { quotesMock } from '@/api/mocks/quotes';
import { USE_MOCKS } from '@/config/env';
import type { Quote, QuotePayload } from '@/types';

export type QuotesApi = {
  create: (payload: QuotePayload) => Promise<Quote>;
};

const http: QuotesApi = {
  create: (payload) => unwrap(apiClient.post<Quote>('/quotes', payload)),
};

export const quotesService: QuotesApi = USE_MOCKS ? quotesMock : http;
