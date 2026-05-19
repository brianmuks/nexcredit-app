import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { useCartStore } from '@/store/cart-store';

export default function CheckoutScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { items, totalItems, totalPrice, clearCart } = useCartStore();

  const serviceFee = parseFloat((totalPrice * 0.02).toFixed(2));
  const grandTotal = totalPrice + serviceFee;

  const [placing, setPlacing] = React.useState(false);

  const handlePlaceOrder = () => {
    setPlacing(true);
    const orderRef = 'NX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setTimeout(() => {
      clearCart();
      setPlacing(false);
      router.replace({
        pathname: '/order-success',
        params: { orderRef, total: grandTotal.toLocaleString() },
      });
    }, 1200);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
          Checkout
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Order Summary
          </Text>
          {items.map(({ product, quantity }) => (
            <View key={product.id} style={[styles.lineItem, { borderBottomColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.lineTitle, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]} numberOfLines={1}>
                  {product.title}
                </Text>
                <Text style={[styles.lineSub, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                  {product.brand} · Qty {quantity}
                </Text>
              </View>
              <Text style={[styles.linePrice, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
                K{(product.priceNumber * quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery Info */}
        <View style={[styles.section, styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Delivery
          </Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={18} color={colors.textMuted} />
            <Text style={[styles.infoText, { color: colors.textSecondary, fontFamily: theme.fontFamily.body }]}>
              Campus delivery — arrange with seller after order
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="verified-user" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary, fontFamily: theme.fontFamily.body }]}>
              NexCredit facilitates — pay directly to the student seller
            </Text>
          </View>
        </View>

        {/* Price breakdown */}
        <View style={[styles.section, styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Price Breakdown
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </Text>
            <Text style={[styles.priceValue, { color: colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
              K{totalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              Platform fee (2%)
            </Text>
            <Text style={[styles.priceValue, { color: colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
              K{serviceFee.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary, fontFamily: theme.fontFamily.headline }]}>
              K{grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={handlePlaceOrder}
          disabled={placing}
          style={({ pressed }) => [styles.placeBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.88 }]}>
          {placing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={[styles.placeBtnText, { fontFamily: theme.fontFamily.headline }]}>
                Place Order · K{grandTotal.toLocaleString()}
              </Text>
            </>
          )}
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
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginTop: 24, gap: 12 },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  lineTitle: { fontSize: 14, fontWeight: '600' },
  lineSub: { fontSize: 12, marginTop: 2 },
  linePrice: { fontSize: 14, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 14 },
  priceValue: { fontSize: 14 },
  totalRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 17, fontWeight: '700' },
  totalValue: { fontSize: 20, fontWeight: '700' },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  placeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
  },
  placeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
