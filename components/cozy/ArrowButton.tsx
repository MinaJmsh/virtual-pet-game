import React from 'react';
import { SketchPolygon } from './SketchBorder';
import { PressableScale } from './PressableScale';
import { colors } from '@/theme/tokens';

// Rounded-ish triangle pointing left (hand-drawn); mirrored for "right".
const LEFT_TRIANGLE: [number, number][] = [[22, 5], [5, 17], [22, 29]];

export function ArrowButton({ direction, onPress }: { direction: 'left' | 'right'; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel={direction === 'left' ? 'Previous' : 'Next'}
      style={{ transform: [{ scaleX: direction === 'left' ? 1 : -1 }] }}
    >
      <SketchPolygon width={28} height={34} poly={LEFT_TRIANGLE} fill={colors.creamWhite} />
    </PressableScale>
  );
}
