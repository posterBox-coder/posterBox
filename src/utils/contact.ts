import type { Contact, ContactFormInput, ContactFormValues, User } from '@/types';

import { toE164 } from './format';

export function toContactPayload(values: ContactFormValues): Contact {
  return {
    fullName: values.fullName,
    phone: toE164(values.phone),
    location: {
      state: values.state,
      city: values.city,
      address: values.address,
    },
  };
}

export function contactDefaults(user?: User): ContactFormInput {
  return {
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
    address: '',
    state: '',
    city: '',
  };
}
