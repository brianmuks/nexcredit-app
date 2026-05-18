import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.logoMark, { backgroundColor: theme.colors.primary }]}>
        <Text variant="h2" color="inverse" style={styles.logoText}>
          n
        </Text>
      </View>
      <Text variant="display" style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" color="secondary" align="center">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    textTransform: 'lowercase',
  },
  title: {
    textAlign: 'center',
  },
});
