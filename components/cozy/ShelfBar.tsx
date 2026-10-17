import { colors, spacing } from "@/theme/tokens";
import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { CozyText } from "./CozyText";
import { SketchLine } from "./SketchBorder";

export const SHELF_HEIGHT = 120;

interface Props {
  title?: string;
  scroll?: boolean; // items scroll sideways (no scrollbar)
  children: ReactNode;
}

/** Full-width shelf that sits over the bottom of the room. Items on it can be dragged up to the cat. */
export function ShelfBar({ title, scroll, children }: Props) {
  return (
    <View style={styles.shelf}>
      <SketchLine style={styles.topLine} />
      {title ? (
        <CozyText variant="caption" color="textSecondary">
          {title}
        </CozyText>
      ) : null}
      {scroll ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollRow}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.row}>{children}</View>
      )}
      <View style={styles.board}>
        <SketchLine style={styles.boardLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: {
    height: SHELF_HEIGHT,
    zIndex: 10, // above the room so dragged items stay visible
    backgroundColor: colors.cardFill,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  topLine: { position: "absolute", left: 0, right: 0, top: -4 },
  boardLine: { position: "absolute", left: 0, right: 0, top: -4 },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingVertical: spacing.xs,
  },
  // reaches the screen edges, while the first item still lines up with the title
  scroll: { flex: 1, marginHorizontal: -spacing.md },
  scrollRow: {
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  board: {
    height: 6,
    marginHorizontal: -spacing.md,
    backgroundColor: colors.outlineSoft,
  },
});
