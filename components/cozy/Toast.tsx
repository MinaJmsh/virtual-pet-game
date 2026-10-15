import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { colors, outlineWidth, radii, spacing } from '@/theme/tokens';
import { CozyText } from './CozyText';

/** Small floating message. Place inside a relatively-positioned parent. */
export function Toast({ message, top = spacing.md }: { message: string | null; top?: number }) {
  return (
    <View pointerEvents="none" style={[styles.wrap, { top }]}>
      {message ? (
        <Animated.View entering={FadeInDown.duration(200)} exiting={FadeOut.duration(200)} style={styles.toast}>
          <CozyText variant="label">{message}</CozyText>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 20 },
  toast: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.creamWhite,
    borderWidth: outlineWidth.regular,
    borderColor: colors.outline,
  },
});
