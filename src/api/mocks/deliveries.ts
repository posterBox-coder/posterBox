import { ApiError } from '@/api/client';
import type { DeliveriesApi } from '@/api/services/deliveries';
import { canSenderCancel, canTravelerRespond, isInTransit } from '@/constants/delivery';
import type { DeliveryRequest, TravelerMatch, Trip } from '@/types';
import { parseDate, toISODate } from '@/utils/format';

import { generateDeliveryCode, generateTrackingId, invalidState, mockRequest, nextId, nowIso } from './runtime';
import { coordinatesFor, ME_ID, STANDBY_TRAVELER_IDS, TRAVELER_OFFSETS } from './seed';
import {
  db,
  findRequest,
  findUser,
  markRequestNotificationsRead,
  priceFor,
  pushNotification,
  serializeRequest,
  toSummary,
  type RequestRecord,
} from './store';

const PAYOUT_RELEASE_MS = 10000;

const sortNewest = (a: RequestRecord, b: RequestRecord) => b.createdAt.localeCompare(a.createdAt);

function requireTraveler(record: RequestRecord) {
  if (record.travelerId !== ME_ID) {
    throw invalidState('Only the assigned traveler can do this.');
  }
}

function requireSender(record: RequestRecord) {
  if (record.senderId !== ME_ID) {
    throw invalidState('Only the sender can do this.');
  }
}

/** Routes that fit the request; if none exist, standby travelers are put on the route so the flow is always testable. */
function matchingTrips(record: RequestRecord): Trip[] {
  const neededKg = record.package.weightRangeKg[1] * record.package.quantity;
  const today = toISODate(new Date());
  const fits = (trip: Trip) =>
    trip.status === 'ACTIVE' &&
    trip.travelerId !== record.senderId &&
    !record.declinedBy.includes(trip.travelerId) &&
    trip.to.state === record.receiver.location.state &&
    trip.departureDate >= today &&
    trip.departureDate <= record.window.to &&
    trip.availableCapacityKg >= neededKg;

  const trips = db.trips.filter(fits);
  if (trips.length) {
    return trips;
  }

  const standby = STANDBY_TRAVELER_IDS.filter((id) => id !== record.senderId && !record.declinedBy.includes(id));
  const generated = standby.slice(0, 3).map((travelerId, index): Trip => {
    const departure = new Date(Math.max(Date.now(), parseDate(record.window.from).getTime()));
    departure.setDate(departure.getDate() + index);
    return {
      id: nextId('t'),
      travelerId,
      from: { state: record.sender.location.state, city: record.sender.location.city },
      to: { state: record.receiver.location.state, city: record.receiver.location.city },
      departureDate: toISODate(departure),
      availableCapacityKg: Math.max(20, neededKg),
      status: 'ACTIVE',
    };
  });
  db.trips.push(...generated);
  return generated;
}

function toMatch(record: RequestRecord, trip: Trip): TravelerMatch {
  const coords = coordinatesFor(trip.from.state);
  const [latOffset, lngOffset] = TRAVELER_OFFSETS[trip.travelerId] ?? [0, 0];
  return {
    traveler: toSummary(findUser(trip.travelerId)),
    trip,
    currentLocation: { ...trip.from, lat: coords.lat + latOffset, lng: coords.lng + lngOffset },
    estimatedFee: record.fee,
  };
}

function decline(record: RequestRecord) {
  record.declinedBy.push(ME_ID);
  record.travelerId = undefined;
  record.tripId = undefined;
  record.status = 'DECLINED';
  markRequestNotificationsRead(record.id);
}

/** Simulates the traveler's side after the sender pays. */
function scheduleTravelerResponse(record: RequestRecord) {
  if (!record.travelerId || record.travelerId === ME_ID) {
    return;
  }
  const traveler = findUser(record.travelerId);
  setTimeout(() => {
    if (record.status !== 'AWAITING_TRAVELER' || record.travelerId !== traveler.id) {
      return;
    }
    record.status = 'ACCEPTED';
    pushNotification('REQUEST_ACCEPTED', 'Your request was accepted', record, `By: ${traveler.fullName}`);
  }, 8000);
}

function schedulePayoutRelease(record: RequestRecord) {
  setTimeout(() => {
    if (record.status !== 'DELIVERED') {
      return;
    }
    record.status = 'COMPLETED';
    record.paymentStatus = 'RELEASED';
    pushNotification('PAYOUT', 'Payout released', record, `From: ${record.sender.fullName}`);
  }, PAYOUT_RELEASE_MS);
}

/** Exposed for the payments mock. */
export function holdPayment(record: RequestRecord, method: DeliveryRequest['paymentMethod']) {
  requireSender(record);
  if (record.status !== 'PENDING_PAYMENT') {
    throw invalidState('This delivery is not waiting for payment.');
  }
  record.paymentMethod = method;
  record.paymentStatus = 'HELD_IN_ESCROW';
  record.status = 'AWAITING_TRAVELER';
  scheduleTravelerResponse(record);
}

const respond = (id: string, handler: (record: RequestRecord) => void) =>
  mockRequest(() => {
    const record = findRequest(id);
    handler(record);
    return serializeRequest(record);
  });

export const deliveriesMock: DeliveriesApi = {
  list: ({ role, status }) =>
    mockRequest(() =>
      db.requests
        .filter((record) =>
          role === 'SENDER'
            ? record.senderId === ME_ID && record.status !== 'DRAFT'
            : record.travelerId === ME_ID && record.status !== 'PENDING_PAYMENT'
        )
        .filter((record) => !status || record.status === status)
        .sort(sortNewest)
        .map(serializeRequest)
    ),

  get: (id) => mockRequest(() => serializeRequest(findRequest(id))),

  create: (payload) =>
    mockRequest(() => {
      const record: RequestRecord = {
        ...payload,
        id: nextId('r'),
        trackingId: generateTrackingId(),
        deliveryCode: generateDeliveryCode(),
        senderId: ME_ID,
        fee: priceFor(payload.package.size, payload.package.quantity, payload.package.declaredValue),
        paymentStatus: 'UNPAID',
        status: 'DRAFT',
        createdAt: nowIso(),
        history: {},
        declinedBy: [],
      };
      db.requests.push(record);
      return serializeRequest(record);
    }),

  matches: (id) =>
    mockRequest(() => {
      const record = findRequest(id);
      return matchingTrips(record).map((trip) => toMatch(record, trip));
    }),

  selectTraveler: (id, { travelerId, tripId }) =>
    respond(id, (record) => {
      requireSender(record);
      if (!['DRAFT', 'PENDING_PAYMENT', 'DECLINED'].includes(record.status)) {
        throw invalidState('A traveler has already been assigned to this delivery.');
      }
      record.travelerId = travelerId;
      record.tripId = tripId;
      // A re-pick after a decline keeps the escrowed payment, so the sender never pays twice.
      if (record.paymentStatus === 'HELD_IN_ESCROW') {
        record.status = 'AWAITING_TRAVELER';
        scheduleTravelerResponse(record);
      } else {
        record.status = 'PENDING_PAYMENT';
      }
    }),

  cancel: (id) =>
    respond(id, (record) => {
      if (record.travelerId === ME_ID && record.status === 'ACCEPTED') {
        decline(record);
        return;
      }
      requireSender(record);
      if (!canSenderCancel(record.status)) {
        throw invalidState('This delivery can no longer be cancelled.');
      }
      record.status = 'CANCELLED';
      if (record.paymentStatus === 'HELD_IN_ESCROW') {
        record.paymentStatus = 'REFUNDED';
      }
    }),

  accept: (id) =>
    respond(id, (record) => {
      requireTraveler(record);
      if (!canTravelerRespond(record.status)) {
        throw invalidState('This request is no longer waiting for a response.');
      }
      record.status = 'ACCEPTED';
      markRequestNotificationsRead(record.id);
    }),

  decline: (id) =>
    respond(id, (record) => {
      requireTraveler(record);
      if (!canTravelerRespond(record.status)) {
        throw invalidState('This request is no longer waiting for a response.');
      }
      decline(record);
    }),

  pickup: (id) =>
    respond(id, (record) => {
      requireTraveler(record);
      if (record.status !== 'ACCEPTED') {
        throw invalidState('Accept the request before marking it as picked up.');
      }
      record.status = 'PICKED_UP';
      record.history.PICKED_UP = nowIso();
    }),

  confirmDelivery: (id, { code }) =>
    respond(id, (record) => {
      requireTraveler(record);
      if (!isInTransit(record.status)) {
        throw invalidState('Pick up the package before confirming delivery.');
      }
      if (record.deliveryCode !== code.trim().toUpperCase()) {
        throw new ApiError('INVALID_CODE', 'That code does not match this delivery.', {
          code: 'That code does not match this delivery. Ask the receiver to check it.',
        });
      }
      const now = nowIso();
      record.status = 'DELIVERED';
      record.history.IN_TRANSIT = record.history.PICKED_UP ?? now;
      record.history.DELIVERED = now;
      schedulePayoutRelease(record);
    }),
};