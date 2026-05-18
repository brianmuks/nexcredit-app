import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useScreenInsets } from '@/hooks/useScreenInsets';
import { useTheme } from '@/hooks/useTheme';
import { SCREEN_HORIZONTAL_PADDING } from '@/constants/layout';

type AuthScreenProps = {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
};

export function AuthScreen({ children, showBack = false, onBack }: AuthScreenProps) {
  const theme = useTheme();
  const { top, insets } = useScreenInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={[styles.inner, { paddingTop: top }]}>
          {showBack ? (
            <Pressable
              onPress={handleBack}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
            </Pressable>
          ) : null}

          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              styles.scroll,
              { paddingBottom: insets.bottom + SCREEN_HORIZONTAL_PADDING },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  backBtn: {
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  },
});
