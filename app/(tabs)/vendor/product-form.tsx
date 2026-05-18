import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CashSaleToggle, ProductImagePicker } from '@/components/vendor';
import { Button, Screen, Text, TextField } from '@/components/ui';
import {
  productFormSchema,
  toCreateProductInput,
  validateProductImages,
  type ProductFormValues,
} from '@/lib/product-schemas';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLenderProductsStore } from '@/store/lender-products-store';
import type { ProductStatus } from '@/types/product';

export default function ProductFormScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const lenderId = user?.id ?? '';

  const products = useLenderProductsStore((s) => s.products);
  const isMutating = useLenderProductsStore((s) => s.isMutating);
  const fetchProducts = useLenderProductsStore((s) => s.fetchProducts);
  const createProduct = useLenderProductsStore((s) => s.createProduct);
  const updateProduct = useLenderProductsStore((s) => s.updateProduct);

  const existing = products.find((p) => p.id === id);

  useEffect(() => {
    if (isEditing && lenderId && !existing) {
      void fetchProducts(lenderId);
    }
  }, [isEditing, lenderId, existing, fetchProducts]);
  const [status, setStatus] = useState<ProductStatus>(existing?.status ?? 'active');
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | undefined>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      amountZmw: '500',
      interestRatePercent: '15',
      termMonths: '6',
      availableForCash: false,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        amountZmw: String(existing.amountZmw),
        interestRatePercent: String(existing.interestRatePercent),
        termMonths: String(existing.termMonths),
        availableForCash: existing.availableForCash,
      });
      setStatus(existing.status);
      setImages(existing.images ?? []);
    }
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!lenderId) {
      Alert.alert('Not signed in', 'Sign in again to save products.');
      return;
    }

    const imagesValidation = validateProductImages(images);
    if (imagesValidation) {
      setImageError(imagesValidation);
      return;
    }
    setImageError(undefined);

    try {
      const payload = toCreateProductInput(values, images);
      if (isEditing && id) {
        await updateProduct(lenderId, id, { ...payload, status });
      } else {
        await createProduct(lenderId, payload);
      }
      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save product';
      Alert.alert('Save failed', message);
    }
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/vendor');
    }
  };

  const cycleStatus = () => {
    setStatus((current) => {
      if (current === 'active') return 'paused';
      if (current === 'paused') return 'active';
      return 'active';
    });
  };

  return (
    <Screen
      keyboardAvoiding
      contentContainerStyle={styles.content}
      extraTopPadding={4}>
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
        </Pressable>
        <Text variant="h2">{isEditing ? 'Edit product' : 'New product'}</Text>
      </View>

      <Text variant="body" color="secondary">
        {isEditing
          ? 'Update your loan offer details. Paused offers are hidden from borrowers.'
          : 'Describe the loan offer borrowers can request from you.'}
      </Text>

      <View style={styles.form}>
        <ProductImagePicker
          images={images}
          onChange={(next) => {
            setImages(next);
            setImageError(validateProductImages(next));
          }}
          error={imageError}
        />

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Title"
              placeholder="e.g. Campus laptop loan"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Description"
              placeholder="What the loan covers, eligibility, repayment notes…"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              style={styles.textArea}
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="amountZmw"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Amount (ZMW)"
              placeholder="500"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.amountZmw?.message}
            />
          )}
        />

        <View style={styles.termsSection}>
          <Text variant="label" color="secondary">
            Loan terms
          </Text>
          <View style={styles.row}>
            <View style={styles.half}>
              <Controller
                control={control}
                name="interestRatePercent"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Interest rate (%)"
                    placeholder="15"
                    keyboardType="decimal-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    hint="Annual interest charged on the loan"
                    error={errors.interestRatePercent?.message}
                  />
                )}
              />
            </View>
            <View style={styles.half}>
              <Controller
                control={control}
                name="termMonths"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Tenure (months)"
                    placeholder="6"
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    hint="How long the borrower has to repay"
                    error={errors.termMonths?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <Controller
          control={control}
          name="availableForCash"
          render={({ field: { value, onChange } }) => (
            <CashSaleToggle value={value} onChange={onChange} />
          )}
        />

        {isEditing ? (
          <View style={[styles.statusRow, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.statusCopy}>
              <Text variant="label">Visibility</Text>
              <Text variant="caption" color="muted">
                {status === 'active'
                  ? 'Visible to borrowers'
                  : status === 'paused'
                    ? 'Hidden from borrowers'
                    : 'Archived'}
              </Text>
            </View>
            <Button
              label={status === 'active' ? 'Pause' : 'Activate'}
              variant="outline"
              size="sm"
              onPress={cycleStatus}
              disabled={status === 'archived'}
            />
          </View>
        ) : null}
      </View>

      <Button
        label={isEditing ? 'Save changes' : 'Publish product'}
        onPress={onSubmit}
        loading={isMutating}
        fullWidth
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  form: {
    gap: 16,
  },
  termsSection: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  statusCopy: {
    flex: 1,
    gap: 4,
  },
});
