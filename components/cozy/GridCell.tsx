import { colors, radii, spacing } from "@/theme/tokens";
import { useGridCellSize } from "@/utils/UseGridCellSize";
import React from "react";
import { StyleSheet, View } from "react-native";
import { CozyText } from "./CozyText";
import { IconSource, Illustration } from "./Illustration";
import { PressableScale } from "./PressableScale";
import { SketchBorder } from "./SketchBorder";

interface Props {
  icon: IconSource;
  name: string;
  caption?: string; // e.g. price
  statusLabel?: string; // e.g. "In Use" (replaces the name)
  selected?: boolean;
  onPress: () => void;
}

export function GridCell({
  icon,
  name,
  caption,
  statusLabel,
  selected,
  onPress,
}: Props) {
  const size = useGridCellSize();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ selected: !!selected }}
      style={[
        styles.cell,
        { width: size, height: size },
        selected && styles.selected,
      ]}
      pressedStyle={styles.pressed}
    >
      <View style={styles.art}>
        <Illustration icon={icon} size={52} />
      </View>
      <CozyText
        variant="label"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.9}
        style={styles.name}
      >
        {statusLabel ?? name}
      </CozyText>
      {caption ? (
        <CozyText variant="caption" color="textSecondary">
          {caption}
        </CozyText>
      ) : null}
      {selected ? <SketchBorder radius={radii.cell} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderRadius: radii.cell,
    backgroundColor: colors.cardFill,
    padding: spacing.sm,
    alignItems: "center",
  },
  selected: { backgroundColor: colors.creamWhite },
  pressed: { backgroundColor: colors.cardFillPressed },
  art: { flex: 1, alignItems: "center", justifyContent: "center" },
  name: { textAlign: "center" },
});
