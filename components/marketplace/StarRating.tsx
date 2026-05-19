import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import { View } from 'react-native';

export function StarRating({ rating, accent }: { rating: number; accent: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <MaterialIcons
          key={s}
          name={s <= Math.round(rating) ? 'star' : 'star-border'}
          size={11}
          color={accent}
        />
      ))}
    </View>
  );
}
