import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

const LOGO_SOURCE = require('@/assets/images/logo.png');
const LOGO_ASPECT_RATIO = 432 / 388;

export type LogoProps = {
  /** Render width in dp; height is derived from the asset aspect ratio. */
  width?: number;
  style?: StyleProp<ImageStyle>;
};

export function Logo({ width = 180, style }: LogoProps) {
  return (
    <Image
      source={LOGO_SOURCE}
      accessibilityLabel="nexCredit logo"
      resizeMode="contain"
      style={[styles.logo, { width, height: width / LOGO_ASPECT_RATIO }, style]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
