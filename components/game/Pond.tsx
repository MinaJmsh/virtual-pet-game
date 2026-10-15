import React from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

const WAVES = [12, 32, 52, 72, 90];

/** Pastel pond background. Reports its size so fish know how far to swim. */
export function Pond({ onLayout }: { onLayout: (e: LayoutChangeEvent) => void }) {
  return (
    <View style={styles.pond} onLayout={onLayout}>
      {WAVES.map((top, i) => (
        <Text key={top} style={[styles.wave, { top: `${top}%`, left: i % 2 ? '-4%' : '4%' }]}>~ ~ ~ ~ ~ ~ ~ ~ ~</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pond: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.water, overflow: 'hidden' },
  wave: { position: 'absolute', fontSize: 22, letterSpacing: 6, color: colors.waterWave },
});
