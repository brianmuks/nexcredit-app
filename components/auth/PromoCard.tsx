import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

export function PromoCard() {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.topRow}>
        <Ionicons name="wifi" size={22} color={theme.colors.onPrimary} />
        <Text variant="caption" color="inverse" style={styles.elite}>
          NEXCREDIT ELITE
        </Text>
      </View>

      <View style={styles.chip}>
        <View style={[styles.chipInner, { borderColor: 'rgba(255,255,255,0.3)' }]} />
      </View>

      <View style={styles.bottom}>
        <Text variant="label" color="inverse">
          Instant Approval
        </Text>
        <Text variant="caption" style={styles.apr}>
          0% APR for the first 12 months
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
    marginTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elite: {
    letterSpacing: 1,
    fontWeight: '700',
  },
  chip: {
    alignSelf: 'center',
    marginVertical: 16,
    width: 48,
    height: 36,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInner: {
    width: 32,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
  },
  bottom: {
    gap: 4,
  },
  apr: {
    color: 'rgba(255,255,255,0.85)',
  },
});
