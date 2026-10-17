import React, { ReactNode, useRef, useState } from "react";
import { Animated, PanResponder, StyleProp, ViewStyle } from "react-native";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * Use inside a horizontal ScrollView. The drag only starts on a mostly-vertical move (so sideways
   * swipes still scroll), and the item itself stays put and dims: the parent draws a floating copy
   * from the x/y it receives, because a ScrollView would clip an item dragged out of it.
   */
  inScroll?: boolean;
  onDragStart?: (x: number, y: number) => void;
  onMove?: (x: number, y: number) => void; // finger position in screen coordinates
  onRelease?: (x: number, y: number) => void;
  onCancel?: () => void; // the gesture was interrupted
}

/** Drag anything with a finger; it springs back to its origin on release. The parent decides what a drop means. */
export function Draggable({ children, style, inScroll, ...handlers }: Props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);
  const h = useRef({ ...handlers, inScroll });
  h.current = { ...handlers, inScroll };

  const back = () =>
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 6,
    }).start();

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !h.current.inScroll,
      onMoveShouldSetPanResponderCapture: (_, g) =>
        !!h.current.inScroll &&
        Math.abs(g.dy) > 6 &&
        Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (_, g) => {
        setDragging(true);
        h.current.onDragStart?.(g.moveX, g.moveY);
      },
      onPanResponderMove: (_, g) => {
        if (!h.current.inScroll) pan.setValue({ x: g.dx, y: g.dy });
        h.current.onMove?.(g.moveX, g.moveY);
      },
      onPanResponderRelease: (_, g) => {
        setDragging(false);
        h.current.onRelease?.(g.moveX, g.moveY);
        if (!h.current.inScroll) back();
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        h.current.onCancel?.();
        if (!h.current.inScroll) back();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        style,
        inScroll
          ? { opacity: dragging ? 0.3 : 1 }
          : {
              zIndex: dragging ? 100 : 1,
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: dragging ? 1.15 : 1 },
              ],
            },
      ]}
    >
      {children}
    </Animated.View>
  );
}
