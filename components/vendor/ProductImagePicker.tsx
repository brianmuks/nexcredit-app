import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui';
import { MAX_PRODUCT_IMAGES } from '@/constants/products';
import { normalizeProductImageUri } from '@/constants/sample-product-images';
import { pickProductImages } from '@/lib/product-images';
import { useTheme } from '@/hooks/useTheme';

type ProductImagePickerProps = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  error?: string;
};

export function ProductImagePicker({
  images,
  onChange,
  maxImages = MAX_PRODUCT_IMAGES,
  error,
}: ProductImagePickerProps) {
  const theme = useTheme();
  const [picking, setPicking] = useState(false);

  const canAddMore = images.length < maxImages;

  const handleAdd = async () => {
    if (!canAddMore || picking) return;
    setPicking(true);
    try {
      const picked = await pickProductImages({ currentCount: images.length, maxImages });
      if (picked.length > 0) {
        onChange([...images, ...picked].slice(0, maxImages));
      }
    } finally {
      setPicking(false);
    }
  };

  const handleRemove = (uri: string) => {
    onChange(images.filter((item) => item !== uri));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text variant="label" color="secondary">
          Photos
        </Text>
        <Text variant="caption" color="muted">
          {images.length}/{maxImages}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {images.map((uri) => {
          const src = normalizeProductImageUri(uri);
          return (
            <View key={uri} style={styles.thumbWrap}>
              <Image
                source={{ uri: src }}
                style={styles.thumb}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <Pressable
                onPress={() => handleRemove(uri)}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
                style={({ pressed }) => [
                  styles.removeBtn,
                  { backgroundColor: theme.colors.secondary },
                  pressed && styles.pressed,
                ]}>
                <Ionicons name="close" size={14} color={theme.colors.onSecondary} />
              </Pressable>
            </View>
          );
        })}

        {canAddMore ? (
          <Pressable
            onPress={() => void handleAdd()}
            disabled={picking}
            accessibilityRole="button"
            accessibilityLabel="Add photos"
            style={({ pressed }) => [
              styles.addSlot,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.inputBackground,
              },
              pressed && styles.pressed,
            ]}>
            {picking ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <>
                <Ionicons name="images-outline" size={28} color={theme.colors.primary} />
                <Text variant="caption" color="secondary" align="center">
                  Add
                </Text>
              </>
            )}
          </Pressable>
        ) : null}
      </ScrollView>

      <Text variant="caption" color="muted">
        Add up to {maxImages} photos. Optional — helps borrowers recognize your offer.
      </Text>

      {error ? (
        <Text variant="caption" color="error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const THUMB_SIZE = 96;

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    gap: 10,
    paddingVertical: 4,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSlot: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
