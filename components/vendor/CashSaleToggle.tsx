import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

type CashSaleToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export function CashSaleToggle({ value, onChange }: CashSaleToggleProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Also selling for cash"
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.copy}>
        <Text variant="label">Also selling for cash</Text>
        <Text variant="caption" color="muted">
          Buyers can pay the full amount in cash, not only on loan terms.
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primaryMuted }}
        thumbColor={value ? theme.colors.primary : theme.colors.surface}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  pressed: {
    opacity: 0.92,
  },
});
