import type { QuotesApi } from '@/api/services/quotes';

import { mockRequest } from './runtime';
import { priceFor } from './store';

export const quotesMock: QuotesApi = {
  create: ({ from, to, quantity, size, declaredValue }) =>
    mockRequest(() => ({
      from,
      to,
      quantity,
      size,
      cost: priceFor(size, quantity, declaredValue),
      currency: 'NGN' as const,
    })),
};
