import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppTheme } from '@/theme';
import { useCartStore } from '@/store/cart-store';
import { StarRating } from './StarRating';
import type { MarketplaceProduct } from './MarketplaceData';

export function ProductDetailModal({
  product,
  visible,
  onClose,
  theme,
}: {
  product: MarketplaceProduct | null;
  visible: boolean;
  onClose: () => void;
  theme: AppTheme;
}) {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((s) => s.addItem);
  const getItemQuantity = useCartStore((s) => s.getItemQuantity);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const [adding, setAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      setAdded(false);
      setAdding(false);
    }
  }, [visible]);

  if (!product) return null;

  const qty = getItemQuantity(product.id);

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      addItem({
        id: product.id,
        brand: product.brand,
        title: product.title,
        priceAmount: product.priceAmount,
        priceNumber: product.priceNumber,
        imageUrl: product.imageUrl,
        monthlyLabel: product.monthlyLabel,
      });
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={[styles.modalRoot, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.modalTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Product Details
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.modalImage}
            resizeMode="cover"
            accessibilityLabel={product.imageAlt}
          />

          <View style={styles.modalBody}>
            <View style={styles.modalBadgeRow}>
              {product.showAprBadge && (
                <View style={[styles.aprBadge, { backgroundColor: colors.primaryMuted }]}>
                  <Text style={[styles.aprBadgeText, { color: colors.primary, fontFamily: theme.fontFamily.bodySemiBold }]}>
                    0% APR
                  </Text>
                </View>
              )}
              {product.isNew && (
                <View style={[styles.newBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.newBadgeText, { color: colors.success, fontFamily: theme.fontFamily.bodySemiBold }]}>
                    NEW
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.modalBrand, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              {product.brand}
            </Text>
            <Text style={[styles.modalProductTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
              {product.title}
            </Text>

            <View style={styles.ratingRow}>
              <StarRating rating={product.rating} accent={colors.primary} />
              <Text style={[styles.ratingText, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </Text>
            </View>

            <View style={[styles.priceBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.modalPrice, { color: colors.primary, fontFamily: theme.fontFamily.headline }]}>
                {product.priceAmount}
              </Text>
              <Text style={[styles.modalMonthly, { color: colors.textSecondary, fontFamily: theme.fontFamily.body }]}>
                {product.monthlyLabel}
              </Text>
            </View>

            <Text style={[styles.modalDesc, { color: colors.textSecondary, fontFamily: theme.fontFamily.body }]}>
              {product.description}
            </Text>

            <View style={[styles.sellerRow, { borderColor: colors.border }]}>
              <View style={[styles.sellerAvatar, { backgroundColor: colors.primaryMuted }]}>
                <MaterialIcons name="storefront" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[styles.sellerName, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
                    {product.sellerName}
                  </Text>
                  {product.sellerVerified && (
                    <MaterialIcons name="verified" size={14} color={colors.primary} />
                  )}
                </View>
                <Text style={[styles.sellerLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                  Verified Campus Seller
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.modalFooter, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
          {qty > 0 ? (
            <View style={styles.qtyControlsModal}>
              <Pressable
                onPress={() => updateQuantity(product.id, qty - 1)}
                style={[styles.qtyBtnModal, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <MaterialIcons name="remove" size={24} color={colors.text} />
              </Pressable>
              <Text style={[styles.qtyTextModal, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
                {qty} in cart
              </Text>
              <Pressable
                onPress={() => updateQuantity(product.id, qty + 1)}
                style={[styles.qtyBtnModal, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <MaterialIcons name="add" size={24} color={colors.text} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleAddToCart}
              disabled={adding}
              style={({ pressed }) => [
                styles.addBtn,
                { backgroundColor: added ? colors.success : colors.primary },
                pressed && { opacity: 0.88 },
              ]}>
              {adding ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.addBtnContent}>
                  <MaterialIcons name={added ? 'check' : 'add-shopping-cart'} size={20} color="#fff" />
                  <Text style={[styles.addBtnText, { fontFamily: theme.fontFamily.headline }]}>
                    {added ? 'Added to Cart!' : 'Add to Cart'}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: '600' },
  modalImage: { width: '100%', aspectRatio: 1.1 },
  modalBody: { padding: 20, gap: 12 },
  modalBadgeRow: { flexDirection: 'row', gap: 8 },
  aprBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  aprBadgeText: { fontSize: 11, fontWeight: '700' },
  newBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  newBadgeText: { fontSize: 11, fontWeight: '700' },
  modalBrand: { fontSize: 13, marginBottom: -4 },
  modalProductTitle: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 13 },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalPrice: { fontSize: 28, fontWeight: '700', lineHeight: 32 },
  modalMonthly: { fontSize: 14 },
  modalDesc: { fontSize: 15, lineHeight: 22 },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
  },
  sellerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  sellerName: { fontSize: 14, fontWeight: '600' },
  sellerLabel: { fontSize: 12, marginTop: 1 },
  modalFooter: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  qtyControlsModal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  qtyBtnModal: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyTextModal: { fontSize: 18, fontWeight: '600' },
  addBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  addBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
