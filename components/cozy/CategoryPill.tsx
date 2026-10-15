import React from 'react';
import { StyleSheet } from 'react-native';
import { colors, outlineWidth, radii } from '@/theme/tokens';
import { IconSource, Illustration } from './Illustration';
import { PressableScale } from './PressableScale';

interface Props {
  icon: IconSource;
  active?: boolean;
  label?: string; // accessibility only (pills are icon-only)
  onPress: () => void;
}

export function CategoryPill({ icon, active, label, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
      style={[styles.base, active ? styles.active : styles.inactive]}
    >
      <Illustration icon={icon} size={24} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { width: 65, height: 38, borderRadius: radii.card, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.coral, borderWidth: outlineWidth.thin, borderColor: colors.coral },
  inactive: { backgroundColor: colors.pinkLight, borderWidth: outlineWidth.thin, borderColor: colors.coral, opacity: 0.85 },
});
