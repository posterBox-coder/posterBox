import type { IconName } from 'react-native-remix-icon';

import type { DeliveryStatus, NotificationType, ParcelSize, PaymentMethod, PaymentStatus } from '@/types';

import type { StatusTone } from './theme';

export const PARCEL_SIZES: Record<ParcelSize, { label: string; weightRangeKg: [number, number]; iconSize: number }> = {
  SMALL: { label: 'Small', weightRangeKg: [0.1, 1], iconSize: 22 },
  MEDIUM: { label: 'Medium', weightRangeKg: [1, 4], iconSize: 30 },
  LARGE: { label: 'Large', weightRangeKg: [4, 10], iconSize: 38 },
};

export const PARCEL_SIZE_KEYS = Object.keys(PARCEL_SIZES) as ParcelSize[];

export const CAPACITY_OPTIONS = [
  { value: 2, label: '0.1 – 2.0kg' },
  { value: 5, label: '2.0 – 5.0kg' },
  { value: 10, label: '5.0 – 10kg' },
  { value: 20, label: '10 – 20kg' },
] as const;

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CARD', label: 'Card' },
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
];

export const STATUS_META: Record<DeliveryStatus, { label: string; tone: StatusTone }> = {
  DRAFT: { label: 'Draft', tone: 'grey' },
  PENDING_PAYMENT: { label: 'Pending payment', tone: 'amber' },
  AWAITING_TRAVELER: { label: 'Awaiting traveler', tone: 'amber' },
  ACCEPTED: { label: 'Accepted', tone: 'blue' },
  DECLINED: { label: 'Declined', tone: 'red' },
  PICKED_UP: { label: 'Picked up', tone: 'blue' },
  IN_TRANSIT: { label: 'In transit', tone: 'blue' },
  DELIVERED: { label: 'Delivered', tone: 'green' },
  COMPLETED: { label: 'Completed', tone: 'green' },
  CANCELLED: { label: 'Cancelled', tone: 'red' },
  REFUNDED: { label: 'Refunded', tone: 'grey' },
};

/** How the money looks from the traveler's side. */
export const PAYOUT_STATUS_LABEL: Record<PaymentStatus, string> = {
  UNPAID: 'Awaiting payment',
  HELD_IN_ESCROW: 'Payout pending',
  RELEASED: 'Paid',
  REFUNDED: 'Refunded to sender',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  UNPAID: 'Not paid',
  HELD_IN_ESCROW: 'Held in escrow',
  RELEASED: 'Released to traveler',
  REFUNDED: 'Refunded',
};

export const NOTIFICATION_ICON: Record<NotificationType, IconName> = {
  DELIVERY_REQUEST: 'user-location-line',
  REQUEST_ACCEPTED: 'checkbox-circle-line',
  REQUEST_DECLINED: 'close-circle-line',
  PICKED_UP: 'truck-line',
  DELIVERED: 'box-3-line',
  PAYOUT: 'wallet-3-line',
};

const SENDER_CANCELLABLE: DeliveryStatus[] = ['PENDING_PAYMENT', 'AWAITING_TRAVELER', 'ACCEPTED'];
const ACTIVE_TRAVELER: DeliveryStatus[] = ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'];
const TRACKABLE: DeliveryStatus[] = ['AWAITING_TRAVELER', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'];

export const canSenderCancel = (status: DeliveryStatus) => SENDER_CANCELLABLE.includes(status);
export const canTravelerRespond = (status: DeliveryStatus) => status === 'AWAITING_TRAVELER';
export const isActiveForTraveler = (status: DeliveryStatus) => ACTIVE_TRAVELER.includes(status);
export const isTrackable = (status: DeliveryStatus) => TRACKABLE.includes(status);
export const isInTransit = (status: DeliveryStatus) => status === 'PICKED_UP' || status === 'IN_TRANSIT';
