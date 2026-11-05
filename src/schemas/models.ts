import { z } from 'zod';

export const roleSchema = z.enum(['SENDER', 'TRAVELER']);
export const parcelSizeSchema = z.enum(['SMALL', 'MEDIUM', 'LARGE']);
export const paymentMethodSchema = z.enum(['CARD', 'BANK_TRANSFER']);
export const paymentStatusSchema = z.enum(['UNPAID', 'HELD_IN_ESCROW', 'RELEASED', 'REFUNDED']);

export const deliveryStatusSchema = z.enum([
  'DRAFT',
  'PENDING_PAYMENT',
  'AWAITING_TRAVELER',
  'ACCEPTED',
  'DECLINED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
]);

export const locationSchema = z.object({
  state: z.string(),
  city: z.string(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const contactSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  location: locationSchema,
});

export const bankSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const payoutAccountSchema = z.object({
  bankCode: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  avatarUrl: z.string().optional(),
  rating: z.number().optional(),
  isVerifiedTraveler: z.boolean(),
  payoutAccount: payoutAccountSchema.optional(),
});

export const userSummarySchema = userSchema.pick({
  id: true,
  fullName: true,
  phone: true,
  avatarUrl: true,
  rating: true,
  isVerifiedTraveler: true,
});

export const packageDetailsSchema = z.object({
  quantity: z.number().int().min(1),
  size: parcelSizeSchema,
  weightRangeKg: z.tuple([z.number(), z.number()]),
  /** Kobo. */
  declaredValue: z.number().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
});

export const tripSchema = z.object({
  id: z.string(),
  travelerId: z.string(),
  from: locationSchema,
  to: locationSchema,
  departureDate: z.string(),
  availableCapacityKg: z.number(),
  status: z.enum(['ACTIVE', 'FULL', 'COMPLETED', 'CANCELLED']),
});

export const travelerMatchSchema = z.object({
  traveler: userSummarySchema,
  trip: tripSchema,
  currentLocation: locationSchema,
  /** Kobo. */
  estimatedFee: z.number(),
});

export const trackingEventSchema = z.object({
  status: deliveryStatusSchema,
  title: z.string(),
  location: z.string().optional(),
  actorName: z.string().optional(),
  /** Undefined means the step has not happened yet. */
  timestamp: z.string().optional(),
});

export const deliveryRequestSchema = z.object({
  id: z.string(),
  trackingId: z.string(),
  /** Only returned to the sender; the receiver hands it to the traveler at drop-off. */
  deliveryCode: z.string().optional(),
  senderId: z.string(),
  sender: contactSchema,
  receiver: contactSchema,
  package: packageDetailsSchema,
  window: z.object({ from: z.string(), to: z.string() }),
  travelerId: z.string().optional(),
  traveler: userSummarySchema.optional(),
  tripId: z.string().optional(),
  /** Kobo. */
  fee: z.number(),
  paymentMethod: paymentMethodSchema.optional(),
  paymentStatus: paymentStatusSchema,
  status: deliveryStatusSchema,
  timeline: z.array(trackingEventSchema),
  createdAt: z.string(),
});

export const trackingInfoSchema = deliveryRequestSchema
  .pick({ id: true, trackingId: true, status: true, timeline: true })
  .extend({ from: locationSchema, to: locationSchema });

export const quoteSchema = z.object({
  from: locationSchema,
  to: locationSchema,
  quantity: z.number(),
  size: parcelSizeSchema,
  /** Kobo. */
  cost: z.number(),
  currency: z.literal('NGN'),
});

export const paymentSessionSchema = z.object({
  reference: z.string(),
  status: paymentStatusSchema,
  checkoutUrl: z.string().optional(),
});

export const notificationTypeSchema = z.enum([
  'DELIVERY_REQUEST',
  'REQUEST_ACCEPTED',
  'REQUEST_DECLINED',
  'PICKED_UP',
  'DELIVERED',
  'PAYOUT',
]);

export const appNotificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string(),
  requestId: z.string().optional(),
  read: z.boolean(),
  createdAt: z.string(),
});
