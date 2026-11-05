import type { TripsApi } from '@/api/services/trips';
import type { Trip } from '@/types';

import { mockRequest, nextId, notFound } from './runtime';
import { ME_ID } from './seed';
import { db } from './store';

function findMyTrip(id: string) {
  const trip = db.trips.find((item) => item.id === id && item.travelerId === ME_ID);
  if (!trip) {
    throw notFound('Trip');
  }
  return trip;
}

export const tripsMock: TripsApi = {
  list: () =>
    mockRequest(() =>
      db.trips
        .filter((trip) => trip.travelerId === ME_ID && trip.status !== 'CANCELLED')
        .sort((a, b) => a.departureDate.localeCompare(b.departureDate))
    ),
  get: (id) => mockRequest(() => findMyTrip(id)),
  create: (payload) =>
    mockRequest(() => {
      const trip: Trip = { ...payload, id: nextId('t'), travelerId: ME_ID, status: 'ACTIVE' };
      db.trips.push(trip);
      return trip;
    }),
  update: (id, payload) => mockRequest(() => Object.assign(findMyTrip(id), payload)),
  remove: (id) =>
    mockRequest(() => {
      findMyTrip(id).status = 'CANCELLED';
    }),
};
