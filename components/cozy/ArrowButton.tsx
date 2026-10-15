import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors, outlineWidth } from '@/theme/tokens';
import { PressableScale } from './PressableScale';

// Rounded triangle pointing left; mirrored for "right".
const LEFT_TRIANGLE = 'M21 4 L6 14.5 Q3 17 6 19.5 L21 30 Q25 32.5 25 28 L25 6 Q25 1.5 21 4 Z';

export function ArrowButton({ direction, onPress }: { direction: 'left' | 'right'; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel={direction === 'left' ? 'Previous' : 'Next'}
      style={{ transform: [{ scaleX: direction === 'left' ? 1 : -1 }] }}
    >
      <Svg width={28} height={34} viewBox="0 0 28 34">
        <Path d={LEFT_TRIANGLE} fill={colors.creamWhite} stroke={colors.outline} strokeWidth={outlineWidth.regular} strokeLinejoin="round" />
      </Svg>
    </PressableScale>
  );
}
