import { Screen, Text } from '@/components/ui';

export default function TabTwoScreen() {
  return (
    <Screen>
      <Text variant="h2">Activity</Text>
      <Text variant="body" color="secondary" style={{ marginTop: 8 }}>
        Loan activity will appear here.
      </Text>
    </Screen>
  );
}
