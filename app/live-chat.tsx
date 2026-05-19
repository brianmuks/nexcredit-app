import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function LiveChatScreen() {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text variant="h2">Live Chat</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialIcons name="support-agent" size={40} color={colors.primary} />
        <Text variant="h3">Support Agent Offline</Text>
        <Text color="secondary" align="center">
          Live chat is available from 08:00 to 18:00. Leave a message and an agent will call you back.
        </Text>
      </View>

      <Button
        label="Request Callback"
        fullWidth
        onPress={() => Alert.alert('Callback Requested', 'A support agent will contact you shortly.')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 4 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
});
