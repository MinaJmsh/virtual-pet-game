import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, outlineWidth, radii } from '@/theme/tokens';
import { CozyText } from './CozyText';
import { PressableScale } from './PressableScale';
import { SketchBorder } from './SketchBorder';

export function BackButton({ onPress }: { onPress?: () => void }) {
  const router = useRouter();
  return (
    <PressableScale onPress={onPress ?? (() => router.back())} style={styles.button} accessibilityLabel="Back" accessibilityRole="button">
      <CozyText variant="title" color="accentRed" style={styles.chevron}>‹</CozyText>
      <SketchBorder radius={radii.small} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    borderRadius: radii.small,
    backgroundColor: colors.creamWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: { fontSize: 26, lineHeight: 28, marginTop: -2 },
});
