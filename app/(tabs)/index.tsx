import { StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function HomeScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text variant="h1">Hello{user ? `, ${user.firstName}` : ''}</Text>
      <Text variant="body" color="secondary" style={styles.subtitle}>
        Your peer loan ledger — check BC status and open loans before lending.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text variant="label" color="muted">
          Quick start
        </Text>
        <Text variant="body">Browse vendors, review history, or manage your profile.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  subtitle: {
    marginBottom: 4,
  },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
});
