import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

const FAQS = [
  {
    q: 'How does NexCredit marketplace work?',
    a: 'Students list items and buyers purchase directly from them. NexCredit facilitates trust and verification.',
  },
  {
    q: 'How long does verification take?',
    a: 'An ambassador contacts you within 24 hours to arrange physical KYC verification.',
  },
  {
    q: 'Can I cancel an order?',
    a: 'Yes. Contact support immediately and provide your order reference to request cancellation.',
  },
];

export default function FAQScreen() {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text variant="h2">FAQ</Text>
      </View>

      {FAQS.map((item) => (
        <View key={item.q} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text variant="h3">{item.q}</Text>
          <Text color="secondary">{item.a}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  backBtn: { padding: 4 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 6 },
});
