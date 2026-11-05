import { z } from 'zod';

import { parcelSizeSchema } from './models';

const NG_PHONE = /^(?:\+?234|0)[789][01]\d{8}$/;
const DIGITS = /^\d*$/;

const requiredText = (message: string) => z.string().trim().min(1, message);

export const locationFormSchema = z.object({
  city: requiredText('Enter a city'),
  state: requiredText('Select a state'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const requiredLocation = (message: string) => locationFormSchema.optional().refine((value) => !!value, message);

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter a full name'),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(NG_PHONE, 'Enter a valid Nigerian mobile number')),
  address: z.string().trim().min(3, 'Enter a house address'),
  state: requiredText('Select a state'),
  city: requiredText('Select a city or LGA'),
});

const amountField = z.string().trim().regex(DIGITS, 'Enter a number').optional();

export const packageFormSchema = z
  .object({
    quantity: z.number().int().min(1, 'At least 1 item').max(20, 'At most 20 items'),
    size: parcelSizeSchema,
    declaredValue: amountField,
    description: z.string().trim().max(120, 'Keep it under 120 characters').optional(),
    instructions: z.string().trim().max(200, 'Keep it under 200 characters').optional(),
    windowFrom: requiredText('Pick a start date'),
    windowTo: requiredText('Pick an end date'),
  })
  .refine((value) => value.windowTo >= value.windowFrom, {
    path: ['windowTo'],
    message: 'End date must be after the start date',
  });

export const quoteFormSchema = z.object({
  from: requiredLocation('Select where the package is from'),
  to: requiredLocation('Select where the package is going'),
  quantity: z.number().int().min(1, 'At least 1 item').max(20, 'At most 20 items'),
  size: parcelSizeSchema,
  declaredValue: amountField,
});

export const tripFormSchema = z
  .object({
    from: requiredLocation('Select where you are traveling from'),
    to: requiredLocation('Select where you are traveling to'),
    departureDate: requiredText('Pick a departure date'),
    availableCapacityKg: z.number({ error: 'Choose how much space you have' }),
  })
  .refine((value) => !value.from || !value.to || value.from.city !== value.to.city || value.from.state !== value.to.state, {
    path: ['to'],
    message: 'Destination must be different from your starting point',
  });

export const payoutFormSchema = z.object({
  bankCode: requiredText('Select your bank'),
  accountNumber: z.string().trim().regex(/^\d{10}$/, 'Account number must be 10 digits'),
});

export const profileFormSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    phone: z.string().trim().regex(NG_PHONE, 'Enter a valid phone number'),
    oldPassword: z.string(),
    newPassword: z.string(),
  })
  .refine((value) => !value.newPassword || value.oldPassword.length > 0, {
    path: ['oldPassword'],
    message: 'Enter your current password',
  })
  .refine((value) => (!value.oldPassword && !value.newPassword) || value.newPassword.length >= 8, {
    path: ['newPassword'],
    message: 'Password must be at least 8 characters',
  });

export const cardFormSchema = z.object({
  holder: z.string().trim().min(2, 'Enter the name on the card'),
  number: z.string().trim().refine((value) => value.replace(/\D/g, '').length === 16, 'Enter a 16-digit card number'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Use MM/YYYY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter the CVC'),
});

export const deliveryCodeFormSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^PKG-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Enter the code in the format PKG-0000-AAAA'),
});

export const trackingFormSchema = z.object({
  trackingId: requiredText('Enter a tracking number to continue.'),
});
