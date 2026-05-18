import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text variant="h1">Profile</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text variant="label" color="muted">
          Signed in as
        </Text>
        <Text variant="h3">
          {user ? `${user.firstName} ${user.lastName}` : '—'}
        </Text>
        <Text variant="body" color="secondary">
          {user?.phone}
        </Text>
        {user?.campus ? (
          <Text variant="caption" color="muted" style={styles.meta}>
            Campus: {user.campus}
          </Text>
        ) : null}
        <Text variant="caption" color="secondary" style={styles.meta}>
          Role: {user?.role}
        </Text>
      </View>

      <Button label="Sign out" variant="outline" onPress={handleLogout} fullWidth />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 12,
  },
  meta: {
    marginTop: 4,
    textTransform: 'capitalize',
  },
});
