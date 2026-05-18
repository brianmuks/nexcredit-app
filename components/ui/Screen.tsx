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

import { SCREEN_EXTRA_TOP_PADDING, SCREEN_HORIZONTAL_PADDING } from '@/constants/layout';
import { useScreenInsets } from '@/hooks/useScreenInsets';
import { useTheme } from '@/hooks/useTheme';

type ScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  /** Safe area edges for the screen shell. Top is always recommended. */
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  keyboardAvoiding?: boolean;
  /** Extra padding below the status bar / notch (in addition to SafeAreaView top inset). */
  extraTopPadding?: number;
  /** Include bottom safe area inset in content (disable inside tab navigator — tab bar handles it). */
  safeBottom?: boolean;
} & Pick<ScrollViewProps, 'keyboardShouldPersistTaps'>;

export function Screen({
  children,
  scrollable = true,
  edges = ['top', 'left', 'right'],
  contentContainerStyle,
  style,
  keyboardAvoiding = true,
  extraTopPadding = SCREEN_EXTRA_TOP_PADDING,
  safeBottom = false,
  keyboardShouldPersistTaps = 'handled',
}: ScreenProps) {
  const theme = useTheme();
  const { insets } = useScreenInsets();

  const safeEdges: Edge[] = safeBottom ? [...edges, 'bottom'] : edges;

  const paddedContentStyle: ViewStyle = {
    paddingTop: extraTopPadding,
    paddingBottom: safeBottom
      ? Math.max(insets.bottom, SCREEN_HORIZONTAL_PADDING)
      : SCREEN_HORIZONTAL_PADDING,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
  };

  const content = scrollable ? (
    <ScrollView
      style={styles.flex}
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
      edges={safeEdges}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
