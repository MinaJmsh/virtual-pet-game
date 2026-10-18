import { ActionButton } from "@/components/cozy/ActionButton";
import { CozyText } from "@/components/cozy/CozyText";
import { IconSource, Illustration } from "@/components/cozy/Illustration";
import { SketchLine } from "@/components/cozy/SketchBorder";
import { colors, spacing } from "@/theme/tokens";
import React from "react";
import { StyleSheet, View } from "react-native";
// ...
export interface ShopDetail {
  name: string;
  icon: IconSource; // was string
  description: string;
}

export interface ShopAction {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

interface Props {
  item: ShopDetail | null;
  subtitle: string; // price / owned info
  action: ShopAction | null;
}

/** Bottom bar for the selected shop entry: icon, name, description, price and the action button. */
export function ShopActionBar({ item, subtitle, action }: Props) {
  return (
    <View style={styles.bar}>
      <SketchLine style={styles.topLine} />
      {item ? (
        <>
          <Illustration icon={item.icon} size={44} />
          <View style={styles.info}>
            <CozyText variant="title" numberOfLines={1}>
              {item.name}
            </CozyText>
            <CozyText variant="label" color="textSecondary" numberOfLines={2}>
              {item.description}
            </CozyText>
            <CozyText variant="caption">{subtitle}</CozyText>
          </View>
          {action ? (
            <ActionButton
              icon={action.icon}
              label={action.label}
              onPress={action.onPress}
              disabled={action.disabled}
            />
          ) : null}
        </>
      ) : (
        <CozyText variant="label" color="textSecondary">
          Tap an item to see details
        </CozyText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bgApp,
  },
  topLine: { position: "absolute", left: 0, right: 0, top: -4 },
  info: { flex: 1, gap: 2 },
});
