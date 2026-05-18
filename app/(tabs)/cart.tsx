import { Screen, Text } from '@/components/ui';

export default function CartScreen() {
  return (
    <Screen contentContainerStyle={{ gap: 8 }}>
      <Text variant="h1">Cart</Text>
      <Text variant="body" color="secondary">
        Items you are ready to request or confirm will appear here.
      </Text>
    </Screen>
  );
}
