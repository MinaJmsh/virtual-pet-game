import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, outlineWidth } from '@/theme/tokens';

/** Outlined pill progress bar. value is 0..1. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.creamWhite,
    borderWidth: outlineWidth.regular,
    borderColor: colors.outline,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.coral },
});
