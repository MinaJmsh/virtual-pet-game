import { colors, radii } from "@/theme/tokens";
import { useGridCellSize } from "@/utils/UseGridCellSize";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { PressableScale } from "./PressableScale";

interface Props {
  onPress: () => void;
  label: string; // accessibility
  size?: number; // fixed square size (shelf); omit to match the grid cells exactly
  radius?: number;
}

/** "+" placeholder: dashed muted border, exactly the same size as an item. Put it at the end of a list/shelf. */
export function AddCell({ onPress, label, size, radius = radii.cell }: Props) {
  const gridSize = useGridCellSize();
  const side = size ?? gridSize;
  const [pressed] = useState(false);

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: side, height: side }}
    >
      <Svg width={side} height={side} style={StyleSheet.absoluteFill}>
        <Rect
          x={1.5}
          y={1.5}
          width={side - 3}
          height={side - 3}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={colors.outlineSoft}
          strokeWidth={2}
          strokeDasharray="7 6"
          strokeLinecap="round"
          opacity={pressed ? 0.6 : 1}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <FontAwesome6
          name="plus"
          size={size ? 18 : 22}
          color={colors.outlineSoft}
        />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
