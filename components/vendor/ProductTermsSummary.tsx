import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui';
import { formatInterestRate, formatTenure } from '@/lib/format';
import { useTheme } from '@/hooks/useTheme';

type ProductTermsSummaryProps = {
  interestRatePercent: number;
  tenureMonths: number;
  availableForCash: boolean;
};

export function ProductTermsSummary({
  interestRatePercent,
  tenureMonths,
  availableForCash,
}: ProductTermsSummaryProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.row, { backgroundColor: theme.colors.inputBackground }]}>
        <View style={styles.item}>
          <Text variant="caption" color="muted">
            Interest
          </Text>
          <Text variant="label">{formatInterestRate(interestRatePercent)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.item}>
          <Text variant="caption" color="muted">
            Tenure
          </Text>
          <Text variant="label">{formatTenure(tenureMonths)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.item}>
          <Text variant="caption" color="muted">
            Cash sale
          </Text>
          <Text variant="label">{availableForCash ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      {availableForCash ? (
        <View style={[styles.cashNote, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons name="cash-outline" size={16} color={theme.colors.primary} />
          <Text variant="caption" color="primary" style={styles.cashNoteText}>
            Also available for cash purchase at the listed price
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    gap: 4,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 2,
  },
  cashNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cashNoteText: {
    flex: 1,
  },
});
