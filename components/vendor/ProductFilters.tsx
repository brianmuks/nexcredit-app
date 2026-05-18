import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button, Text } from '@/components/ui';
import { SCREEN_HORIZONTAL_PADDING } from '@/constants/layout';
import {
  countActiveProductFilters,
  DEFAULT_PRODUCT_FILTERS,
  type ProductCashFilter,
  type ProductFilters,
  type ProductSortOption,
  type ProductStatusFilter,
} from '@/lib/product-filters';
import { useScreenInsets } from '@/hooks/useScreenInsets';
import { useTheme } from '@/hooks/useTheme';

type ProductFiltersProps = {
  filters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
  resultCount: number;
  totalCount: number;
};

type FilterOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

const STATUS_OPTIONS: FilterOption<ProductStatusFilter>[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];

const CASH_OPTIONS: FilterOption<ProductCashFilter>[] = [
  { value: 'all', label: 'Any', description: 'Cash and loan-only offers' },
  { value: 'cash', label: 'Cash too', description: 'Also available for cash purchase' },
  { value: 'loan_only', label: 'Loan only', description: 'Not available for cash' },
];

const SORT_OPTIONS: FilterOption<ProductSortOption>[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'amount_high', label: 'Amount: high to low' },
  { value: 'amount_low', label: 'Amount: low to high' },
  { value: 'interest_low', label: 'Interest: low to high' },
  { value: 'interest_high', label: 'Interest: high to low' },
];

export function ProductFilters({
  filters,
  onApply,
  resultCount,
  totalCount,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveProductFilters(filters);
  const showingFiltered = resultCount !== totalCount;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Open filters"
        style={({ pressed }) => [styles.triggerRow, pressed && styles.pressed]}>
        <ProductFiltersTriggerButton activeCount={activeCount} />
        <Text variant="caption" color="muted">
          {showingFiltered
            ? `${resultCount} of ${totalCount} products`
            : `${totalCount} ${totalCount === 1 ? 'product' : 'products'}`}
        </Text>
      </Pressable>

      <ProductFiltersSheet
        visible={open}
        initialFilters={filters}
        onClose={() => setOpen(false)}
        onApply={(next) => {
          onApply(next);
          setOpen(false);
        }}
      />
    </>
  );
}

function ProductFiltersTriggerButton({ activeCount }: { activeCount: number }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.trigger,
        {
          backgroundColor: theme.colors.surface,
          borderColor: activeCount > 0 ? theme.colors.primary : theme.colors.border,
        },
      ]}>
      <Ionicons
        name="options-outline"
        size={18}
        color={activeCount > 0 ? theme.colors.primary : theme.colors.text}
      />
      <Text
        variant="label"
        style={{ color: activeCount > 0 ? theme.colors.primary : theme.colors.text }}>
        Filters
      </Text>
      {activeCount > 0 ? (
        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <Text variant="caption" style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>
            {activeCount}
          </Text>
        </View>
      ) : null}
      <Ionicons name="chevron-down" size={16} color={theme.colors.textMuted} />
    </View>
  );
}

type ProductFiltersSheetProps = {
  visible: boolean;
  initialFilters: ProductFilters;
  onClose: () => void;
  onApply: (filters: ProductFilters) => void;
};

function ProductFiltersSheet({
  visible,
  initialFilters,
  onClose,
  onApply,
}: ProductFiltersSheetProps) {
  const theme = useTheme();
  const { insets } = useScreenInsets();
  const [draft, setDraft] = useState<ProductFilters>(initialFilters);

  useEffect(() => {
    if (visible) {
      setDraft(initialFilters);
    }
  }, [visible, initialFilters]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
        />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

          <View style={styles.sheetHeader}>
            <Text variant="h3">Filters</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close">
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <FilterSection
              title="Status"
              options={STATUS_OPTIONS}
              selected={draft.status}
              onSelect={(status) => setDraft((prev) => ({ ...prev, status }))}
            />
            <FilterSection
              title="Cash sale"
              options={CASH_OPTIONS}
              selected={draft.cash}
              onSelect={(cash) => setDraft((prev) => ({ ...prev, cash }))}
            />
            <FilterSection
              title="Sort by"
              options={SORT_OPTIONS}
              selected={draft.sort}
              onSelect={(sort) => setDraft((prev) => ({ ...prev, sort }))}
            />
          </ScrollView>

          <View style={styles.sheetActions}>
            <Button
              label="Reset"
              variant="outline"
              onPress={() => setDraft(DEFAULT_PRODUCT_FILTERS)}
              style={styles.actionBtn}
            />
            <Button
              label="Apply filters"
              onPress={() => onApply(draft)}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function FilterSection<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text variant="label" color="secondary">
        {title}
      </Text>
      <View style={[styles.optionList, { borderColor: theme.colors.border }]}>
        {options.map((option, index) => {
          const active = option.value === selected;
          const isLast = index === options.length - 1;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.optionRow,
                !isLast && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.border,
                },
                pressed && styles.pressed,
              ]}>
              <View style={styles.optionCopy}>
                <Text variant="body" style={active ? { fontWeight: '600' } : undefined}>
                  {option.label}
                </Text>
                {option.description ? (
                  <Text variant="caption" color="muted">
                    {option.description}
                  </Text>
                ) : null}
              </View>
              {active ? (
                <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
              ) : (
                <View
                  style={[styles.radioEmpty, { borderColor: theme.colors.border }]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pressed: {
    opacity: 0.88,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sheetScroll: {
    flexGrow: 0,
  },
  sheetContent: {
    gap: 20,
    paddingBottom: 8,
  },
  section: {
    gap: 8,
  },
  optionList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  radioEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
