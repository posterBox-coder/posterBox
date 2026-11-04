import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import type { TravelerMatch } from '@/types';

const LAGOS = { latitude: 6.5244, longitude: 3.3792, latitudeDelta: 0.12, longitudeDelta: 0.12 };

type TravelerMapProps = {
  matches: TravelerMatch[];
  selectedId?: string;
  onSelect: (travelerId: string) => void;
};

export default function TravelerMap({ matches, selectedId, onSelect }: TravelerMapProps) {
  const first = matches.find((item) => item.currentLocation.lat && item.currentLocation.lng);
  const region = first?.currentLocation.lat
    ? {
        latitude: first.currentLocation.lat,
        longitude: first.currentLocation.lng ?? LAGOS.longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      }
    : LAGOS;

  return (
    <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
      {matches.map((item) => {
        if (!item.currentLocation.lat || !item.currentLocation.lng) {
          return null;
        }
        return (
          <Marker
            key={item.traveler.id}
            coordinate={{ latitude: item.currentLocation.lat, longitude: item.currentLocation.lng }}
            title={item.traveler.fullName}
            description={`${item.currentLocation.city}, ${item.currentLocation.state}`}
            pinColor={item.traveler.id === selectedId ? '#AA0000' : '#555555'}
            onPress={() => onSelect(item.traveler.id)}
          />
        );
      })}
    </MapView>
  );
}
