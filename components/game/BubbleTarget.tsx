import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Bubble } from '@/game/bubbles';

const SIZE = 56;

interface Props {
  bubble: Bubble;
  areaWidth: number;
  areaHeight: number;
  onPop: (bubble: Bubble) => void;
}

/** One bubble floating from the bottom to the top. Tap to pop. */
export function BubbleTarget({ bubble, areaWidth, areaHeight, onPop }: Props) {
  const y = useSharedValue(areaHeight);
  useEffect(() => {
    y.value = withTiming(-SIZE, { duration: bubble.durationMs, easing: Easing.linear });
  }, [bubble, areaHeight, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return (
    <Animated.View style={[styles.wrap, { left: bubble.x * (areaWidth - SIZE) }, style]}>
      <Pressable onPress={() => onPop(bubble)} hitSlop={8} style={styles.hit} accessibilityRole="button" accessibilityLabel="Pop bubble">
        <Text style={styles.emoji}>{bubble.emoji}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, width: SIZE, height: SIZE },
  hit: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 42, lineHeight: 50 },
});
