import { useState } from 'react';
import { Modal, Pressable, FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CAMPUSES, type CampusValue } from '@/constants/campuses';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

type CampusPickerProps = {
  value?: CampusValue;
  onChange: (value: CampusValue) => void;
  error?: string;
};

export function CampusPicker({ value, onChange, error }: CampusPickerProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const selected = CAMPUSES.find((c) => c.value === value);

  return (
    <View style={styles.wrapper}>
      <Text variant="caption" style={styles.label}>
        CAMPUS
      </Text>

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: error ? theme.colors.error : theme.colors.border,
          },
        ]}>
        <Text variant="body" color={selected ? 'default' : 'muted'} style={styles.triggerText}>
          {selected?.label ?? 'Select your campus'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} />
      </Pressable>

      {error ? (
        <Text variant="caption" color="error">
          {error}
        </Text>
      ) : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
            <Text variant="h3" style={styles.sheetTitle}>
              Select campus
            </Text>
            <FlatList
              data={CAMPUSES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}>
                  <Text variant="body">{item.label}</Text>
                  {value === item.value ? (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  ) : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  triggerText: {
    flex: 1,
    paddingVertical: 14,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  sheetTitle: {
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
});
