import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert } from 'react-native';

import { locationsService } from '@/api/services/locations';
import type { LocationFormValues } from '@/types';
import { matchCity, matchNigerianState } from '@/utils/location';

export function useCurrentLocation() {
  const [isLocating, setIsLocating] = useState(false);

  const locate = async (): Promise<LocationFormValues | null> => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location needed', 'Turn on location access to fill city and state for you.');
        return null;
      }

      const position = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (!place) {
        Alert.alert('Location unavailable', 'We could not read your current city. Please pick it manually.');
        return null;
      }

      const state = matchNigerianState(place);
      const lgas = state ? await locationsService.lgas(state) : [];
      const city = matchCity(lgas, place);

      if (!state || !city) {
        Alert.alert('Location unavailable', 'We could not match this place to a Nigerian state. Please pick it manually.');
        return null;
      }

      return {
        state,
        city,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch {
      Alert.alert('Location unavailable', 'We could not read your current location. Please pick it manually.');
      return null;
    } finally {
      setIsLocating(false);
    }
  };

  return { locate, isLocating };
}
