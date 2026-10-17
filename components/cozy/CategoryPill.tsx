import { colors, radii } from "@/theme/tokens";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { PressableScale } from "./PressableScale";

export type FaIconName = React.ComponentProps<typeof FontAwesome6>["name"];

interface Props {
  icon: FaIconName; // FontAwesome 6 solid icon name, e.g. 'bed'
  active?: boolean;
  label?: string; // accessibility only (pills are icon-only)
  onPress: () => void;
}

/** Inactive: transparent with a pink border and pink icon. Active: filled pink, icon in the background colour (looks cut out). */
export function CategoryPill({ icon, active, label, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!active }}
      style={[styles.base, active && styles.active]}
    >
      <FontAwesome6
        name={icon}
        size={19}
        color={active ? colors.bgApp : colors.coral}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 65,
    height: 38,
    borderRadius: radii.card,
    borderWidth: 2.5,
    borderColor: colors.coral,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  active: { backgroundColor: colors.coral },
});
