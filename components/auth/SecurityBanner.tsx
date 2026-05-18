import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

type SecurityBannerProps = {
  message?: string;
};

export function SecurityBanner({
  message = 'Your data is secured with bank-grade encryption.',
}: SecurityBannerProps) {
  const theme = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.inputBackground }]}>
      <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
      <Text variant="bodySmall" color="secondary" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  text: {
    flex: 1,
  },
});
