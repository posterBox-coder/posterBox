import type { z } from 'zod';

import type {
  contactFormSchema,
  deliveryCodeFormSchema,
  locationFormSchema,
  packageFormSchema,
  payoutFormSchema,
  quoteFormSchema,
  trackingFormSchema,
  tripFormSchema,
} from '@/schemas/forms';
import type {
  appNotificationSchema,
  bankSchema,
  contactSchema,
  deliveryRequestSchema,
  deliveryStatusSchema,
  locationSchema,
  notificationTypeSchema,
  packageDetailsSchema,
  parcelSizeSchema,
  paymentMethodSchema,
  paymentSessionSchema,
  paymentStatusSchema,
  payoutAccountSchema,
  quoteSchema,
  roleSchema,
  trackingEventSchema,
  trackingInfoSchema,
  travelerMatchSchema,
  tripSchema,
  userSchema,
  userSummarySchema,
} from '@/schemas/models';

export type Role = z.infer<typeof roleSchema>;
export type ParcelSize = z.infer<typeof parcelSizeSchema>;
export type DeliveryStatus = z.infer<typeof deliveryStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Bank = z.infer<typeof bankSchema>;
export type PayoutAccount = z.infer<typeof payoutAccountSchema>;
export type User = z.infer<typeof userSchema>;
export type UserSummary = z.infer<typeof userSummarySchema>;
export type PackageDetails = z.infer<typeof packageDetailsSchema>;
export type Trip = z.infer<typeof tripSchema>;
export type TravelerMatch = z.infer<typeof travelerMatchSchema>;
export type TrackingEvent = z.infer<typeof trackingEventSchema>;
export type DeliveryRequest = z.infer<typeof deliveryRequestSchema>;
export type TrackingInfo = z.infer<typeof trackingInfoSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type PaymentSession = z.infer<typeof paymentSessionSchema>;
export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type AppNotification = z.infer<typeof appNotificationSchema>;

export type LocationFormValues = z.infer<typeof locationFormSchema>;
export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.output<typeof contactFormSchema>;
export type PackageFormValues = z.infer<typeof packageFormSchema>;
export type QuoteFormInput = z.input<typeof quoteFormSchema>;
export type TripFormInput = z.input<typeof tripFormSchema>;
export type PayoutFormValues = z.infer<typeof payoutFormSchema>;
export type DeliveryCodeFormValues = z.infer<typeof deliveryCodeFormSchema>;
export type TrackingFormValues = z.infer<typeof trackingFormSchema>;

export type CreateDeliveryPayload = {
  sender: Contact;
  receiver: Contact;
  package: PackageDetails;
  window: DeliveryRequest['window'];
};

export type TripPayload = Pick<Trip, 'from' | 'to' | 'departureDate' | 'availableCapacityKg'>;

export type QuotePayload = Pick<Quote, 'from' | 'to' | 'quantity' | 'size'> & { declaredValue?: number };

export type DeliveryListParams = { role: Role; status?: DeliveryStatus };
