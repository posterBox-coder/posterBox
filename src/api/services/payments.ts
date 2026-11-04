import { apiClient, unwrap } from '@/api/client';
import { paymentsMock } from '@/api/mocks/payments';
import { USE_MOCKS } from '@/config/env';
import type { PaymentMethod, PaymentSession } from '@/types';

/** Payment provider integration (Monniefy) will plug in behind this interface. */
export type PaymentsApi = {
  start: (requestId: string, method: PaymentMethod) => Promise<PaymentSession>;
};

const http: PaymentsApi = {
  start: (requestId, method) =>
    unwrap(apiClient.post<PaymentSession>(`/delivery-requests/${requestId}/payments`, { method })),
};

export const paymentsService: PaymentsApi = USE_MOCKS ? paymentsMock : http;
