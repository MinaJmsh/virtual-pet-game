import React, { ReactNode, useState } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children: ReactNode;
}

/** Shared press feedback: scale 0.95 in 80ms, springy return, optional pressed fill. */
export function PressableScale({ style, pressedStyle, scaleTo = 0.95, children, onPressIn, onPressOut, ...rest }: Props) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      hitSlop={8}
      {...rest}
      onPressIn={(e) => {
        setPressed(true);
        if (!reduceMotion) scale.value = withTiming(scaleTo, { duration: 80 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        scale.value = reduceMotion ? 1 : withSpring(1, { damping: 8, stiffness: 300 });
        onPressOut?.(e);
      }}
      style={[style, pressed ? pressedStyle : null, animated]}
    >
      {children}
    </AnimatedPressable>
  );
}
