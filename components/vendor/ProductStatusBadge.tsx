import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import type { ProductStatus } from '@/types/product';

type ProductStatusBadgeProps = {
  status: ProductStatus;
};

const labels: Record<ProductStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const theme = useTheme();

  const colors = {
    active: { bg: theme.colors.primaryMuted, text: theme.colors.primary },
    paused: { bg: theme.colors.inputBackground, text: theme.colors.textSecondary },
    archived: { bg: theme.colors.inputBackground, text: theme.colors.textMuted },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text variant="caption" style={{ color: colors.text, fontWeight: '600' }}>
        {labels[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});
