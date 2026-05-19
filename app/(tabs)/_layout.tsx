import { Redirect, Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingScreen } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

type TabIconProps = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
};

function TabBarIcon({ name, color }: TabIconProps) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} name={name} color={color} />;
}

function CartTabIcon({ color }: { color: string }) {
  const totalItems = useCartStore((s) => s.totalItems);
  const theme = useTheme();
  return (
    <View>
      <FontAwesome size={22} style={{ marginBottom: -2 }} name="shopping-cart" color={color} />
      {totalItems > 0 && (
        <View style={[badgeStyles.badge, { backgroundColor: theme.colors.primary }]}>
          <Text style={badgeStyles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
        </View>
      )}
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});

const TAB_BAR_CONTENT_HEIGHT = 56;

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      initialRouteName="marketplace"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingTop: 6,
          paddingBottom: insets.bottom + 4,
          height: tabBarHeight,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="vendor"
        options={{
          title: 'Vendor',
          tabBarIcon: ({ color }) => <TabBarIcon name="building" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <CartTabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
