import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { AppTheme } from '@/theme';
import { useCartStore } from '@/store/cart-store';
import { StarRating } from './StarRating';
import type { MarketplaceProduct } from './MarketplaceData';

export function ProductCard({
  product,
  cardWidth,
  onPress,
  onAddToCart,
  theme,
}: {
  product: MarketplaceProduct;
  cardWidth: number;
  onPress: () => void;
  onAddToCart: () => void;
  theme: AppTheme;
}) {
  const { colors } = theme;
  const qty = useCartStore((s) => s.getItemQuantity(product.id));
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => {
      onAddToCart();
      setAdding(false);
    }, 280);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width: cardWidth,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          ...theme.shadows.md,
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${product.title} by ${product.brand}`}>

      {/* Image */}
      <View style={[styles.imageWrap, { backgroundColor: colors.inputBackground }]}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={product.imageAlt}
        />
        <View style={styles.badgeRow}>
          {product.showAprBadge && (
            <View style={[styles.badge, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>0% APR</Text>
            </View>
          )}
          {product.isNew && (
            <View style={[styles.badge, { backgroundColor: colors.success + '22' }]}>
              <Text style={[styles.badgeText, { color: colors.success }]}>NEW</Text>
            </View>
          )}
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={[styles.brand, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={[styles.title, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.ratingRow}>
          <StarRating rating={product.rating} accent={colors.primary} />
          <Text style={[styles.reviewCount, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
            ({product.reviews})
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.primary, fontFamily: theme.fontFamily.headline }]}>
          {product.priceAmount}
        </Text>
        <Text style={[styles.monthly, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
          {product.monthlyLabel}
        </Text>

        {/* Seller */}
        <View style={styles.sellerRow}>
          <MaterialIcons name="storefront" size={11} color={colors.textMuted} />
          <Text style={[styles.seller, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]} numberOfLines={1}>
            {product.sellerName}
          </Text>
          {product.sellerVerified && (
            <MaterialIcons name="verified" size={11} color={colors.primary} />
          )}
        </View>

        {/* Add to Cart */}
        {qty > 0 ? (
          <View style={styles.qtyRowCard}>
            <Pressable
              onPress={() => updateQuantity(product.id, qty - 1)}
              style={[styles.qtyBtnCard, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <MaterialIcons name="remove" size={16} color={colors.text} />
            </Pressable>
            <Text style={[styles.qtyTextCard, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
              {qty}
            </Text>
            <Pressable
              onPress={() => updateQuantity(product.id, qty + 1)}
              style={[styles.qtyBtnCard, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <MaterialIcons name="add" size={16} color={colors.text} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleAdd}
            disabled={adding}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.title} to cart`}>
            {adding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.addBtnInner}>
                <MaterialIcons name="add" size={14} color="#fff" />
                <Text style={[styles.addBtnText, { color: '#fff', fontFamily: theme.fontFamily.bodySemiBold }]}>
                  Add to Cart
                </Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: { transform: [{ scale: 0.978 }], opacity: 0.95 },
  imageWrap: { width: '100%', aspectRatio: 1.05 },
  image: { width: '100%', height: '100%' },
  badgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  body: { padding: 12, gap: 4 },
  brand: { fontSize: 11, letterSpacing: 0.2 },
  title: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  reviewCount: { fontSize: 10 },
  price: { fontSize: 17, fontWeight: '700', marginTop: 2 },
  monthly: { fontSize: 11, marginTop: -2 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  seller: { fontSize: 10, flex: 1 },
  addBtn: {
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 36,
  },
  addBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  addBtnText: { fontSize: 12, fontWeight: '600' },
  qtyRowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, minHeight: 36 },
  qtyBtnCard: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyTextCard: { fontSize: 14, fontWeight: '600', minWidth: 20, textAlign: 'center' },
});
