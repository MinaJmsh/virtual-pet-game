import { colors } from "@/theme/tokens";
import React from "react";
import { View } from "react-native";
import { PressableScale } from "./PressableScale";
import { SketchPolygon } from "./SketchBorder";

// Rounded-ish triangle pointing left (hand-drawn); mirrored for "right".
const LEFT_TRIANGLE: [number, number][] = [
  [22, 5],
  [5, 17],
  [22, 29],
];

export function ArrowButton({
  direction,
  onPress,
}: {
  direction: "left" | "right";
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel={direction === "left" ? "Previous" : "Next"}
    >
      {/* The flip lives on an inner view: PressableScale's press animation replaces any transform on its own style. */}
      <View style={{ transform: [{ scaleX: direction === "left" ? 1 : -1 }] }}>
        <SketchPolygon
          width={28}
          height={34}
          poly={LEFT_TRIANGLE}
          fill={colors.creamWhite}
        />
      </View>
    </PressableScale>
  );
}
