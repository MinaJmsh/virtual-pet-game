import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, sizes, spacing } from '@/theme/tokens';
import { SketchLine } from './SketchBorder';

const CELL = 40;

export function GinghamHeader({ children }: { children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const height = Math.max(sizes.headerHeight, insets.top + 76);

  const squares = useMemo(() => {
    const rows = Math.ceil(height / CELL);
    const cols = Math.ceil(width / CELL);
    const out: { key: string; left: number; top: number }[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if ((r + c) % 2 === 0) out.push({ key: `${r}-${c}`, left: c * CELL, top: r * CELL });
    return out;
  }, [width, height]);

  return (
    <View style={[styles.container, { height }]}>
      {squares.map((s) => (
        <View key={s.key} style={[styles.square, { left: s.left, top: s.top }]} />
      ))}
      <View style={[styles.content, { paddingTop: insets.top }]}>{children}</View>
      <SketchLine style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ginghamA,
    overflow: 'hidden',
  },
  line: { position: 'absolute', left: 0, right: 0, bottom: -3 },
  square: { position: 'absolute', width: CELL, height: CELL, backgroundColor: colors.ginghamB },
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.md },
});
