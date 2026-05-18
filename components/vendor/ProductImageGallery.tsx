import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { normalizeProductImageUri } from '@/constants/sample-product-images';
import { useTheme } from '@/hooks/useTheme';

type ProductImageGalleryProps = {
  images: string[];
  height?: number;
};

export function ProductImageGallery({ images, height = 120 }: ProductImageGalleryProps) {
  const theme = useTheme();

  if (images.length === 0) {
    return (
      <View
        style={[
          styles.placeholder,
          { height, backgroundColor: theme.colors.inputBackground },
        ]}>
        <Ionicons name="image-outline" size={28} color={theme.colors.textMuted} />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {images.map((uri) => {
        const src = normalizeProductImageUri(uri);
        return (
          <Image
            key={uri}
            source={{ uri: src }}
            style={[styles.image, { height }]}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
  },
  image: {
    width: 140,
    borderRadius: 10,
  },
  placeholder: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
