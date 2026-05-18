import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

type AuthFooterProps = {
  variant?: 'login' | 'register' | 'verify';
};

export function AuthFooter({ variant = 'login' }: AuthFooterProps) {
  const theme = useTheme();

  if (variant === 'verify') {
    return (
      <View style={styles.verifyFooter}>
        <View style={styles.iconRow}>
          <Ionicons name="shield" size={18} color={theme.colors.textMuted} />
          <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.textMuted} />
          <Ionicons name="finger-print" size={18} color={theme.colors.textMuted} />
        </View>
        <Text variant="caption" color="muted" align="center">
          © 2024 NexCredit International. Member FDIC.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.footer}>
      {variant === 'login' ? (
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={14} color={theme.colors.primary} />
            <Text variant="caption" style={styles.badgeText}>
              BANK-LEVEL SECURITY
            </Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="lock-closed" size={14} color={theme.colors.primary} />
            <Text variant="caption" style={styles.badgeText}>
              256-BIT AES
            </Text>
          </View>
        </View>
      ) : null}

      <Text variant="caption" color="muted" align="center" style={styles.copyright}>
        {variant === 'register'
          ? 'SECURED BY NEXCREDIT SYSTEMS © 2024'
          : '© 2024 NEXCREDIT GLOBAL FINANCIAL. ALL RIGHTS RESERVED.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    letterSpacing: 0.5,
    fontWeight: '600',
    fontSize: 10,
  },
  copyright: {
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  verifyFooter: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 20,
  },
});
