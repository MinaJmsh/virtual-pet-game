import { colors, outlineWidth, radii, spacing } from "@/theme/tokens";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconSource, Illustration } from "./Illustration";
import { NotificationDot } from "./NotificationDot";
import { PressableScale } from "./PressableScale";
import { SketchBorder, SketchLine } from "./SketchBorder";

export interface FolderTab {
  key: string;
  icon: IconSource;
  badge?: boolean;
}

interface Props {
  tabs: FolderTab[];
  activeKey: string;
  onChange: (key: string) => void;
  overlap?: boolean; // pull the strip up over the element above it (so that element shows beside the bump)
}

const TAB_H = 36;
const TAB_GAP = 10; // space between neighbouring tabs
const LINE = outlineWidth.regular;
export const TAB_ROW_HEIGHT = TAB_H + 8 + LINE;

/** Folder tabs sitting on a divider line. The active tab covers the line so it merges with the panel. */
export function FolderTabRow({ tabs, activeKey, onChange, overlap }: Props) {
  return (
    <View style={[styles.row, overlap && { marginTop: -TAB_ROW_HEIGHT }]}>
      {/* Page-coloured strip under the line, so nothing from behind shows between the line and the page. */}
      <View style={styles.pageStrip} />
      <SketchLine style={styles.line} />
      {tabs.map((tab, i) => {
        const active = tab.key === activeKey;
        return (
          <PressableScale
            key={tab.key}
            onPress={() => onChange(tab.key)}
            scaleTo={0.97}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[
              styles.tab,
              active ? styles.active : styles.inactive,
              i > 0 && { marginLeft: TAB_GAP },
            ]}
          >
            <Illustration icon={tab.icon} size={26} />
            <SketchBorder radius={radii.tab} sides="tab" />
            {tab.badge ? <NotificationDot /> : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: TAB_ROW_HEIGHT,
    paddingLeft: spacing.md,
  },
  pageStrip: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: colors.bgApp,
  },
  // Sits fully inside the row (its ragged edge never pokes below it, which showed as a thin line under the active tab).
  line: { position: "absolute", left: 0, right: 0, bottom: -2, zIndex: 2 },
  tab: {
    width: 66,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: radii.tab,
    borderTopRightRadius: radii.tab,
  },
  // Inactive tabs end under the line, so no sliver of coral shows below it.
  inactive: {
    height: TAB_H,
    marginBottom: 3,
    backgroundColor: colors.coral,
    zIndex: 1,
  },
  // The active tab reaches the bottom of the row and covers the line, merging with the page.
  active: { height: TAB_ROW_HEIGHT, backgroundColor: colors.bgApp, zIndex: 3 },
});
