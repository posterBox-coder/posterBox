import type { PaymentsApi } from '@/api/services/payments';

import { holdPayment } from './deliveries';
import { mockRequest, nextId } from './runtime';
import { findRequest } from './store';

export const paymentsMock: PaymentsApi = {
  start: (requestId, method) =>
    mockRequest(() => {
      const record = findRequest(requestId);
      holdPayment(record, method);
      return { reference: nextId('pay'), status: record.paymentStatus };
    }),
};
