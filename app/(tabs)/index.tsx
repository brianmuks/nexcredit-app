import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function HomeScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text variant="h1">Hello{user ? `, ${user.firstName}` : ''}</Text>
      <Text variant="body" color="secondary" style={styles.subtitle}>
        Your peer loan ledger — check BC status and open loans before lending.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text variant="label" color="muted">
          Signed in as
        </Text>
        <Text variant="body">{user?.phone}</Text>
        <Text variant="caption" color="secondary" style={styles.role}>
          Role: {user?.role}
        </Text>
      </View>

      <Button label="Sign out" variant="outline" onPress={handleLogout} fullWidth />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: 16,
  },
  subtitle: {
    marginBottom: 8,
  },
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 12,
  },
  role: {
    marginTop: 4,
    textTransform: 'capitalize',
  },
});
