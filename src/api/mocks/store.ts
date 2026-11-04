import { PARCEL_SIZES } from '@/constants/delivery';
import type {
  AppNotification,
  Contact,
  DeliveryRequest,
  DeliveryStatus,
  NotificationType,
  ParcelSize,
  TrackingEvent,
  Trip,
  User,
  UserSummary,
} from '@/types';
import { formatLocation, toISODate } from '@/utils/format';

import { daysFromNow, nextId, notFound, nowIso } from './runtime';
import { CONTACTS, ME_ID, SEED_USERS } from './seed';

export type RequestRecord = Omit<DeliveryRequest, 'timeline' | 'traveler'> & {
  history: Partial<Record<DeliveryStatus, string>>;
  declinedBy: string[];
};

const SIZE_PRICE_KOBO: Record<ParcelSize, number> = {
  SMALL: 100000,
  MEDIUM: 250000,
  LARGE: 500000,
};

/** Base price per item plus 1% of the declared value as cover. */
export const priceFor = (size: ParcelSize, quantity: number, declaredValue = 0) =>
  SIZE_PRICE_KOBO[size] * quantity + Math.round(declaredValue * 0.01);

const isoDay = (offset: number) => toISODate(daysFromNow(offset));
const isoAt = (offset: number, hour: number) => daysFromNow(offset, hour).toISOString();

function packageOf(size: ParcelSize, quantity = 1, extra: Partial<RequestRecord['package']> = {}) {
  return { quantity, size, weightRangeKg: PARCEL_SIZES[size].weightRangeKg, ...extra };
}

function seedRequest(
  record: Pick<RequestRecord, 'id' | 'trackingId' | 'deliveryCode' | 'senderId' | 'sender' | 'receiver' | 'package' | 'status'> &
    Partial<RequestRecord>
): RequestRecord {
  return {
    window: { from: isoDay(-2), to: isoDay(5) },
    fee: priceFor(record.package.size, record.package.quantity, record.package.declaredValue),
    paymentMethod: 'CARD',
    paymentStatus: 'HELD_IN_ESCROW',
    createdAt: isoAt(-3, 10),
    history: {},
    declinedBy: [],
    ...record,
  };
}

const contact = (key: keyof typeof CONTACTS): Contact => ({ ...CONTACTS[key], location: { ...CONTACTS[key].location } });

export const db = {
  users: SEED_USERS.map((user) => ({ ...user })) as User[],

  trips: [
    { id: 't_me1', travelerId: ME_ID, from: { state: 'Lagos', city: 'Ikeja' }, to: { state: 'Akwa Ibom', city: 'Uyo' }, departureDate: isoDay(3), availableCapacityKg: 5, status: 'ACTIVE' },
    { id: 't_me2', travelerId: ME_ID, from: { state: 'Lagos', city: 'Ikeja' }, to: { state: 'Rivers', city: 'Port Harcourt' }, departureDate: isoDay(6), availableCapacityKg: 10, status: 'ACTIVE' },
    { id: 't_me3', travelerId: ME_ID, from: { state: 'FCT', city: 'Gwarimpa' }, to: { state: 'Akwa Ibom', city: 'Uyo' }, departureDate: isoDay(0), availableCapacityKg: 5, status: 'ACTIVE' },
    { id: 't_tosin', travelerId: 'u_tosin', from: { state: 'Lagos', city: 'Ikeja' }, to: { state: 'Akwa Ibom', city: 'Uyo' }, departureDate: isoDay(2), availableCapacityKg: 10, status: 'ACTIVE' },
    { id: 't_wahab', travelerId: 'u_wahab', from: { state: 'Lagos', city: 'Yaba' }, to: { state: 'Akwa Ibom', city: 'Eket' }, departureDate: isoDay(4), availableCapacityKg: 5, status: 'ACTIVE' },
    { id: 't_chioma', travelerId: 'u_chioma', from: { state: 'Lagos', city: 'Surulere' }, to: { state: 'Enugu', city: 'Enugu North' }, departureDate: isoDay(3), availableCapacityKg: 20, status: 'ACTIVE' },
    { id: 't_emeka', travelerId: 'u_emeka', from: { state: 'Lagos', city: 'Lekki' }, to: { state: 'Rivers', city: 'Port Harcourt' }, departureDate: isoDay(5), availableCapacityKg: 10, status: 'ACTIVE' },
  ] as Trip[],

  requests: [
    seedRequest({
      id: 'r_1',
      trackingId: 'AKS-1234567890',
      deliveryCode: 'PKG-7310-KD42',
      senderId: ME_ID,
      sender: contact('me'),
      receiver: contact('anabel'),
      package: packageOf('SMALL', 1, { description: 'Documents' }),
      travelerId: 'u_thomas',
      tripId: 't_thomas',
      status: 'PICKED_UP',
      history: { PICKED_UP: isoAt(-1, 13) },
    }),
    seedRequest({
      id: 'r_2',
      trackingId: 'AKS-2048193756',
      deliveryCode: 'PKG-2291-MX7Q',
      senderId: ME_ID,
      sender: contact('me'),
      receiver: contact('ngozi'),
      package: packageOf('MEDIUM', 1, { description: 'Shoes', instructions: 'Call before arrival' }),
      travelerId: 'u_chioma',
      tripId: 't_chioma',
      paymentMethod: 'BANK_TRANSFER',
      status: 'AWAITING_TRAVELER',
      createdAt: isoAt(0, 8),
    }),
    seedRequest({
      id: 'r_3',
      trackingId: 'AKS-5512098374',
      deliveryCode: 'PKG-6604-TR2B',
      senderId: ME_ID,
      sender: contact('me'),
      receiver: contact('anabel'),
      package: packageOf('SMALL', 2),
      travelerId: 'u_tosin',
      tripId: 't_tosin_old',
      paymentStatus: 'RELEASED',
      status: 'COMPLETED',
      window: { from: isoDay(-12), to: isoDay(-6) },
      createdAt: isoAt(-13, 9),
      history: { PICKED_UP: isoAt(-10, 11), IN_TRANSIT: isoAt(-10, 11), DELIVERED: isoAt(-8, 16) },
    }),
    seedRequest({
      id: 'r_4',
      trackingId: 'AKS-3390127745',
      deliveryCode: 'PKG-8817-QW3E',
      senderId: 'u_joshua',
      sender: contact('joshua'),
      receiver: contact('gabe'),
      package: packageOf('SMALL', 1, { declaredValue: 2500000, description: 'Phone accessories' }),
      travelerId: ME_ID,
      tripId: 't_me1',
      window: { from: isoDay(0), to: isoDay(10) },
      status: 'AWAITING_TRAVELER',
      createdAt: isoAt(0, 7),
    }),
    seedRequest({
      id: 'r_5',
      trackingId: 'AKS-7781203364',
      deliveryCode: 'PKG-1180-ZP5N',
      senderId: 'u_blessing',
      sender: contact('blessing'),
      receiver: contact('ibinabo'),
      package: packageOf('MEDIUM', 1, { instructions: 'Fragile, handle with care' }),
      travelerId: ME_ID,
      tripId: 't_me2',
      window: { from: isoDay(1), to: isoDay(10) },
      status: 'AWAITING_TRAVELER',
      createdAt: isoAt(0, 6),
    }),
    seedRequest({
      id: 'r_6',
      trackingId: 'AKS-6402918837',
      deliveryCode: 'PKG-4521-AB98',
      senderId: 'u_destiny',
      sender: contact('destiny'),
      receiver: contact('gabe'),
      package: packageOf('SMALL', 1),
      travelerId: ME_ID,
      tripId: 't_me3',
      status: 'PICKED_UP',
      history: { PICKED_UP: isoAt(0, 9) },
    }),
  ] as RequestRecord[],

  notifications: [
    {
      id: 'n_1',
      type: 'DELIVERY_REQUEST',
      title: 'Request for Delivery',
      body: 'To: Uyo, Akwa Ibom\nBy: Joshua Ekanem',
      requestId: 'r_4',
      read: false,
      createdAt: isoAt(0, 7),
    },
    {
      id: 'n_2',
      type: 'DELIVERY_REQUEST',
      title: 'Request for Delivery',
      body: 'To: Port Harcourt, Rivers\nBy: Blessing Okon',
      requestId: 'r_5',
      read: false,
      createdAt: isoAt(0, 6),
    },
    {
      id: 'n_3',
      type: 'DELIVERED',
      title: 'Package has been delivered',
      body: 'To: Uyo, Akwa Ibom\nReceived by: Anabel Etim',
      requestId: 'r_3',
      read: true,
      createdAt: isoAt(-8, 16),
    },
  ] as AppNotification[],
};

export const me = () => db.users.find((user) => user.id === ME_ID)!;

export function findUser(id: string) {
  const user = db.users.find((item) => item.id === id);
  if (!user) {
    throw notFound('User');
  }
  return user;
}

export const toSummary = ({ id, fullName, phone, avatarUrl, rating, isVerifiedTraveler }: User): UserSummary => ({
  id,
  fullName,
  phone,
  avatarUrl,
  rating,
  isVerifiedTraveler,
});

export function findRequest(id: string) {
  const record = db.requests.find((item) => item.id === id);
  if (!record || !involvesMe(record)) {
    throw notFound('Delivery');
  }
  return record;
}

export const involvesMe = (record: RequestRecord) =>
  record.senderId === ME_ID || record.travelerId === ME_ID || record.declinedBy.includes(ME_ID);

export function buildTimeline(record: RequestRecord): TrackingEvent[] {
  const pickedUp = record.history.PICKED_UP;
  return [
    {
      status: 'PICKED_UP',
      title: 'The package has been picked up',
      actorName: pickedUp && record.travelerId ? findUser(record.travelerId).fullName : undefined,
      location: record.sender.location.city,
      timestamp: pickedUp,
    },
    {
      status: 'IN_TRANSIT',
      title: `The package is on the way to ${record.receiver.location.city}`,
      location: 'In transit',
      timestamp: record.history.IN_TRANSIT,
    },
    {
      status: 'DELIVERED',
      title: 'The package has been delivered',
      location: record.receiver.location.state,
      timestamp: record.history.DELIVERED,
    },
  ];
}

/** Shapes a record the way the API would return it to the current user. */
export function serializeRequest(record: RequestRecord): DeliveryRequest {
  const { history: _history, declinedBy: _declinedBy, deliveryCode, ...rest } = record;
  return {
    ...rest,
    deliveryCode: record.senderId === ME_ID ? deliveryCode : undefined,
    traveler: record.travelerId ? toSummary(findUser(record.travelerId)) : undefined,
    timeline: buildTimeline(record),
  };
}

export function pushNotification(type: NotificationType, title: string, record: RequestRecord, byLine: string) {
  db.notifications.unshift({
    id: nextId('n'),
    type,
    title,
    body: `To: ${formatLocation(record.receiver.location)}\n${byLine}`,
    requestId: record.id,
    read: false,
    createdAt: nowIso(),
  });
}

export function markRequestNotificationsRead(requestId: string) {
  db.notifications.forEach((item) => {
    if (item.requestId === requestId) {
      item.read = true;
    }
  });
}
