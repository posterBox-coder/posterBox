import type { LocationsApi } from '@/api/services/locations';

import { mockRequest, notFound } from './runtime';
import { STATE_DATA } from './seed';

export const locationsMock: LocationsApi = {
  states: () => mockRequest(() => Object.keys(STATE_DATA)),
  lgas: (state) =>
    mockRequest(() => {
      const data = STATE_DATA[state as keyof typeof STATE_DATA];
      if (!data) {
        throw notFound('State');
      }
      return data.lgas;
    }),
};
