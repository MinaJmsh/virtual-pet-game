import React from 'react';
import { StyleSheet } from 'react-native';
import { colors, outlineWidth, radii } from '@/theme/tokens';
import { CozyText } from './CozyText';
import { PressableScale } from './PressableScale';

export function CollapseButton({ collapsed, onPress }: { collapsed: boolean; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={collapsed ? 'Show panel' : 'Hide panel'} style={styles.button}>
      <CozyText variant="title" color="accentRed" style={styles.chevron}>{collapsed ? '⌃' : '⌄'}</CozyText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 28,
    height: 28,
    borderRadius: radii.small,
    backgroundColor: colors.creamWhite,
    borderWidth: outlineWidth.regular,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: { fontSize: 20, lineHeight: 22 },
});
