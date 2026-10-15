import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';

interface Props {
  viewHeight: number;
  contentHeight: number;
  offset: number;
}

/** Always-visible coral scrollbar (track 6dp, thumb 8dp, min thumb 60dp). */
export function Scrollbar({ viewHeight, contentHeight, offset }: Props) {
  if (viewHeight <= 0 || contentHeight <= viewHeight + 1) return null;
  const track = viewHeight - 8;
  const thumb = Math.max(60, (viewHeight / contentHeight) * track);
  const progress = Math.min(1, Math.max(0, offset / (contentHeight - viewHeight)));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.track, { top: 4, height: track }]} />
      <View style={[styles.thumb, { top: 4 + progress * (track - thumb), height: thumb }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { position: 'absolute', right: 5, width: 6, borderRadius: 3, backgroundColor: colors.scrollTrack },
  thumb: { position: 'absolute', right: 4, width: 8, borderRadius: 4, backgroundColor: colors.coral },
});
