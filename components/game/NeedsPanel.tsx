import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CozyText } from '@/components/cozy/CozyText';
import { Illustration } from '@/components/cozy/Illustration';
import { Needs, NeedKey } from '@/game/types';
import { SketchBorder } from '@/components/cozy/SketchBorder';
import { colors, spacing } from '@/theme/tokens';

const META: { key: NeedKey; icon: string; label: string }[] = [
  { key: 'hunger', icon: '🍖', label: 'Hunger' },
  { key: 'energy', icon: '🌙', label: 'Energy' },
  { key: 'hygiene', icon: '🫧', label: 'Hygiene' },
  { key: 'happiness', icon: '💗', label: 'Happy' },
];

function NeedMeter({ icon, label, value }: { icon: string; label: string; value: number }) {
  const low = value <= 20;
  return (
    <View style={styles.meter} accessible accessibilityLabel={`${label} ${Math.round(value)} percent`}>
      <Illustration icon={icon} size={22} />
      <View style={styles.trackWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${value}%`, backgroundColor: low ? colors.accentRed : colors.coral }]} />
        </View>
        <SketchBorder radius={6} />
      </View>
    </View>
  );
}

export function NeedsPanel({ needs }: { needs: Needs }) {
  return (
    <View style={styles.grid}>
      {META.map((m) => (
        <NeedMeter key={m.key} icon={m.icon} label={m.label} value={needs[m.key]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.lg, rowGap: spacing.sm },
  meter: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  trackWrap: { flex: 1, height: 12 },
  track: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: colors.creamWhite,
    overflow: 'hidden',
  },
  fill: { height: '100%' },
});
