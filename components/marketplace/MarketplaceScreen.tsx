import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { useCartStore } from '@/store/cart-store';

import {
  CATEGORIES,
  MARKETPLACE_PRODUCTS,
  SORT_OPTIONS,
  type CategoryId,
  type MarketplaceProduct,
  type SortOption,
} from './MarketplaceData';

import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { SortSheet } from './SortSheet';
import { CreditStandingCard } from './CreditStandingCard';

export function MarketplaceScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const [category, setCategory] = React.useState<CategoryId>('all');
  const [sort, setSort] = React.useState<SortOption>('newest');
  const [showSort, setShowSort] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<MarketplaceProduct | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) => s.totalItems);

  const horizontalPad = 16;
  const gridGap = 14;
  const cardWidth = (windowWidth - horizontalPad * 2 - gridGap) / 2;

  const filtered = React.useMemo(() => {
    const base = category === 'all'
      ? MARKETPLACE_PRODUCTS
      : MARKETPLACE_PRODUCTS.filter((p) => p.categories.includes(category));
    switch (sort) {
      case 'price_asc': return [...base].sort((a, b) => a.priceNumber - b.priceNumber);
      case 'price_desc': return [...base].sort((a, b) => b.priceNumber - a.priceNumber);
      case 'popular': return [...base].sort((a, b) => b.reviews - a.reviews);
      default: return base;
    }
  }, [category, sort]);

  const rows = React.useMemo(() => {
    const out: MarketplaceProduct[][] = [];
    for (let i = 0; i < filtered.length; i += 2) out.push(filtered.slice(i, i + 2));
    return out;
  }, [filtered]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.id === sort)?.label ?? 'Newest';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerBrand, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
            NexCredit
          </Text>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Marketplace
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
            accessibilityLabel="Search">
            <MaterialIcons name="search" size={24} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/cart')}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
            accessibilityLabel="Cart">
            <View>
              <MaterialIcons name="shopping-bag" size={24} color={colors.text} />
              {totalItems > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.cartBadgeText, { fontFamily: theme.fontFamily.bodySemiBold }]}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Campus Marketplace Info - P2P Selling CTA */}
        <View style={{ paddingHorizontal: horizontalPad, marginTop: 12, marginBottom: 8 }}>
          <CreditStandingCard theme={theme} />
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.chipsRow, { paddingHorizontal: horizontalPad }]}
          style={[styles.chipsScroll, { borderBottomColor: colors.border }]}>
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}>
                <MaterialIcons
                  name={c.icon as any}
                  size={14}
                  color={active ? '#fff' : colors.textSecondary}
                />
                <Text style={[styles.chipText, { color: active ? '#fff' : colors.textSecondary, fontFamily: theme.fontFamily.bodyMedium }]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: horizontalPad }}>
          {/* Results + Sort row */}
          <View style={styles.resultsRow}>
            <Text style={[styles.resultsText, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </Text>
            <Pressable
              onPress={() => setShowSort(true)}
              style={({ pressed }) => [
                styles.sortBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && { opacity: 0.8 },
              ]}>
              <MaterialIcons name="sort" size={15} color={colors.text} />
              <Text style={[styles.sortBtnText, { color: colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
                {activeSortLabel}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={15} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                No products in this category yet.
              </Text>
            </View>
          ) : (
            rows.map((pair) => (
              <View key={pair.map((p) => p.id).join('-')} style={[styles.gridRow, { gap: gridGap }]}>
                {pair.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    cardWidth={cardWidth}
                    theme={theme}
                    onPress={() => setSelectedProduct(p)}
                    onAddToCart={() =>
                      addItem({
                        id: p.id,
                        brand: p.brand,
                        title: p.title,
                        priceAmount: p.priceAmount,
                        priceNumber: p.priceNumber,
                        imageUrl: p.imageUrl,
                        monthlyLabel: p.monthlyLabel,
                      })
                    }
                  />
                ))}
                {pair.length === 1 && <View style={{ width: cardWidth }} />}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <SortSheet
        visible={showSort}
        current={sort}
        onSelect={setSort}
        onClose={() => setShowSort(false)}
        theme={theme}
      />
      <ProductDetailModal
        product={selectedProduct}
        visible={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBrand: { fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 2 },
  iconBtn: { padding: 8 },
  cartBadge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  chipsScroll: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  chipsRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '500' },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
  },
  resultsText: { fontSize: 13 },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortBtnText: { fontSize: 13, fontWeight: '500' },
  gridRow: { flexDirection: 'row', marginBottom: 14 },
  emptyState: { paddingVertical: 48, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
