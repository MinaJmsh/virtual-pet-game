import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, outlineWidth, radii } from '@/theme/tokens';
import { CozyText } from './CozyText';
import { IconSource, Illustration } from './Illustration';
import { PressableScale } from './PressableScale';

interface Props {
  icon: IconSource;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

/** The one primary-action button (Cook, Buy, Use, Feed...). Only icon and caption change. */
export function ActionButton({ icon, label, onPress, disabled }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.base, disabled && styles.disabled]}
      pressedStyle={styles.pressed}
    >
      <View style={{ opacity: disabled ? 0.45 : 1 }}>
        <Illustration icon={icon} size={28} />
      </View>
      <CozyText variant="caption" color={disabled ? 'disabledText' : 'textPrimary'}>{label}</CozyText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 58,
    height: 55,
    paddingHorizontal: 4,
    borderRadius: radii.button,
    backgroundColor: colors.coral,
    borderWidth: outlineWidth.regular,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.coralPressed },
  disabled: { backgroundColor: colors.disabledFill, borderColor: colors.outlineSoft },
});
