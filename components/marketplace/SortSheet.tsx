import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppTheme } from '@/theme';
import { SORT_OPTIONS, type SortOption } from './MarketplaceData';

export function SortSheet({
  visible,
  current,
  onSelect,
  onClose,
  theme,
}: {
  visible: boolean;
  current: SortOption;
  onSelect: (s: SortOption) => void;
  onClose: () => void;
  theme: AppTheme;
}) {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16 }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
          Sort By
        </Text>
        {SORT_OPTIONS.map((opt) => {
          const active = opt.id === current;
          return (
            <Pressable
              key={opt.id}
              onPress={() => { onSelect(opt.id); onClose(); }}
              style={[
                styles.sortRow,
                active && { backgroundColor: colors.primaryMuted },
              ]}>
              <Text style={[styles.sortLabel, { color: active ? colors.primary : colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
                {opt.label}
              </Text>
              {active && <MaterialIcons name="check" size={18} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
    gap: 4,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sortLabel: { fontSize: 15, fontWeight: '500' },
});
