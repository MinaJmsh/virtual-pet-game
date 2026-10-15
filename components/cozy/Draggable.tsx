import React, { ReactNode, useRef, useState } from 'react';
import { Animated, PanResponder, StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onDragStart?: () => void;
  onMove?: (x: number, y: number) => void; // finger position in screen coordinates
  onRelease?: (x: number, y: number) => void;
}

/** Drag anything with a finger; it springs back to its origin on release. The parent decides what a drop means. */
export function Draggable({ children, style, ...handlers }: Props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);
  const h = useRef(handlers);
  h.current = handlers;

  const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 6 }).start();

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => { setDragging(true); h.current.onDragStart?.(); },
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy });
        h.current.onMove?.(g.moveX, g.moveY);
      },
      onPanResponderRelease: (_, g) => { setDragging(false); h.current.onRelease?.(g.moveX, g.moveY); back(); },
      onPanResponderTerminate: () => { setDragging(false); back(); },
    }),
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[style, { zIndex: dragging ? 100 : 1, transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: dragging ? 1.15 : 1 }] }]}
    >
      {children}
    </Animated.View>
  );
}
