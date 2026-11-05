import { apiClient, unwrap } from '@/api/client';
import { locationsMock } from '@/api/mocks/locations';
import { USE_MOCKS } from '@/config/env';

export type LocationsApi = {
  states: () => Promise<string[]>;
  lgas: (state: string) => Promise<string[]>;
};

const http: LocationsApi = {
  states: () => unwrap(apiClient.get<string[]>('/locations/states')),
  lgas: (state) => unwrap(apiClient.get<string[]>(`/locations/states/${encodeURIComponent(state)}/lgas`)),
};

export const locationsService: LocationsApi = USE_MOCKS ? locationsMock : http;
