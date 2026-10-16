import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';
import { SketchBorder } from './SketchBorder';

/** Outlined pill progress bar. value is 0..1. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }]} />
      </View>
      <SketchBorder radius={7} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 14 },
  track: {
    flex: 1,
    borderRadius: 7,
    backgroundColor: colors.creamWhite,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.coral },
});
