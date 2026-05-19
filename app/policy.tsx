import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function PolicyScreen() {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text variant="h2">Policy</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text variant="h3">Privacy & Verification</Text>
        <Text color="secondary">
          NexCredit collects only required KYC details to verify borrowers and facilitate safe student-to-student
          transactions.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text variant="h3">Marketplace Responsibility</Text>
        <Text color="secondary">
          Sellers are responsible for item condition and delivery terms. Buyers should verify details before completing
          payment.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  backBtn: { padding: 4 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 6 },
});
