import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { shadows } from '@/theme';

export function AuthCard({ children, style, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        shadows.md,
        { backgroundColor: theme.colors.surface },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
});
