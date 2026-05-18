import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ProductImageGallery } from '@/components/vendor/ProductImageGallery';
import { ProductStatusBadge } from '@/components/vendor/ProductStatusBadge';
import { ProductTermsSummary } from '@/components/vendor/ProductTermsSummary';
import { Button, Text } from '@/components/ui';
import { formatZmw } from '@/lib/format';
import { useTheme } from '@/hooks/useTheme';
import type { LenderProduct } from '@/types/product';

type ProductCardProps = {
  product: LenderProduct;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  busy?: boolean;
};

export function ProductCard({
  product,
  onEdit,
  onToggleStatus,
  onDelete,
  busy = false,
}: ProductCardProps) {
  const theme = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Delete product',
      `Remove "${product.title}"? Borrowers will no longer see this offer.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const toggleLabel = product.status === 'active' ? 'Pause' : 'Activate';

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <ProductImageGallery images={product.images} />

      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text variant="h3" numberOfLines={2}>
            {product.title}
          </Text>
          <ProductStatusBadge status={product.status} />
        </View>
        <Text variant="h2" color="primary">
          {formatZmw(product.amountZmw)}
        </Text>
      </View>

      <ProductTermsSummary
        interestRatePercent={product.interestRatePercent}
        tenureMonths={product.termMonths}
        availableForCash={product.availableForCash}
      />

      <Text variant="body" color="secondary" numberOfLines={3} style={styles.description}>
        {product.description}
      </Text>

      <View style={styles.actions}>
        <Button
          label="Edit"
          variant="outline"
          size="sm"
          onPress={onEdit}
          disabled={busy}
          style={styles.actionBtn}
        />
        <Button
          label={toggleLabel}
          variant="secondary"
          size="sm"
          onPress={onToggleStatus}
          disabled={busy || product.status === 'archived'}
          style={styles.actionBtn}
        />
        <Pressable
          onPress={handleDelete}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Delete product"
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  header: {
    gap: 8,
  },
  titleBlock: {
    gap: 8,
  },
  description: {
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
  },
  deleteBtn: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
