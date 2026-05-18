import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import type { AppTheme } from '@/theme';
import { useCartStore } from '@/store/cart-store';

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryId =
  | 'all'
  | 'tech'
  | 'fashion'
  | 'home'
  | 'study'
  | 'food'
  | 'services'
  | 'other';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular';

export type MarketplaceProduct = {
  id: string;
  brand: string;
  title: string;
  description: string;
  sellerName: string;
  sellerVerified: boolean;
  monthlyLabel: string;
  priceAmount: string;
  priceNumber: number;
  totalLabel: string;
  imageUrl: string;
  imageAlt: string;
  showAprBadge: boolean;
  isNew: boolean;
  isPopular: boolean;
  rating: number;
  reviews: number;
  categories: CategoryId[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'tech', label: 'Tech & Electronics', icon: 'devices' },
  { id: 'fashion', label: 'Fashion & Beauty', icon: 'checkroom' },
  { id: 'home', label: 'Home & Hostel', icon: 'bed' },
  { id: 'study', label: 'Books & Study', icon: 'menu-book' },
  { id: 'food', label: 'Food & Groceries', icon: 'restaurant' },
  { id: 'services', label: 'Services & Events', icon: 'local-activity' },
  { id: 'other', label: 'Other', icon: 'more-horiz' },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'price_asc', label: 'Lowest Price' },
  { id: 'price_desc', label: 'Highest Price' },
];

const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: '1',
    brand: 'Acoustics Pro',
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Studio-quality sound with 40hr battery. Perfect for lectures and late-night study sessions.',
    sellerName: 'Tech Hub Campus',
    sellerVerified: true,
    monthlyLabel: 'As low as $29/mo',
    priceAmount: '$349',
    priceNumber: 349,
    totalLabel: '$349.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0QysCFKAU60dlTMSYbFWYUx293iuycmFz4l06QWdbj-FbFkcRoiSUyXS0YGQsVWZp5Y6Efd4O4w5GWxQ8-zNn8uQwCG2GgGkXEqSoKNFdanI7_J_GbY8_dgO9L_1Ldp60rWaZ_LDkRwlr6PXxvN018TqKirFShhbWK9TfTApK968QZ7OhV9iwVMw8j-_eI0NwJzKrVhThahD2KdDZXTs3o9KOUMPg4I6s6M2o-Z__UzhLgtzF5pOPjyMQAn3w6lsxdFBNUu3EyObe',
    imageAlt: 'Wireless noise-canceling headphones in matte black.',
    showAprBadge: true,
    isNew: false,
    isPopular: true,
    rating: 4.8,
    reviews: 124,
    categories: ['tech'],
  },
  {
    id: '2',
    brand: 'Horizon Time',
    title: 'Chronograph Elite V2 Watch',
    description: 'Minimalist luxury timepiece. Make an impression at every campus event.',
    sellerName: 'Campus Styles',
    sellerVerified: true,
    monthlyLabel: 'As low as $45/mo',
    priceAmount: '$540',
    priceNumber: 540,
    totalLabel: '$540.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDP-HCw7aEQLGu3Yk_gtt6lG4NADoP19CdW9JGmUK5AmHsIV7AWYD8Hhe6nAj1gBopUGS4PVsUQwZRDbucEu72BWwEjnr8Hm-mnH--J9wpsTHQc1LVktOeBXEnvXlhfkfu_iolRsqvKokgr41SVlax3a315XEDjs5aP987CiDEqCZ2bjkyphYwwiR3YCiy3JKIql52v3nm_XagLDQxK45xek64VOQm8sWVZoSN90WG-DtoKu0hLmHMi_VMWGTZpn4IxJrZkYgZRdpoU',
    imageAlt: 'Luxury minimalist wristwatch with charcoal leather strap.',
    showAprBadge: false,
    isNew: true,
    isPopular: false,
    rating: 4.6,
    reviews: 47,
    categories: ['fashion'],
  },
  {
    id: '3',
    brand: 'Capture One',
    title: '4K Mirrorless Camera Kit',
    description: 'Professional-grade mirrorless camera with 18-55mm lens. Ideal for content creators.',
    sellerName: 'Gadget Zone',
    sellerVerified: true,
    monthlyLabel: 'As low as $110/mo',
    priceAmount: '$1,299',
    priceNumber: 1299,
    totalLabel: '$1,299.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPl61ov43GPD08K5hTaqsyNFHqXtqTTcU0KVSArXgBUqrOZlLsw5RV8GIC5jscwgfD-BYDEzFrlnt60jYi1DzvhMEvRCg-EYOK4gGJby2pCnjurAesz3umaGplOFS-dxNw6nnIacLwMicJvI6jaXTzy8ny9qU2ClH7x9334PyFFBb_G8evVsG9JOY8015gGqP1J-iBr-APfM_wVURCms7esLfd-i-dQ2gNVVUMxbUQGmri-ib0y0UC1vwEZlua7Tjt5ojka3PXDU6t',
    imageAlt: 'Modern digital camera on a minimalist white desk.',
    showAprBadge: true,
    isNew: false,
    isPopular: true,
    rating: 4.9,
    reviews: 89,
    categories: ['tech'],
  },
  {
    id: '4',
    brand: 'NexTab',
    title: 'Ultra-Thin 12" Productivity Tablet',
    description: 'Lightweight tablet built for students. Perfect for notes, PDFs, and online classes.',
    sellerName: 'Tech Hub Campus',
    sellerVerified: true,
    monthlyLabel: 'As low as $62/mo',
    priceAmount: '$749',
    priceNumber: 749,
    totalLabel: '$749.00 total',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDONYydV3_Qyu9g4R857EljrB-kDVuzIMmn6y4QhwzOoGjfM-lTxT-53Dh7ZwAruAVA0hhORWh0708SfA3bDHu80T3MlE2nfrZT3LbDr1g0kDcRhChXtXbY3EtiK0uLH0WT3iet4HMVT8ba0OZ4DCuvfbnCggHKhHs24OrZS9Y49OOMhMZKWKH4YaWixUvmMDdzFRSyyiWZOmKAWAI3JiTG5TcGbmuzgAdlkqpJ8TWEU8Js2eyZTy5ai-pYdmpJGIdtNKwDli2OE5bx',
    imageAlt: 'Slim tablet in a blurred office backdrop.',
    showAprBadge: false,
    isNew: true,
    isPopular: false,
    rating: 4.5,
    reviews: 62,
    categories: ['tech'],
  },
  {
    id: '5',
    brand: 'StudyStack',
    title: 'Computer Science Textbook Bundle',
    description: '5-book bundle covering algorithms, databases, networks, OS, and software engineering.',
    sellerName: 'CampusBooks Co.',
    sellerVerified: false,
    monthlyLabel: 'As low as $12/mo',
    priceAmount: '$140',
    priceNumber: 140,
    totalLabel: '$140.00 total',
    imageUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
    imageAlt: 'Stack of computer science textbooks.',
    showAprBadge: false,
    isNew: false,
    isPopular: true,
    rating: 4.3,
    reviews: 211,
    categories: ['study'],
  },
  {
    id: '6',
    brand: 'HostelKit',
    title: 'Student Room Starter Pack',
    description: 'Everything for your new room: bedding, hangers, desk organiser, and storage boxes.',
    sellerName: 'Dorm Supply Co.',
    sellerVerified: true,
    monthlyLabel: 'As low as $8/mo',
    priceAmount: '$89',
    priceNumber: 89,
    totalLabel: '$89.00 total',
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    imageAlt: 'Dorm room starter essentials laid out neatly.',
    showAprBadge: true,
    isNew: true,
    isPopular: false,
    rating: 4.4,
    reviews: 76,
    categories: ['home'],
  },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, accent }: { rating: number; accent: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <MaterialIcons
          key={s}
          name={s <= Math.round(rating) ? 'star' : 'star-border'}
          size={11}
          color={accent}
        />
      ))}
    </View>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductDetailModal({
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
      <View style={[mStyles.modalRoot, { backgroundColor: colors.background }]}>
        <View style={[mStyles.modalHeader, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} hitSlop={12} style={mStyles.closeBtn}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={[mStyles.modalTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Product Details
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: product.imageUrl }}
            style={mStyles.modalImage}
            resizeMode="cover"
            accessibilityLabel={product.imageAlt}
          />

          <View style={mStyles.modalBody}>
            <View style={mStyles.modalBadgeRow}>
              {product.showAprBadge && (
                <View style={[mStyles.aprBadge, { backgroundColor: colors.primaryMuted }]}>
                  <Text style={[mStyles.aprBadgeText, { color: colors.primary, fontFamily: theme.fontFamily.bodySemiBold }]}>
                    0% APR
                  </Text>
                </View>
              )}
              {product.isNew && (
                <View style={[mStyles.newBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[mStyles.newBadgeText, { color: colors.success, fontFamily: theme.fontFamily.bodySemiBold }]}>
                    NEW
                  </Text>
                </View>
              )}
            </View>

            <Text style={[mStyles.modalBrand, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              {product.brand}
            </Text>
            <Text style={[mStyles.modalProductTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
              {product.title}
            </Text>

            <View style={mStyles.ratingRow}>
              <StarRating rating={product.rating} accent={colors.primary} />
              <Text style={[mStyles.ratingText, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </Text>
            </View>

            <View style={[mStyles.priceBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[mStyles.modalPrice, { color: colors.primary, fontFamily: theme.fontFamily.headline }]}>
                {product.priceAmount}
              </Text>
              <Text style={[mStyles.modalMonthly, { color: colors.textSecondary, fontFamily: theme.fontFamily.body }]}>
                {product.monthlyLabel}
              </Text>
            </View>

            <Text style={[mStyles.modalDesc, { color: colors.textSecondary, fontFamily: theme.fontFamily.body }]}>
              {product.description}
            </Text>

            <View style={[mStyles.sellerRow, { borderColor: colors.border }]}>
              <View style={[mStyles.sellerAvatar, { backgroundColor: colors.primaryMuted }]}>
                <MaterialIcons name="storefront" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[mStyles.sellerName, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
                    {product.sellerName}
                  </Text>
                  {product.sellerVerified && (
                    <MaterialIcons name="verified" size={14} color={colors.primary} />
                  )}
                </View>
                <Text style={[mStyles.sellerLabel, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                  Verified Campus Seller
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[mStyles.modalFooter, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
          {qty > 0 ? (
            <View style={mStyles.qtyControlsModal}>
              <Pressable
                onPress={() => updateQuantity(product.id, qty - 1)}
                style={[mStyles.qtyBtnModal, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <MaterialIcons name="remove" size={24} color={colors.text} />
              </Pressable>
              <Text style={[mStyles.qtyTextModal, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
                {qty} in cart
              </Text>
              <Pressable
                onPress={() => updateQuantity(product.id, qty + 1)}
                style={[mStyles.qtyBtnModal, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <MaterialIcons name="add" size={24} color={colors.text} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleAddToCart}
              disabled={adding}
              style={({ pressed }) => [
                mStyles.addBtn,
                { backgroundColor: added ? colors.success : colors.primary },
                pressed && { opacity: 0.88 },
              ]}>
              {adding ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={mStyles.addBtnContent}>
                  <MaterialIcons name={added ? 'check' : 'add-shopping-cart'} size={20} color="#fff" />
                  <Text style={[mStyles.addBtnText, { fontFamily: theme.fontFamily.headline }]}>
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

const mStyles = StyleSheet.create({
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
  inCartNote: { fontSize: 12, textAlign: 'center' },
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

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
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
        cardStyles.card,
        {
          width: cardWidth,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          ...theme.shadows.md,
        },
        pressed && cardStyles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${product.title} by ${product.brand}`}>

      {/* Image */}
      <View style={[cardStyles.imageWrap, { backgroundColor: colors.inputBackground }]}>
        <Image
          source={{ uri: product.imageUrl }}
          style={cardStyles.image}
          resizeMode="cover"
          accessibilityLabel={product.imageAlt}
        />
        <View style={cardStyles.badgeRow}>
          {product.showAprBadge && (
            <View style={[cardStyles.badge, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[cardStyles.badgeText, { color: colors.primary }]}>0% APR</Text>
            </View>
          )}
          {product.isNew && (
            <View style={[cardStyles.badge, { backgroundColor: colors.success + '22' }]}>
              <Text style={[cardStyles.badgeText, { color: colors.success }]}>NEW</Text>
            </View>
          )}
        </View>
      </View>

      {/* Body */}
      <View style={cardStyles.body}>
        <Text style={[cardStyles.brand, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={[cardStyles.title, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={cardStyles.ratingRow}>
          <StarRating rating={product.rating} accent={colors.primary} />
          <Text style={[cardStyles.reviewCount, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
            ({product.reviews})
          </Text>
        </View>

        <Text style={[cardStyles.price, { color: colors.primary, fontFamily: theme.fontFamily.headline }]}>
          {product.priceAmount}
        </Text>
        <Text style={[cardStyles.monthly, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
          {product.monthlyLabel}
        </Text>

        {/* Seller */}
        <View style={cardStyles.sellerRow}>
          <MaterialIcons name="storefront" size={11} color={colors.textMuted} />
          <Text style={[cardStyles.seller, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]} numberOfLines={1}>
            {product.sellerName}
          </Text>
          {product.sellerVerified && (
            <MaterialIcons name="verified" size={11} color={colors.primary} />
          )}
        </View>

        {/* Add to Cart */}
        {qty > 0 ? (
          <View style={cardStyles.qtyRowCard}>
            <Pressable
              onPress={() => updateQuantity(product.id, qty - 1)}
              style={[cardStyles.qtyBtnCard, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <MaterialIcons name="remove" size={16} color={colors.text} />
            </Pressable>
            <Text style={[cardStyles.qtyTextCard, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
              {qty}
            </Text>
            <Pressable
              onPress={() => updateQuantity(product.id, qty + 1)}
              style={[cardStyles.qtyBtnCard, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <MaterialIcons name="add" size={16} color={colors.text} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleAdd}
            disabled={adding}
            style={({ pressed }) => [
              cardStyles.addBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.title} to cart`}>
            {adding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={cardStyles.addBtnInner}>
                <MaterialIcons name="add" size={14} color="#fff" />
                <Text style={[cardStyles.addBtnText, { color: '#fff', fontFamily: theme.fontFamily.bodySemiBold }]}>
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

const cardStyles = StyleSheet.create({
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

// ─── Sort Bottom Sheet ────────────────────────────────────────────────────────

function SortSheet({
  visible,
  current,
  onSelect,
  onClose,
  theme,
}: {
  visible: boolean;
  current: SortOption;
  onSelect: (s: SortOption) => void;
  onClose: () => void;
  theme: AppTheme;
}) {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sortStyles.overlay} onPress={onClose} />
      <View style={[sortStyles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 16 }]}>
        <View style={[sortStyles.handle, { backgroundColor: colors.border }]} />
        <Text style={[sortStyles.sheetTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
          Sort By
        </Text>
        {SORT_OPTIONS.map((opt) => {
          const active = opt.id === current;
          return (
            <Pressable
              key={opt.id}
              onPress={() => { onSelect(opt.id); onClose(); }}
              style={[
                sortStyles.sortRow,
                active && { backgroundColor: colors.primaryMuted },
              ]}>
              <Text style={[sortStyles.sortLabel, { color: active ? colors.primary : colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
                {opt.label}
              </Text>
              {active && <MaterialIcons name="check" size={18} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const sortStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
    gap: 4,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sortLabel: { fontSize: 15, fontWeight: '500' },
});

// ─── Credit Standing Card ─────────────────────────────────────────────────────

function ExclusiveOffersSection({ theme }: { theme: AppTheme }) {
  const SCORE = 748;
  const SCORE_LABEL = 'EXCELLENT';
  const SCORE_MSG = "You're in the top 12% of users. Your credit health is looking exceptional this month.";

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/vendor')}
      accessibilityRole="button"
      accessibilityLabel="View your credit standing in vendor dashboard"
      style={({ pressed }) => [offersStyles.card, pressed && { opacity: 0.92 }]}>
      {/* Label row */}
      <Text style={offersStyles.standingLabel}>CURRENT STANDING</Text>

      {/* Gauge ring */}
      <View style={offersStyles.gaugeWrap}>
        {/* Outer ring */}
        <View style={offersStyles.gaugeOuter}>
          <View style={offersStyles.gaugeInner}>
            <Text style={offersStyles.scoreNumber}>{SCORE}</Text>
            <Text style={offersStyles.scoreLabel}>{SCORE_LABEL}</Text>
          </View>
        </View>
        {/* Accent arc decoration — top-right quadrant glow */}
        <View style={offersStyles.arcAccent} pointerEvents="none" />
      </View>

      <Text style={offersStyles.scoreMsg}>{SCORE_MSG}</Text>

      {/* Stats row */}
      <View style={offersStyles.statsRow}>
        <View style={offersStyles.statItem}>
          <Text style={offersStyles.statValue}>$5,200</Text>
          <Text style={offersStyles.statCaption}>Available Credit</Text>
        </View>
        <View style={offersStyles.statDivider} />
        <View style={offersStyles.statItem}>
          <Text style={offersStyles.statValue}>35%</Text>
          <Text style={offersStyles.statCaption}>Utilization</Text>
        </View>
        <View style={offersStyles.statDivider} />
        <View style={offersStyles.statItem}>
          <Text style={[offersStyles.statValue, { color: '#22C55E' }]}>Good</Text>
          <Text style={offersStyles.statCaption}>Standing</Text>
        </View>
      </View>

      {/* Footer CTA */}
      <View style={offersStyles.cardFooter}>
        <Text style={offersStyles.ctaText}>View Vendor Dashboard</Text>
        <MaterialIcons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
      </View>
    </Pressable>
  );
}

const offersStyles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: '#1A1F20',
    padding: 24,
    gap: 16,
    overflow: 'hidden',
  },
  standingLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  gaugeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  gaugeOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#F05A28',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  arcAccent: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: '#F05A28',
    borderRightColor: '#F05A28',
    transform: [{ rotate: '45deg' }],
  },
  scoreNumber: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  scoreLabel: {
    color: '#F05A28',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scoreMsg: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },
  statValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  statCaption: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  ctaText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

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
    <View style={[screenStyles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[screenStyles.header, { backgroundColor: colors.background, paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[screenStyles.headerBrand, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
            NexCredit
          </Text>
          <Text style={[screenStyles.headerTitle, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>
            Marketplace
          </Text>
        </View>
        <View style={screenStyles.headerActions}>
          <Pressable
            style={({ pressed }) => [screenStyles.iconBtn, pressed && { opacity: 0.7 }]}
            accessibilityLabel="Search">
            <MaterialIcons name="search" size={24} color={colors.text} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [screenStyles.iconBtn, pressed && { opacity: 0.7 }]}
            accessibilityLabel="Cart">
            <View>
              <MaterialIcons name="shopping-bag" size={24} color={colors.text} />
              {totalItems > 0 && (
                <View style={[screenStyles.cartBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[screenStyles.cartBadgeText, { fontFamily: theme.fontFamily.bodySemiBold }]}>
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
          <ExclusiveOffersSection theme={theme} />
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[screenStyles.chipsRow, { paddingHorizontal: horizontalPad }]}
          style={[screenStyles.chipsScroll, { borderBottomColor: colors.border }]}>
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={[
                  screenStyles.chip,
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
                <Text style={[screenStyles.chipText, { color: active ? '#fff' : colors.textSecondary, fontFamily: theme.fontFamily.bodyMedium }]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: horizontalPad }}>
          {/* Results + Sort row */}
          <View style={screenStyles.resultsRow}>
            <Text style={[screenStyles.resultsText, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </Text>
            <Pressable
              onPress={() => setShowSort(true)}
              style={({ pressed }) => [
                screenStyles.sortBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && { opacity: 0.8 },
              ]}>
              <MaterialIcons name="sort" size={15} color={colors.text} />
              <Text style={[screenStyles.sortBtnText, { color: colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
                {activeSortLabel}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={15} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <View style={screenStyles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={colors.border} />
              <Text style={[screenStyles.emptyText, { color: colors.textMuted, fontFamily: theme.fontFamily.body }]}>
                No products in this category yet.
              </Text>
            </View>
          ) : (
            rows.map((pair) => (
              <View key={pair.map((p) => p.id).join('-')} style={[screenStyles.gridRow, { gap: gridGap }]}>
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

const screenStyles = StyleSheet.create({
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
