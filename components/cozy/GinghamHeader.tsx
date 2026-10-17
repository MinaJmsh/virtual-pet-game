import { colors, sizes, spacing } from "@/theme/tokens";
import React, { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { TAB_ROW_HEIGHT } from "./FolderTabRow";
import { SketchLine } from "./SketchBorder";

const CELL = 25; // one gingham square
const STRIPE_OPACITY = 0.3; // two crossing stripes stack to a darker square, like woven gingham

/**
 * Gingham: translucent pink stripes, vertical and horizontal, with soft edges.
 * Light where nothing crosses, medium on one stripe, dark where two overlap.
 * withTab: the header grows downward so a FolderTabRow (overlap) can sit on it with the pink showing beside the bump.
 */
export function GinghamHeader({
  children,
  withTab,
}: {
  children?: ReactNode;
  withTab?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const height =
    Math.max(sizes.headerHeight, insets.top + 76) +
    (withTab ? TAB_ROW_HEIGHT : 0);

  const verticals = Array.from(
    { length: Math.ceil(width / (CELL * 2)) + 1 },
    (_, i) => i * CELL * 2,
  );
  const horizontals = Array.from(
    { length: Math.ceil(height / (CELL * 2)) + 1 },
    (_, i) => i * CELL * 2,
  );

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="gingV" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.ginghamStripe} stopOpacity={0} />
            <Stop
              offset="0.22"
              stopColor={colors.ginghamStripe}
              stopOpacity={STRIPE_OPACITY}
            />
            <Stop
              offset="0.78"
              stopColor={colors.ginghamStripe}
              stopOpacity={STRIPE_OPACITY}
            />
            <Stop offset="1" stopColor={colors.ginghamStripe} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id="gingH" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.ginghamStripe} stopOpacity={0} />
            <Stop
              offset="0.22"
              stopColor={colors.ginghamStripe}
              stopOpacity={STRIPE_OPACITY}
            />
            <Stop
              offset="0.78"
              stopColor={colors.ginghamStripe}
              stopOpacity={STRIPE_OPACITY}
            />
            <Stop offset="1" stopColor={colors.ginghamStripe} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {verticals.map((x) => (
          <Rect
            key={`v${x}`}
            x={x}
            y={0}
            width={CELL}
            height={height}
            fill="url(#gingV)"
          />
        ))}
        {horizontals.map((y) => (
          <Rect
            key={`h${y}`}
            x={0}
            y={y}
            width={width}
            height={CELL}
            fill="url(#gingH)"
          />
        ))}
      </Svg>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: withTab ? TAB_ROW_HEIGHT : 0,
          },
        ]}
      >
        {children}
      </View>
      {withTab ? null : <SketchLine style={styles.line} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ginghamB,
    overflow: "hidden",
  },
  line: { position: "absolute", left: 0, right: 0, bottom: -3 },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
});
