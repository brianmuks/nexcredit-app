import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { ProductCard, ProductFilters } from '@/components/vendor';
import { Button, Screen, Text } from '@/components/ui';
import { SCREEN_HORIZONTAL_PADDING } from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { applyProductFilters, DEFAULT_PRODUCT_FILTERS } from '@/lib/product-filters';
import { useLenderProductsStore } from '@/store/lender-products-store';
import type { LenderProduct, ProductStatus } from '@/types/product';

export default function VendorProductsScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const lenderId = user?.id ?? '';

  const products = useLenderProductsStore((s) => s.products);
  const isLoading = useLenderProductsStore((s) => s.isLoading);
  const isMutating = useLenderProductsStore((s) => s.isMutating);
  const error = useLenderProductsStore((s) => s.error);
  const fetchProducts = useLenderProductsStore((s) => s.fetchProducts);
  const updateProduct = useLenderProductsStore((s) => s.updateProduct);
  const deleteProduct = useLenderProductsStore((s) => s.deleteProduct);

  const [filters, setFilters] = useState(DEFAULT_PRODUCT_FILTERS);

  const filteredProducts = useMemo(
    () => applyProductFilters(products, filters),
    [products, filters],
  );

  const load = useCallback(() => {
    if (lenderId) {
      void fetchProducts(lenderId);
    }
  }, [fetchProducts, lenderId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleAdd = () => {
    router.push('/(tabs)/vendor/product-form');
  };

  const handleEdit = (product: LenderProduct) => {
    router.push({
      pathname: '/(tabs)/vendor/product-form',
      params: { id: product.id },
    });
  };

  const handleToggleStatus = async (product: LenderProduct) => {
    if (!lenderId) return;
    const nextStatus: ProductStatus = product.status === 'active' ? 'paused' : 'active';
    try {
      await updateProduct(lenderId, product.id, { status: nextStatus });
    } catch {
      // store sets error
    }
  };

  const handleDelete = async (productId: string) => {
    if (!lenderId) return;
    try {
      await deleteProduct(lenderId, productId);
    } catch {
      // store sets error
    }
  };

  const renderItem = ({ item }: { item: LenderProduct }) => (
    <ProductCard
      product={item}
      onEdit={() => handleEdit(item)}
      onToggleStatus={() => void handleToggleStatus(item)}
      onDelete={() => void handleDelete(item.id)}
      busy={isMutating}
    />
  );

  const listHeader = (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerText}>
          <Text variant="h1">My products</Text>
          <Text variant="body" color="secondary">
            Manage loan offers you publish as a lender.
          </Text>
        </View>
        <Pressable
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel="Add product"
          style={({ pressed }) => [
            styles.addFab,
            { backgroundColor: theme.colors.primary },
            pressed && styles.pressed,
          ]}>
          <Ionicons name="add" size={28} color={theme.colors.onPrimary} />
        </Pressable>
      </View>

      {products.length > 0 ? (
        <ProductFilters
          filters={filters}
          onApply={setFilters}
          resultCount={filteredProducts.length}
          totalCount={products.length}
        />
      ) : null}

      {error ? (
        <View style={[styles.banner, { backgroundColor: theme.colors.primaryMuted }]}>
          <Text variant="caption" color="error">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const listEmpty = () => {
    if (isLoading) {
      return (
        <View style={[styles.empty, { backgroundColor: theme.colors.surface }]}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View style={[styles.empty, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="cube-outline" size={40} color={theme.colors.textMuted} />
          <Text variant="h3" align="center">
            No products yet
          </Text>
          <Text variant="body" color="secondary" align="center">
            Post your first loan offer so borrowers can find and request it.
          </Text>
          <Button label="Add product" onPress={handleAdd} fullWidth />
        </View>
      );
    }

    return (
      <View style={[styles.empty, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="funnel-outline" size={40} color={theme.colors.textMuted} />
        <Text variant="h3" align="center">
          No matches
        </Text>
        <Text variant="body" color="secondary" align="center">
          Try changing your filters to see more products.
        </Text>
        <Button
          label="Clear filters"
          variant="outline"
          onPress={() => setFilters(DEFAULT_PRODUCT_FILTERS)}
          fullWidth
        />
      </View>
    );
  };

  return (
    <Screen
      scrollable={false}
      style={styles.screen}
      contentContainerStyle={styles.screenContent}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && products.length > 0}
            onRefresh={load}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingBottom: 24,
  },
  header: {
    gap: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  addFab: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  banner: {
    padding: 12,
    borderRadius: 10,
  },
  separator: {
    height: 12,
  },
  empty: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    borderRadius: 12,
    marginTop: 8,
  },
});
