import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type PickerOptions = {
  cameraType?: ImagePicker.CameraType;
  allowsEditing?: boolean;
  aspect?: [number, number];
};

async function ensureLibraryPermission() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission required', 'Allow photo library access to upload your ID.');
    return false;
  }
  return true;
}

async function ensureCameraPermission() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission required', 'Allow camera access to take a photo.');
    return false;
  }
  return true;
}

export async function pickFromLibrary(options: PickerOptions = {}) {
  if (!(await ensureLibraryPermission())) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0]?.uri ?? null;
}

export async function capturePhoto(options: PickerOptions = {}) {
  if (!(await ensureCameraPermission())) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: 0.8,
    cameraType: options.cameraType ?? ImagePicker.CameraType.front,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0]?.uri ?? null;
}

export function chooseImageSource(handlers: { camera: () => void; library: () => void }) {
  Alert.alert('Add image', 'Choose a source', [
    { text: 'Take photo', onPress: handlers.camera },
    { text: 'Photo library', onPress: handlers.library },
    { text: 'Cancel', style: 'cancel' },
  ]);
}
