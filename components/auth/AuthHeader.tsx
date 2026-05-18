import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand';
import { Text } from '@/components/ui/Text';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  logoWidth?: number;
  compact?: boolean;
};

export function AuthHeader({
  title,
  subtitle,
  showLogo = true,
  logoWidth = 120,
  compact = false,
}: AuthHeaderProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      {showLogo ? <Logo width={logoWidth} /> : null}

      <Text variant={compact ? 'h2' : 'h1'} align="center">
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
    marginBottom: 24,
    marginTop: 8,
  },
  compact: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
});
