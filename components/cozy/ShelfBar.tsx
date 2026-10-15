import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, outlineWidth, spacing } from '@/theme/tokens';
import { CozyText } from './CozyText';

/** Full-width shelf that sits between the room and the bottom panel. Items on it can be dragged up into the room. */
export function ShelfBar({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={styles.shelf}>
      {title ? <CozyText variant="caption" color="textSecondary">{title}</CozyText> : null}
      <View style={styles.row}>{children}</View>
      <View style={styles.board} />
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: {
    zIndex: 10, // above the room so dragged items stay visible
    backgroundColor: colors.cardFill,
    borderTopWidth: outlineWidth.regular,
    borderTopColor: colors.outline,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xs },
  board: { height: 6, marginHorizontal: -spacing.md, backgroundColor: colors.outlineSoft, borderTopWidth: outlineWidth.regular, borderTopColor: colors.outline },
});
