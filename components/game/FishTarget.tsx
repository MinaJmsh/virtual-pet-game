import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Fish } from '@/game/fishing';

const SIZE = 52;

interface Props {
  fish: Fish;
  pondWidth: number;
  pondHeight: number;
  onCatch: (fish: Fish) => void;
}

/** One swimming fish. Crosses the pond once, linearly; tap to catch. */
export function FishTarget({ fish, pondWidth, pondHeight, onCatch }: Props) {
  const x = useSharedValue(fish.fromLeft ? -SIZE : pondWidth);

  useEffect(() => {
    x.value = withTiming(fish.fromLeft ? pondWidth : -SIZE, { duration: fish.durationMs, easing: Easing.linear });
  }, [fish, pondWidth, x]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Animated.View style={[styles.wrap, { top: fish.y * (pondHeight - SIZE) }, style]}>
      <Pressable onPress={() => onCatch(fish)} hitSlop={10} style={styles.hit} accessibilityRole="button" accessibilityLabel="Catch fish">
        <Text style={[styles.emoji, { transform: [{ scaleX: fish.fromLeft ? -1 : 1 }] }]}>{fish.emoji}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, width: SIZE, height: SIZE },
  hit: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 38, lineHeight: 46 },
});
