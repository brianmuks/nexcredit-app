import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as React from 'react';
import { Alert, Image, Pressable, StyleSheet, Switch, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const { user, logout } = useAuth();
  const defaultAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop';
  const storagePrefix = user?.id ?? 'guest';
  const avatarKey = `profile_avatar_${storagePrefix}`;
  const biometricKey = `profile_biometric_${storagePrefix}`;
  const pushKey = `profile_push_${storagePrefix}`;
  const emailKey = `profile_email_${storagePrefix}`;
  const twoFactorKey = `profile_two_factor_${storagePrefix}`;
  const [avatarUri, setAvatarUri] = React.useState(defaultAvatar);
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const [pushAlertsEnabled, setPushAlertsEnabled] = React.useState(true);
  const [emailReportsEnabled, setEmailReportsEnabled] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Student User';
  const email = user ? `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@nexcredit.app` : 'student@nexcredit.app';
  const phone = user?.phone ?? '+260 000 000 000';
  const tierLabel = user?.isBcVerified ? 'BLACK TIER MEMBER' : 'CAMPUS MEMBER';

  React.useEffect(() => {
    let mounted = true;
    const loadProfilePrefs = async () => {
      try {
        const [savedAvatar, savedBiometric, savedPush, savedEmail, savedTwoFactor] = await Promise.all([
          AsyncStorage.getItem(avatarKey),
          AsyncStorage.getItem(biometricKey),
          AsyncStorage.getItem(pushKey),
          AsyncStorage.getItem(emailKey),
          AsyncStorage.getItem(twoFactorKey),
        ]);
        if (!mounted) return;
        if (savedAvatar) setAvatarUri(savedAvatar);
        if (savedBiometric) setBiometricEnabled(savedBiometric === 'true');
        if (savedPush) setPushAlertsEnabled(savedPush === 'true');
        if (savedEmail) setEmailReportsEnabled(savedEmail === 'true');
        if (savedTwoFactor) setTwoFactorEnabled(savedTwoFactor === 'true');
      } catch {
        // Keep defaults if storage fails.
      }
    };
    loadProfilePrefs();
    return () => {
      mounted = false;
    };
  }, [avatarKey, biometricKey, pushKey, emailKey, twoFactorKey]);

  const persistBoolean = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch {
      Alert.alert('Update failed', 'Could not save this setting. Please try again.');
    }
  };

  const handleSelectProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to set your profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const selected = result.assets[0].uri;
      setAvatarUri(selected);
      await AsyncStorage.setItem(avatarKey, selected);
    }
  };

  const handleBiometricChange = (value: boolean) => {
    setBiometricEnabled(value);
    persistBoolean(biometricKey, value);
  };

  const handlePushAlertsChange = (value: boolean) => {
    setPushAlertsEnabled(value);
    persistBoolean(pushKey, value);
  };

  const handleEmailReportsChange = (value: boolean) => {
    setEmailReportsEnabled(value);
    persistBoolean(emailKey, value);
  };

  const handleTwoFactorChange = (value: boolean) => {
    setTwoFactorEnabled(value);
    persistBoolean(twoFactorKey, value);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text style={[styles.brandText, { color: colors.text, fontFamily: theme.fontFamily.headline }]}>NexCredit</Text>

      <View style={styles.profileHeader}>
        <Pressable onPress={handleSelectProfilePhoto} style={[styles.avatarRing, { borderColor: colors.primary }]}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
          />
          <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.editAvatarBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialIcons name="edit" size={12} color={colors.textSecondary} />
          </View>
        </Pressable>
        <Text style={[styles.profileName, { color: colors.text, fontFamily: theme.fontFamily.bodySemiBold }]}>
          {fullName}
        </Text>
        <View style={[styles.tierPill, { backgroundColor: colors.inputBackground }]}>
          <Text style={[styles.tierText, { color: colors.textSecondary, fontFamily: theme.fontFamily.bodyMedium }]}>
            {tierLabel}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: theme.fontFamily.bodyMedium }]}>
        Personal Information
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <InfoRow icon="person-outline" label="Full Name" value={fullName} theme={theme} />
        <InfoRow icon="mail-outline" label="Email Address" value={email} theme={theme} />
        <InfoRow icon="phone-iphone" label="Phone Number" value={phone} theme={theme} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: theme.fontFamily.bodyMedium }]}>
        Security Settings
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ToggleRow
          icon="fingerprint"
          label="Biometric Login"
          value={biometricEnabled}
          onValueChange={handleBiometricChange}
          theme={theme}
        />
        <Pressable
          onPress={() => router.push('/change-password')}
          style={[styles.actionRow, { borderTopColor: colors.border }]}>
          <MaterialIcons name="lock-reset" size={19} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
            Change Password
          </Text>
          <MaterialIcons name="chevron-right" size={18} color={colors.textMuted} />
        </Pressable>
        <ToggleRow
          icon="shield"
          label="Two-Factor Authentication"
          value={twoFactorEnabled}
          onValueChange={handleTwoFactorChange}
          theme={theme}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: theme.fontFamily.bodyMedium }]}>
        Notification Preferences
      </Text>
      <View style={styles.preferenceStack}>
        <View style={[styles.preferenceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ToggleRow
            icon="notifications-none"
            label="Push Alerts"
            value={pushAlertsEnabled}
            onValueChange={handlePushAlertsChange}
            theme={theme}
            noDivider
          />
        </View>
        <View style={[styles.preferenceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ToggleRow
            icon="mail-outline"
            label="Email Reports"
            value={emailReportsEnabled}
            onValueChange={handleEmailReportsChange}
            theme={theme}
            noDivider
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: theme.fontFamily.bodyMedium }]}>
        Help & Support
      </Text>
      <View style={styles.helpRow}>
        {[
          { icon: 'chat-bubble-outline', label: 'Live Chat', route: '/live-chat' },
          { icon: 'help-outline', label: 'FAQ', route: '/faq' },
          { icon: 'policy', label: 'Policy', route: '/policy' },
        ].map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [
              styles.helpCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push(item.route as any)}>
            <MaterialIcons name={item.icon as any} size={20} color={colors.primary} />
            <Text style={[styles.helpText, { color: colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutBtn,
          { borderColor: colors.primaryMuted, backgroundColor: colors.background },
          pressed && { opacity: 0.88 },
        ]}>
        <Text style={[styles.logoutText, { color: colors.secondary, fontFamily: theme.fontFamily.bodyMedium }]}>
          Log Out Account
        </Text>
      </Pressable>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
  theme,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={19} color={theme.colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: theme.colors.textMuted, fontFamily: theme.fontFamily.body }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onValueChange,
  theme,
  noDivider = false,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  theme: ReturnType<typeof useTheme>;
  noDivider?: boolean;
}) {
  return (
    <View style={[styles.actionRow, !noDivider && { borderTopColor: theme.colors.border }]}>
      <MaterialIcons name={icon} size={19} color={theme.colors.primary} />
      <Text style={[styles.actionText, { color: theme.colors.text, fontFamily: theme.fontFamily.bodyMedium }]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12 },
  brandText: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  profileHeader: { alignItems: 'center', marginBottom: 6 },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: { width: 78, height: 78, borderRadius: 39 },
  statusDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    right: 2,
    bottom: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontSize: 23, marginTop: 10 },
  tierPill: { marginTop: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 },
  tierText: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7 },
  sectionTitle: { fontSize: 15, marginTop: 10, marginBottom: 2 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 14, marginTop: 2 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionText: { flex: 1, fontSize: 14 },
  preferenceStack: { gap: 8, marginBottom: 2 },
  preferenceCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  helpRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  helpCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  helpText: { fontSize: 12 },
  logoutBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 22,
  },
  logoutText: { fontSize: 16, fontWeight: '600' },
});
