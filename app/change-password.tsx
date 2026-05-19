import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import * as React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { updatePasswordApi } from '@/lib/auth-api';

export default function ChangePasswordScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const onSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing details', 'Fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak password', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirm password do not match.');
      return;
    }
    setSaving(true);
    try {
      await updatePasswordApi(currentPassword, newPassword);
      Alert.alert('Password updated', 'Your password has been changed successfully.');
      router.back();
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ??
        'Could not update password. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text variant="h2">Change Password</Text>
      </View>

      <Text color="secondary">
        Update your password to keep your account secure.
      </Text>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextField
          label="Current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextField
          label="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextField
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <Button
        label="Save Password"
        onPress={onSave}
        loading={saving}
        fullWidth
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 4 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 12, marginTop: 8 },
});
