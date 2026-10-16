import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';
import { CozyText } from './CozyText';
import { SketchLine } from './SketchBorder';

/** Full-width shelf that sits between the room and the bottom panel. Items on it can be dragged up into the room. */
export function ShelfBar({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={styles.shelf}>
      <SketchLine style={styles.topLine} />
      {title ? <CozyText variant="caption" color="textSecondary">{title}</CozyText> : null}
      <View style={styles.row}>{children}</View>
      <View style={styles.board}><SketchLine style={styles.boardLine} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: {
    zIndex: 10, // above the room so dragged items stay visible
    backgroundColor: colors.cardFill,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  topLine: { position: 'absolute', left: 0, right: 0, top: -4 },
  boardLine: { position: 'absolute', left: 0, right: 0, top: -4 },
  row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xs },
  board: { height: 6, marginHorizontal: -spacing.md, backgroundColor: colors.outlineSoft },
});
