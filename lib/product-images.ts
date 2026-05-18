import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

import { MAX_PRODUCT_IMAGES } from '@/constants/products';

export async function requestPhotoLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === 'granted') {
    return true;
  }

  Alert.alert(
    'Photos access needed',
    'Allow photo library access to add product images.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open settings',
        onPress: () => void Linking.openSettings(),
      },
    ],
  );
  return false;
}

type PickProductImagesOptions = {
  currentCount: number;
  maxImages?: number;
};

export async function pickProductImages({
  currentCount,
  maxImages = MAX_PRODUCT_IMAGES,
}: PickProductImagesOptions): Promise<string[]> {
  const remaining = maxImages - currentCount;
  if (remaining <= 0) {
    return [];
  }

  const allowed = await requestPhotoLibraryPermission();
  if (!allowed) {
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: Platform.OS !== 'web' && remaining > 1,
    selectionLimit: remaining,
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.length) {
    return [];
  }

  return result.assets.slice(0, remaining).map((asset) => asset.uri);
}
