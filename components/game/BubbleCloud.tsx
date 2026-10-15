import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SPOTS: [number, number, number][] = [
  [8, 20, 34], [70, 10, 40], [40, 2, 30], [78, 55, 36], [2, 58, 32], [58, 78, 30], [24, 82, 36], [44, 40, 38],
];

/** Shows the first `count` emoji (bubbles/drops) scattered around the cat. */
export function BubbleCloud({ emoji, count }: { emoji: string; count: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {SPOTS.slice(0, count).map(([x, y, size], i) => (
        <Text key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, fontSize: size }}>{emoji}</Text>
      ))}
    </View>
  );
}
