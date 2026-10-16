import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, outlineWidth, radii, spacing } from '@/theme/tokens';
import { CozyText } from './CozyText';
import { IconSource, Illustration } from './Illustration';
import { PressableScale } from './PressableScale';
import { SketchBorder } from './SketchBorder';

interface Props {
  icon: IconSource;
  value: number | string;
  onPress?: () => void;
}

export function CurrencyPill({ icon, value, onPress }: Props) {
  return (
    <PressableScale onPress={onPress} disabled={!onPress} style={styles.wrap}>
      <View style={styles.pill}>
        <CozyText variant="numberLarge">{value}</CozyText>
        <SketchBorder radius={radii.pill} />
      </View>
      <View style={styles.icon}>
        <Illustration icon={icon} size={34} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: { marginLeft: spacing.sm },
  pill: {
    height: 29,
    minWidth: 100,
    paddingLeft: 32,
    paddingRight: spacing.md,
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.creamWhite,
  },
  icon: { position: 'absolute', left: -8, top: -9, transform: [{ rotate: '-8deg' }] },
});
