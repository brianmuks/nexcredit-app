import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useScreenInsets } from '@/hooks/useScreenInsets';
import { useTheme } from '@/hooks/useTheme';
import { SCREEN_EXTRA_TOP_PADDING } from '@/constants/layout';

type ScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  keyboardAvoiding?: boolean;
  /** Additional top padding below the safe area (defaults to app standard). */
  extraTopPadding?: number;
} & Pick<ScrollViewProps, 'keyboardShouldPersistTaps'>;

export function Screen({
  children,
  scrollable = true,
  edges = ['left', 'right', 'bottom'],
  contentContainerStyle,
  style,
  keyboardAvoiding = true,
  extraTopPadding = SCREEN_EXTRA_TOP_PADDING,
  keyboardShouldPersistTaps = 'handled',
}: ScreenProps) {
  const theme = useTheme();
  const { insets, scrollContentStyle } = useScreenInsets();

  const topPadding = insets.top + extraTopPadding;
  const bottomPadding = Math.max(insets.bottom, scrollContentStyle.paddingBottom as number);

  const paddedContentStyle: ViewStyle = {
    paddingTop: topPadding,
    paddingBottom: bottomPadding,
    paddingHorizontal: scrollContentStyle.paddingHorizontal,
  };

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[paddedContentStyle, contentContainerStyle]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, paddedContentStyle, contentContainerStyle]}>{children}</View>
  );

  const body = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: theme.colors.background }, style]}
      edges={edges}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
