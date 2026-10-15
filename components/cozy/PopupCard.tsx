import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { colors, outlineWidth, radii, spacing } from '@/theme/tokens';

/** Dimmed backdrop + centered outlined card (the popup style from the spec). Place inside a full-screen parent. */
export function PopupCard({ children }: { children: ReactNode }) {
  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.backdrop}>
      <Animated.View entering={ZoomIn.duration(220)} style={styles.card}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.backdrop, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, zIndex: 30 },
  card: {
    width: '100%',
    maxWidth: 320,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
    borderRadius: radii.cell,
    backgroundColor: colors.bgApp,
    borderWidth: outlineWidth.regular,
    borderColor: colors.outline,
  },
});
