import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { useCartStore } from '@/store/cart-store';

export default function CartScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Cart
          </Text>
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={56} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
            Browse the Marketplace and add items to get started.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
          Cart ({totalItems})
        </Text>
        <Pressable onPress={clearCart} hitSlop={10}>
          <Text style={[styles.clearText, { color: colors.error, fontFamily: theme.fontFamily.bodyMedium }]}>
            Clear all
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {items.map(({ product, quantity }) => (
          <View key={product.id} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image source={{ uri: product.imageUrl }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemBody}>
              <Text style={[styles.itemBrand, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]} numberOfLines={1}>
                {product.brand}
              </Text>
              <Text style={[styles.itemTitle, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.primary, fontFamily: theme.fontFamily.headline }]}>
                {product.priceAmount}
              </Text>
              <Text style={[styles.itemMonthly, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                {product.monthlyLabel}
              </Text>
              <View style={styles.qtyRow}>
                <Pressable
                  onPress={() => updateQuantity(product.id, quantity - 1)}
                  style={[styles.qtyBtn, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                  <MaterialIcons name="remove" size={16} color={colors.text} />
                </Pressable>
                <Text style={[styles.qtyText, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
                  {quantity}
                </Text>
                <Pressable
                  onPress={() => updateQuantity(product.id, quantity + 1)}
                  style={[styles.qtyBtn, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                  <MaterialIcons name="add" size={16} color={colors.text} />
                </Pressable>
                <Pressable
                  onPress={() => removeItem(product.id)}
                  style={[styles.removeBtn, { backgroundColor: colors.error + '15' }]}
                  hitSlop={8}>
                  <MaterialIcons name="delete-outline" size={16} color={colors.error} />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Summary footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
            Subtotal ({totalItems} items)
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            ${totalPrice.toLocaleString()}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.checkoutBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.88 }]}>
          <Text style={[styles.checkoutText, { fontFamily: theme.fontFamily.headline }]}>
            Proceed to Checkout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  clearText: { fontSize: 14, fontWeight: '500' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  item: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemImage: { width: 100, height: 100 },
  itemBody: { flex: 1, padding: 12, gap: 2 },
  itemBrand: { fontSize: 11 },
  itemTitle: { fontSize: 13, lineHeight: 17, fontWeight: '600' },
  itemPrice: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  itemMonthly: { fontSize: 11 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 14, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  removeBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 20, fontWeight: '700' },
  checkoutBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
