import { ApiError } from '@/api/client';
import type { TrackingApi } from '@/api/services/tracking';

import { mockRequest } from './runtime';
import { buildTimeline, db } from './store';

const HIDDEN_STATUSES = ['DRAFT', 'PENDING_PAYMENT'];

export const trackingMock: TrackingApi = {
  get: (trackingId) =>
    mockRequest(() => {
      const key = trackingId.trim().toUpperCase();
      const record = db.requests.find((item) => item.trackingId === key && !HIDDEN_STATUSES.includes(item.status));
      if (!record) {
        throw new ApiError('NOT_FOUND', 'No delivery found for this tracking number.');
      }
      const { city, state } = record.sender.location;
      return {
        id: record.id,
        trackingId: record.trackingId,
        status: record.status,
        from: { city, state },
        to: { city: record.receiver.location.city, state: record.receiver.location.state },
        timeline: buildTimeline(record),
      };
    }),
};
