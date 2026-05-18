import { Screen, Text } from '@/components/ui';

export default function HistoryScreen() {
  return (
    <Screen contentContainerStyle={{ gap: 8 }}>
      <Text variant="h1">History</Text>
      <Text variant="body" color="secondary">
        Your loan and repayment history will appear here.
      </Text>
    </Screen>
  );
}
