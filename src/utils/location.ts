import { NIGERIAN_STATES } from '@/constants/kyc';
import type { LocationFormValues } from '@/types';

type Place = {
  city?: string | null;
  district?: string | null;
  subregion?: string | null;
  region?: string | null;
  name?: string | null;
};

const FCT_ALIASES = /abuja|federal capital/i;

function stripStateSuffix(value: string) {
  return value.replace(/\s+state$/i, '').trim();
}

export function matchNigerianState(place: Place) {
  const candidates = [place.region, place.subregion, place.city, place.district, place.name].filter(
    (value): value is string => !!value
  );

  if (candidates.some((value) => FCT_ALIASES.test(value))) {
    return 'FCT';
  }

  for (const candidate of candidates) {
    const normalized = stripStateSuffix(candidate).toLowerCase();
    const match = NIGERIAN_STATES.find((state) => state.toLowerCase() === normalized);
    if (match) {
      return match;
    }
  }

  return undefined;
}

export function matchCity(lgas: string[], place: Place) {
  const candidates = [place.city, place.district, place.subregion, place.name].filter(
    (value): value is string => !!value
  );

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    const match = lgas.find((lga) => lga.toLowerCase() === normalized || normalized.includes(lga.toLowerCase()));
    if (match) {
      return match;
    }
  }

  return candidates[0];
}

export function emptyLocation(): LocationFormValues {
  return { city: '', state: '' };
}
