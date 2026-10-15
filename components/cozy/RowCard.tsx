import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';

/** Plain list-row container: beige fill, no outline. Compose contents inside. */
export function RowCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    minHeight: 105,
    borderRadius: radii.card,
    backgroundColor: colors.cardFill,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
