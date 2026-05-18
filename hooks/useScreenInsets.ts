import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SCREEN_EXTRA_TOP_PADDING,
  SCREEN_HORIZONTAL_PADDING,
} from '@/constants/layout';

export function useScreenInsets() {
  const insets = useSafeAreaInsets();

  const top = insets.top + SCREEN_EXTRA_TOP_PADDING;

  return {
    insets,
    top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    contentStyle: {
      paddingTop: top,
      paddingBottom: Math.max(insets.bottom, SCREEN_HORIZONTAL_PADDING),
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    },
    scrollContentStyle: {
      flexGrow: 1 as const,
      paddingTop: top,
      paddingBottom: Math.max(insets.bottom, SCREEN_HORIZONTAL_PADDING),
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    },
  };
}
